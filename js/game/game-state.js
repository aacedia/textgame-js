/*
  Игровое состояние. Единая точка хранения state, logEntries и infoEntries.
  Все остальные game-модули работают через этот объект.

  Разделение сообщений:
    - logEntries  — «История событий»: переходы между локациями.
                    Накапливается, обрезается по LOG_LIMIT.
    - infoEntries — «Информация»: результат последнего осмысленного действия.
                    Заменяется при каждом новом действии, обрезается по INFO_LIMIT.
                    Элементы — объекты { kind: "text" | "image", ... }.

  Публичный API:
    Game.freshState()          -> новый чистый state из GAME_DATA
    Game.getState()            -> текущий state
    Game.setState(next)        -> заменить state целиком
    Game.patchState(partial)   -> мерж поверх текущего state (shallow)

    Game.getLog()              -> массив строк лога переходов
    Game.pushLog(entries)      -> добавить записи в начало, обрезать по лимиту
    Game.resetLog(entries?)    -> сбросить лог в начальное состояние

    Game.getInfo()             -> массив объектов записей «Информации»
    Game.setInfo(entries)      -> заменить записи «Информации» (с фильтрацией)
    Game.clearInfo()           -> очистить «Информацию»
    Game.isInfoEntry(entry)    -> проверка формата одной записи

    Game.LOG_LIMIT             -> лимит длины «Истории событий»
    Game.INFO_LIMIT            -> лимит длины «Информации»
    Game.INITIAL_LOG           -> стартовые записи «Истории событий»
*/
window.Game = window.Game || {};

(() => {
  "use strict";

  const GAME_DATA = window.GAME_DATA;
  const Rules = window.Rules;
  if (!GAME_DATA) { console.error("game-state.js: window.GAME_DATA не найден."); return; }
  if (!Rules) { console.error("game-state.js: window.Rules не найден."); return; }

  const LOG_LIMIT = 10;
  const INFO_LIMIT = 6;
  const INITIAL_LOG = [];

  let state = freshState();
  let logEntries = INITIAL_LOG.slice();
  let infoEntries = [];

  /* ---------- state ---------- */

  function freshState() {
    return Rules.deepClone(GAME_DATA.initialState);
  }

  function getState() { return state; }
  function setState(next) { state = next; }
  function patchState(partial) { state = { ...state, ...partial }; }

  /* ---------- «История событий» (переходы) ---------- */

  function getLog() { return logEntries; }

  function pushLog(entries) {
    logEntries = [...entries, ...logEntries].slice(0, LOG_LIMIT);
  }

  function resetLog(entries) {
    logEntries = (entries || INITIAL_LOG).slice(0, LOG_LIMIT);
  }

  /* ---------- «Информация» (результаты действий) ---------- */

  // Проверка формата одной записи «Информации».
  // Допустимые виды:
  //   { kind: "text",  text: "..." }
  //   { kind: "image", src: "...", alt?: "...", caption?: "..." }
  function isInfoEntry(entry) {
    if (!entry || typeof entry !== "object") return false;
    if (entry.kind === "text") {
      return typeof entry.text === "string";
    }
    if (entry.kind === "image") {
      return typeof entry.src === "string";
    }
    return false;
  }

  function getInfo() { return infoEntries; }

  function setInfo(entries) {
    infoEntries = Array.isArray(entries)
      ? entries.filter(isInfoEntry).slice(0, INFO_LIMIT)
      : [];
  }

  function clearInfo() { infoEntries = []; }

  /* ---------- экспорт ---------- */

  Object.assign(window.Game, {
    LOG_LIMIT,
    INFO_LIMIT,
    INITIAL_LOG,

    freshState,
    getState,
    setState,
    patchState,

    getLog,
    pushLog,
    resetLog,

    getInfo,
    setInfo,
    clearInfo,
    isInfoEntry
  });
})();