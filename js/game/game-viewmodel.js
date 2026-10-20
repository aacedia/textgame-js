/*
  Сборка view-модели. Только чтение состояния.
*/
window.Game = window.Game || {};

(() => {
  "use strict";

  const GAME_DATA = window.GAME_DATA;
  const Rules = window.Rules;
  if (!GAME_DATA) { console.error("game-viewmodel.js: window.GAME_DATA не найден."); return; }
  if (!Rules) { console.error("game-viewmodel.js: window.Rules не найден."); return; }

  /* ---------- главный сборщик ---------- */

  function buildViewModel() {
    const state = Game.getState();
    const loc = GAME_DATA.locations[state.location];
    return {
      status: buildStatusVM(),
      location: buildLocationVM(loc),
      info: buildInfoVM(),
      actions: buildActionsVM(loc),
      log: Game.getLog().slice(0, Game.LOG_LIMIT),
      side: buildSideVM(),
      controlsOpen: !!state.controlsOpen,
      logOpen: !!state.logOpen,
      gameOver: !!state.gameOver,
      dialogue: buildDialogueVM()
    };
  }

  /* ---------- статус ---------- */

  function buildStatusVM() {
    const state = Game.getState();
    const timeOfDay = Rules.getTimeOfDay(state.variables.minutes);
    const date = Rules.formatDate(state.variables.day, GAME_DATA);
    return {
      day: state.variables.day,
      date,
      time: Rules.formatTime(state.variables.minutes),
      timeOfDay,
      timeIcon: Rules.describeTimeOfDay(timeOfDay),
      money: state.variables.money
    };
  }

  /* ---------- локация ---------- */

  // Подставляет {varName} из state.variables в строку.
  function interpolate(text, state) {
    return String(text).replace(/\{(\w+)\}/g, (_, key) => {
      const v = state.variables[key];
      return v != null ? String(v) : `{${key}}`;
    });
  }

  function buildLocationVM(loc) {
    const state = Game.getState();
    const openNow = Rules.isLocationOpen(GAME_DATA, state.location, state.variables.minutes, state.variables.day);
    const hoursText = loc.hours ? Rules.describeHours(loc.hours) : "";

    let tagText = loc.tag || "";
    let tagClass = "";
    if (loc.hours && !openNow) {
      tagText = `Закрыто · ${hoursText}`;
      tagClass = "closed";
    }

    let notice = "";
    if (loc.hours && !openNow) {
      notice = `${loc.name} закрыт. Откроется в ${Rules.formatTime(loc.hours.from)}.`;
    }

    const description = [];

    (loc.description || []).forEach(p => {
      if (p) description.push({ type: "text", text: p });
    });

    if (Array.isArray(loc.extraDescription)) {
      loc.extraDescription.forEach(rule => {
        if (rule.condition && !Rules.checkCondition(rule.condition, state, GAME_DATA)) return;
        if (Array.isArray(rule.parts)) {
          description.push({ type: "parts", parts: rule.parts });
        } else if (rule.text) {
          description.push({ type: "text", text: interpolate(rule.text, state) });
        }
      });
    }

    const infoVisible = Game.getInfo().length > 0;
    const showImage = !infoVisible && !!loc.image;

    return {
      name: loc.name,
      tag: loc.tag,
      tagText,
      tagClass,
      notice,
      description,
      image: showImage ? loc.image : "",
      imageAlt: showImage ? (loc.imageAlt || "") : "",
      imageCaption: showImage ? (loc.imageCaption || "") : ""
    };
  }

  /* ---------- информация ---------- */

  function buildInfoVM() {
    const entries = Game.getInfo();
    return { visible: entries.length > 0, entries: entries.slice() };
  }

  /* ---------- действия ---------- */

  function buildActionsVM(loc) {
    const state = Game.getState();
    const last = state.lastAction;
    const backActions = [];
    const normalActions = [];

    loc.actions.forEach(action => {
      // Действия типа "link" не показываются в списке — только через ссылки в тексте.
      if (action.type === "link") return;

      if (action.once && state.flags[action.id + "_done"]) return;
      if (action.hiddenWhen && Rules.checkCondition(action.hiddenWhen, state, GAME_DATA)) return;

      const available = Rules.checkCondition(action.condition, state, GAME_DATA);
      const isRecent = !!(last && last.id === action.id && last.location === state.location);
      const count = isRecent ? (state.streakCount || 0) : 0;

      const vm = {
        id: action.id,
        label: action.label,
        hint: action.hint || "",
        available,
        unavailableReason: available
          ? ""
          : (Rules.describeConditionFailure(action.condition, state, GAME_DATA) || ""),
        accent: Rules.classifyAction(action),
        count,
        recent: isRecent,
        type: action.type || "action",
        choices: action.choices || null
      };

      if (action.type === "back") {
        backActions.push(vm);
      } else {
        normalActions.push(vm);
      }
    });

    return [...backActions, ...normalActions];
  }

  /* ---------- боковая панель ---------- */

  function buildSideVM() {
    const state = Game.getState();
    return {
      activeTab: state.uiTab,
      tabs: [
        { id: "quests", label: "Задания" },
        { id: "inventory", label: "Инвентарь" }
      ],
      content: buildSideContentVM(),
      character: buildCharacterVM()
    };
  }

  function buildSideContentVM() {
    const state = Game.getState();
    switch (state.uiTab) {
      case "inventory": return buildInventoryVM();
      case "quests":
      default: return buildQuestsVM();
    }
  }

  /* ---------- инвентарь ---------- */

  function buildInventoryVM() {
    const state = Game.getState();
    const filter = state.inventoryFilter || "all";
    const counts = {};

    state.inventory.forEach(id => {
      const item = GAME_DATA.items[id];
      if (!item) return;
      if (filter === "consumable" && !item.consumable) return;
      if (filter === "electronics" && !item.electronics) return;
      if (filter === "other" && (item.consumable || item.electronics)) return;
      counts[id] = (counts[id] || 0) + 1;
    });

    const items = Object.entries(counts)
      .map(([id, count]) => {
        const item = GAME_DATA.items[id];
        if (!item) return null;
        return {
          id,
          name: item.name,
          icon: item.icon,
          description: resolveDescription(item.description, state),
          count,
          consumable: !!item.consumable,
          electronics: !!item.electronics
        };
      })
      .filter(Boolean);

    return {
      type: "inventory",
      items,
      filter,
      filters: [
        { id: "all", label: "Все" },
        { id: "consumable", label: "Расходуемые" },
        { id: "electronics", label: "Электроника" },
        { id: "other", label: "Прочее" }
      ]
    };
  }

  function resolveDescription(description, state) {
    if (typeof description === "function") {
      try { return String(description(state) || ""); }
      catch (e) { console.warn(`Ошибка в описании предмета:`, e); return ""; }
    }
    return String(description || "");
  }

  /* ---------- задания ---------- */

  function buildQuestsVM() {
    const state = Game.getState();
    const classDoneToday = state.variables.lastClassDay === state.variables.day;
    const notebookDone = Rules.hasItem(state, "notebook");
    return {
      type: "quests",
      quests: [
        {
          done: classDoneToday,
          text: classDoneToday
            ? "Занятие на сегодня посещено."
            : "Посети занятие в университете (один раз в день)."
        },
        {
          done: notebookDone,
          text: notebookDone
            ? "Блокнот куплен."
            : "Найди магазин и купи блокнот за 100 ₽."
        }
      ]
    };
  }

  /* ---------- персонаж ---------- */

  function buildCharacterVM() {
    const state = Game.getState();
    const ch = GAME_DATA.character || {};
    const v = state.variables;
    const needsMax = GAME_DATA.needsMax ?? 100;
    const moodMax = GAME_DATA.moodMax ?? 100;

    // direction: "high" — плохо при высоких значениях (потребности);
    //            "low"  — плохо при низких значениях (health, stamina, mood).
    function level(value, direction) {
      if (direction === "high") {
        if (value >= 100) return "critical";
        if (value >= 80) return "warning";
        return "normal";
      } else {
        if (value <= 0) return "critical";
        if (value <= 20) return "warning";
        return "normal";
      }
    }

    const health = v.health ?? 0;
    const stamina = v.stamina ?? 0;
    const hunger = v.hunger ?? 0;
    const thirst = v.thirst ?? 0;
    const fatigue = v.fatigue ?? 0;
    const mood = v.mood ?? 0;
    const staminaMax = v.staminaMax ?? GAME_DATA.staminaMax ?? 100;

    return {
      name: ch.name || "",
      avatar: ch.avatar || "",
      avatarAlt: ch.avatarAlt || "",
      description: ch.description || "",
      bars: [
        {
          key: "health", label: "Здоровье",
          value: health, max: GAME_DATA.healthMax ?? 100, color: "health",
          level: level(health, "low"),
          tooltip: "При 0 — конец игры. Восстанавливается сном."
        },
        {
          key: "stamina", label: "Выносливость",
          value: stamina, max: staminaMax, color: "stamina",
          level: level(stamina, "low"),
          tooltip: "Тратится на подработку. Растёт от тренировок в спортзале."
        },
        {
          key: "mood", label: "Настроение",
          value: mood, max: moodMax, color: "mood",
          level: level(mood, "low"),
          tooltip: "Падает со временем, быстрее при высоких потребностях. При 0 потребности растут вдвое быстрее."
        },
        {
          key: "hunger", label: "Голод",
          value: hunger, max: needsMax, color: "hunger",
          level: level(hunger, "high"),
          tooltip: "Растёт со временем. На 100 наносит урон здоровью. Снижается едой."
        },
        {
          key: "thirst", label: "Жажда",
          value: thirst, max: needsMax, color: "thirst",
          level: level(thirst, "high"),
          tooltip: "Растёт со временем. На 100 наносит урон здоровью. Снижается питьём."
        },
        {
          key: "fatigue", label: "Усталость",
          value: fatigue, max: needsMax, color: "fatigue",
          level: level(fatigue, "high"),
          tooltip: "Растёт со временем. На 100 наносит урон здоровью. Снижается сном и отдыхом."
        }
      ]
    };
  }

  /* ---------- диалог ---------- */

  function buildDialogueVM() {
    const state = Game.getState();
    if (!state.dialogue) return null;

    const dlg = (GAME_DATA.dialogues || {})[state.dialogue.id];
    if (!dlg) return null;
    const node = dlg.nodes[state.dialogue.nodeId];
    if (!node) return null;

    const choices = (node.choices || [])
      .map((c, i) => ({ ...c, index: i }))
      .filter(c => !c.condition || Rules.checkCondition(c.condition, state, GAME_DATA));

    const npc = (GAME_DATA.character && GAME_DATA.character.npcs && GAME_DATA.character.npcs[state.dialogue.id]) || {};
    const relationRaw = Number(state.variables[`relationship_${state.dialogue.id}`]) || 0;
    const relationMax = 100;
    const relationPct = Math.max(0, Math.min(100, (relationRaw / relationMax) * 100));

    return {
      text: node.text || "",
      choices,
      npc: {
        name: npc.name || state.dialogue.id,
        avatar: npc.avatar || "",
        avatarAlt: npc.avatarAlt || npc.name || "NPC"
      },
      relationship: {
        value: relationRaw,
        max: relationMax,
        pct: relationPct
      }
    };
  }

  /* ---------- экспорт ---------- */

  Object.assign(window.Game, {
    buildViewModel,
    buildStatusVM,
    buildLocationVM,
    buildInfoVM,
    buildActionsVM,
    buildSideVM,
    buildSideContentVM,
    buildInventoryVM,
    buildQuestsVM,
    buildCharacterVM,
    buildDialogueVM
  });
})();