/*
  Действия игрока.

  Серия нажатий: если жать одно и то же действие подряд (в той же локации),
  счётчик растёт. Любое другое действие, переход через карту или смена
  локации сбрасывают серию.
*/
window.Game = window.Game || {};

(() => {
  "use strict";

  const GAME_DATA = window.GAME_DATA;
  const Rules = window.Rules;
  if (!GAME_DATA) { console.error("game-actions.js: window.GAME_DATA не найден."); return; }
  if (!Rules) { console.error("game-actions.js: window.Rules не найден."); return; }

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

    const picked = Rules.pickVariant(action.variants, working, GAME_DATA, action.id);
    const variant = picked ? picked.variant : null;

    if (picked) {
      working = {
        ...working,
        lastVariant: { ...(working.lastVariant || {}), [action.id]: picked.index }
      };
    }

    // Серия нажатий: продолжается только если то же действие подряд
    // в той же локации. Иначе — начинается заново.
    const sameStreak =
      working.streakAction === action.id &&
      working.lastAction &&
      working.lastAction.id === action.id &&
      working.lastAction.location === state.location;

    working = {
      ...working,
      streakAction: action.id,
      streakCount: sameStreak ? (working.streakCount || 0) + 1 : 1,
      lastAction: { id: action.id, location: state.location }
    };

    const effectList = [
      ...(action.effects || []),
      ...(variant && variant.effects ? variant.effects : [])
    ];

    const minutes = Number(action.minutes) || 1;
    effectList.push({ type: "advanceTime", minutes });

    const { state: nextState, messages } = Rules.applyEffects(
      effectList,
      working,
      GAME_DATA
    );
    Game.setState(nextState);

    const moveMessages = messages.filter(m => m.kind === "move").map(m => m.text);
    const infoMessages = messages.filter(m => m.kind === "info").map(m => m.text);

    const locName = GAME_DATA.locations[state.location].name;
    Game.pushLog([
      `Действие: ${action.label} (${locName})`,
      ...moveMessages,
      ...infoMessages
    ]);

    const text = (variant && variant.text) || action.text;
    const image = (variant && variant.image) || action.image;
    const imageAlt = (variant && variant.imageAlt) || action.imageAlt || text;
    const imageCaption = (variant && variant.imageCaption) || action.imageCaption;

    const batch = [];
    if (text) batch.push({ kind: "text", text });
    if (image) {
      batch.push({ kind: "image", src: image, alt: imageAlt || "", caption: imageCaption || "" });
    }

    const isMoveOnly = moveMessages.length > 0 && batch.length === 0;
    if (isMoveOnly) {
      Game.clearInfo();
    } else if (batch.length) {
      Game.setInfo(batch);
    }

    Game.render();
  }

  function handleGoto(target) {
    if (!GAME_DATA.locations[target]) return;
    const state = Game.getState();
    if (!Rules.isAdjacent(GAME_DATA, state.location, target)) return;
    if (!Rules.isLocationOpen(GAME_DATA, target, state.variables.minutes)) return;

    const { state: nextState, messages } = Rules.applyEffects(
      [
        { type: "move", to: target },
        { type: "advanceTime", minutes: 1 }
      ],
      state,
      GAME_DATA
    );

    // Переход сбрасывает и серию, и lastAction.
    Game.setState({
      ...nextState,
      lastAction: null,
      streakAction: null,
      streakCount: 0
    });
    Game.pushLog(messages.map(m => m.text));
    Game.clearInfo();
    Game.render();
  }

  Object.assign(window.Game, { onAction, handleGoto, findAction });
})();