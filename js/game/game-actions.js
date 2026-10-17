/*
  Действия игрока. Принимает id от UI, находит соответствующее действие
  в GAME_DATA, применяет эффекты через Rules, обновляет состояние и лог.

  Время действия — это свойство действия (action.minutes), а не эффект.
  По умолчанию 1 минута. Применяется после эффектов, чтобы переход (если есть)
  случился до траты времени.
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

    const effectList = [
      ...(action.effects || []),
      ...(variant && variant.effects ? variant.effects : [])
    ];

    // Время действия — свойство, по умолчанию 1 минута. Применяется после эффектов.
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
    const logBatch = [
      `Действие: ${action.label} (${locName})`,
      ...moveMessages,
      ...infoMessages
    ];
    Game.pushLog(logBatch);

    const text = (variant && variant.text) || action.text;
    const image = (variant && variant.image) || action.image;
    const imageAlt = (variant && variant.imageAlt) || action.imageAlt || text;
    const imageCaption = (variant && variant.imageCaption) || action.imageCaption;

    const batch = [];
    if (text) batch.push({ kind: "text", text });
    if (image) {
      batch.push({
        kind: "image",
        src: image,
        alt: imageAlt || "",
        caption: imageCaption || ""
      });
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
    Game.setState(nextState);
    Game.pushLog(messages.map(m => m.text));
    Game.clearInfo();
    Game.render();
  }

  Object.assign(window.Game, { onAction, handleGoto, findAction });
})();