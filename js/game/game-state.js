/*
  Игровое состояние. Единая точка хранения state и logEntries.
  Все остальные game-модули работают через этот объект.

  Публичный API:
    Game.freshState()          -> новый чистый state из GAME_DATA
    Game.getState()            -> текущий state
    Game.setState(next)        -> заменить state целиком
    Game.patchState(partial)   -> мерж поверх текущего state (shallow)
    Game.getLog()              -> массив строк лога
    Game.pushLog(entries)      -> добавить записи в начало, обрезать по лимиту
    Game.resetLog(entries?)    -> сбросить лог в начальное состояние
    Game.LOG_LIMIT             -> лимит длины лога
*/
window.Game = window.Game || {};

(() => {
  "use strict";

  const GAME_DATA = window.GAME_DATA;
  const Rules     = window.Rules;
  if (!GAME_DATA) { console.error("game-state.js: window.GAME_DATA не найден."); return; }
  if (!Rules)     { console.error("game-state.js: window.Rules не найден.");     return; }

  const LOG_LIMIT = 10;
  const INITIAL_LOG = ["Ты просыпаешься дома. Новый день начинается."];

  let state = freshState();
  let logEntries = INITIAL_LOG.slice();

  function freshState() {
    return Rules.deepClone(GAME_DATA.initialState);
  }

  function getState() { return state; }
  function setState(next) { state = next; }
  function patchState(partial) { state = { ...state, ...partial }; }

  function getLog() { return logEntries; }
  function pushLog(entries) {
    logEntries = [...entries, ...logEntries].slice(0, LOG_LIMIT);
  }
  function resetLog(entries) {
    logEntries = (entries || INITIAL_LOG).slice(0, LOG_LIMIT);
  }

  Object.assign(window.Game, {
    LOG_LIMIT,
    INITIAL_LOG,
    freshState,
    getState,
    setState,
    patchState,
    getLog,
    pushLog,
    resetLog
  });
})();