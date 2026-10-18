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
      gameOver: !!state.gameOver
    };
  }

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
          description.push({ type: "text", text: rule.text });
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

  function buildInfoVM() {
    const entries = Game.getInfo();
    return { visible: entries.length > 0, entries: entries.slice() };
  }

  function buildActionsVM(loc) {
    const state = Game.getState();
    const last = state.lastAction;
    const result = [];

    loc.actions.forEach(action => {
      // Действия типа "link" не показываются в списке — только через ссылки в тексте.
      if (action.type === "link") return;

      if (action.once && state.flags[action.id + "_done"]) return;
      if (action.hiddenWhen && Rules.checkCondition(action.hiddenWhen, state, GAME_DATA)) return;

      const available = Rules.checkCondition(action.condition, state, GAME_DATA);
      const isRecent = !!(last && last.id === action.id && last.location === state.location);
      const count = isRecent ? (state.streakCount || 0) : 0;

      result.push({
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
      });
    });

    return result;
  }

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

  function buildInventoryVM() {
    const state = Game.getState();
    const counts = {};
    state.inventory.forEach(id => {
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
          consumable: !!item.consumable
        };
      })
      .filter(Boolean);

    return { type: "inventory", items };
  }

  function resolveDescription(description, state) {
    if (typeof description === "function") {
      try { return String(description(state) || ""); }
      catch (e) { console.warn(`Ошибка в описании предмета:`, e); return ""; }
    }
    return String(description || "");
  }

  function buildMapVM() {
    const state = Game.getState();
    const rows = Object.entries(GAME_DATA.locations).map(([id, loc]) => ({
      id,
      name: loc.name,
      current: state.location === id,
      reachable: Rules.isAdjacent(GAME_DATA, state.location, id),
      open: Rules.isLocationOpen(GAME_DATA, id, state.variables.minutes, state.variables.day)
    }));
    return { type: "map", rows };
  }

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

  function buildCharacterVM() {
    const state = Game.getState();
    const ch = GAME_DATA.character || {};
    const v = state.variables;
    const needsMax = GAME_DATA.needsMax ?? 100;
    return {
      name: ch.name || "",
      avatar: ch.avatar || "",
      avatarAlt: ch.avatarAlt || "",
      description: ch.description || "",
      bars: [
        { key: "health", label: "Здоровье", value: v.health ?? 0, max: GAME_DATA.healthMax ?? 100, color: "health" },
        { key: "stamina", label: "Выносливость", value: v.stamina ?? 0, max: GAME_DATA.staminaMax ?? 100, color: "stamina" },
        { key: "hunger", label: "Голод", value: v.hunger ?? 0, max: needsMax, color: "hunger" },
        { key: "thirst", label: "Жажда", value: v.thirst ?? 0, max: needsMax, color: "thirst" },
        { key: "fatigue", label: "Усталость", value: v.fatigue ?? 0, max: needsMax, color: "fatigue" }
      ]
    };
  }

  Object.assign(window.Game, {
    buildViewModel,
    buildStatusVM,
    buildLocationVM,
    buildInfoVM,
    buildActionsVM,
    buildSideVM,
    buildSideContentVM,
    buildInventoryVM,
    buildMapVM,
    buildQuestsVM,
    buildCharacterVM
  });
})();