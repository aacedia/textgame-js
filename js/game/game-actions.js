/*
  Действия игрока. Принимает id от UI, находит соответствующее действие
  в GAME_DATA, применяет эффекты через Rules, обновляет состояние и лог.

  Публичный API:
    Game.onAction(id)
    Game.handleGoto(locationId)
    Game.findAction(id)
*/
window.Game = window.Game || {};

(() => {
  "use strict";

  const GAME_DATA = window.GAME_DATA;
  const Rules     = window.Rules;
  if (!GAME_DATA) { console.error("game-actions.js: window.GAME_DATA не найден."); return; }
  if (!Rules)     { console.error("game-actions.js: window.Rules не найден.");     return; }

  function findAction(id) {
    const state = Game.getState();
    const loc = GAME_DATA.locations[state.location];
    return loc.actions.find(a => a.id === id) || null;
  }

  function onAction(id) {
    if (id.startsWith("goto:")) {
      handleGoto(id.slice(5));
      return;
    }

    const state = Game.getState();
    const action = findAction(id);
    if (!action) return;
    if (!Rules.checkCondition(action.condition, state, GAME_DATA)) return;

    let working = state;
    if (action.once) {
      working = { ...working, flags: { ...working.flags, [action.id + "_done"]: true } };
    }

    const { state: nextState, messages } = Rules.applyEffects(
      action.effects || [],
      working,
      GAME_DATA
    );
    Game.setState(nextState);

    const batch = [];
    if (action.text) batch.push(action.text);
    batch.push(...messages);
    if (batch.length) Game.pushLog(batch);

    Game.render();
  }

  function handleGoto(target) {
    if (!GAME_DATA.locations[target]) return;
    const state = Game.getState();
    if (!Rules.isAdjacent(GAME_DATA, state.location, target)) return;
    if (!Rules.isLocationOpen(GAME_DATA, target, state.variables.minutes)) return;
    Game.setState({ ...state, location: target });
    Game.pushLog([`Ты переходишь: ${GAME_DATA.locations[target].name}.`]);
    Game.render();
  }

  Object.assign(window.Game, { onAction, handleGoto, findAction });
})();