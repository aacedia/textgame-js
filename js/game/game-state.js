/*
  Игровое состояние. Единая точка хранения state, logEntries и infoEntries.
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

  function freshState() {
    const base = Rules.deepClone(GAME_DATA.initialState);
    if (base.lastAction == null) base.lastAction = null;
    if (!base.streakAction) base.streakAction = null;
    if (base.streakCount == null) base.streakCount = 0;
    return base;
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

  function isInfoEntry(entry) {
    if (!entry || typeof entry !== "object") return false;
    if (entry.kind === "text") return typeof entry.text === "string";
    if (entry.kind === "image") return typeof entry.src === "string";
    if (entry.kind === "rich") return Array.isArray(entry.parts);
    return false;
  }

  function getInfo() { return infoEntries; }
  function setInfo(entries) {
    infoEntries = Array.isArray(entries)
      ? entries.filter(isInfoEntry).slice(0, INFO_LIMIT)
      : [];
  }
  function clearInfo() { infoEntries = []; }

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