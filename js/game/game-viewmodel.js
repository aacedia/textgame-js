/*
  Сборка view-модели. Читает state через Game.getState(), Game.getLog(),
  Game.getInfo() и возвращает готовый объект для UI.render.

  Не трогает UI и не меняет состояние. Только читает.

  Публичный API:
    Game.buildViewModel()       -> полный viewModel для UI.render
    Game.buildStatusVM()        -> блок статуса
    Game.buildLocationVM(loc)   -> блок локации
    Game.buildInfoVM()          -> блок «Информация»
    Game.buildActionsVM(loc)    -> список действий
    Game.buildSideVM()          -> боковая панель (вкладки + контент)
    Game.buildSideContentVM()   -> контент активной вкладки
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
      logOpen: !!state.logOpen
    };
  }

  /* ---------- блок статуса (шапка) ---------- */

  function buildStatusVM() {
    const state = Game.getState();
    const loc = GAME_DATA.locations[state.location];
    return {
      day: state.variables.day,
      time: Rules.formatTime(state.variables.minutes),
      money: state.variables.money,
      locationName: loc.name
    };
  }

  /* ---------- блок локации ---------- */

  function buildLocationVM(loc) {
    const state = Game.getState();
    const openNow = Rules.isLocationOpen(GAME_DATA, state.location, state.variables.minutes);
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

    // Если открыта панель «Информация» — не показываем картинку локации,
    // чтобы не дублировать визуальный акцент и освободить место.
    const infoVisible = Game.getInfo().length > 0;
    const showImage = !infoVisible && !!loc.image;

    return {
      name: loc.name,
      tag: loc.tag,
      tagText,
      tagClass,
      notice,
      description: loc.description,
      image: showImage ? loc.image : "",
      imageAlt: showImage ? (loc.imageAlt || "") : "",
      imageCaption: showImage ? (loc.imageCaption || "") : ""
    };
  }

  /* ---------- блок «Информация» ---------- */

  function buildInfoVM() {
    const entries = Game.getInfo();
    return {
      visible: entries.length > 0,
      entries: entries.slice()
    };
  }

  /* ---------- блок действий ---------- */

  function buildActionsVM(loc) {
    const state = Game.getState();
    const result = [];
    loc.actions.forEach(action => {
      // Скрываем "одноразовые" действия, которые уже выполнены.
      if (action.once && state.flags[action.id + "_done"]) return;

      const available = Rules.checkCondition(action.condition, state, GAME_DATA);
      result.push({
        id: action.id,
        label: action.label,
        hint: action.hint || "",
        available,
        unavailableReason: available
          ? ""
          : (Rules.describeConditionFailure(action.condition, state, GAME_DATA) || "")
      });
    });
    return result;
  }

  /* ---------- боковая панель ---------- */

  function buildSideVM() {
    const state = Game.getState();
    return {
      activeTab: state.uiTab,
      tabs: [
        { id: "inventory", label: "Инвентарь" },
        { id: "map", label: "Карта" },
        { id: "quests", label: "Задания" },
        { id: "status", label: "Персонаж" }
      ],
      content: buildSideContentVM()
    };
  }

  function buildSideContentVM() {
    const state = Game.getState();
    switch (state.uiTab) {
      case "inventory":
        return buildInventoryVM();
      case "map":
        return buildMapVM();
      case "quests":
        return buildQuestsVM();
      case "status":
      default:
        return buildCharacterVM();
    }
  }

  /* ---------- вкладки боковой панели ---------- */

  function buildInventoryVM() {
    const state = Game.getState();
    const items = state.inventory
      .map(id => GAME_DATA.items[id])
      .filter(Boolean);
    return { type: "inventory", items };
  }

  function buildMapVM() {
    const state = Game.getState();
    const rows = Object.entries(GAME_DATA.locations).map(([id, loc]) => ({
      id,
      name: loc.name,
      current: state.location === id,
      reachable: Rules.isAdjacent(GAME_DATA, state.location, id),
      open: Rules.isLocationOpen(GAME_DATA, id, state.variables.minutes)
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
    return {
      type: "status",
      info: {
        name: ch.name || "",
        avatar: ch.avatar || "",
        avatarAlt: ch.avatarAlt || "",
        description: ch.description || "",
        day: state.variables.day,
        time: Rules.formatTime(state.variables.minutes),
        money: state.variables.money,
        inventoryCount: state.inventory.length
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
    buildMapVM,
    buildQuestsVM,
    buildCharacterVM
  });
})();