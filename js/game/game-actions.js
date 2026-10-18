/*
  Действия игрока. Принимает id от UI, находит действие в GAME_DATA,
  применяет эффекты через Rules, обновляет состояние и лог.

  Время действия — свойство action.minutes, по умолчанию 1 минута.
  Применяется после эффектов.

  restoreBeforeTime / reduceBeforeTime — применить до advanceTime.
  restoreAfterTime / reduceAfterTime   — применить после advanceTime.
  Формат: { ключ_переменной: значение }. restore ставит, reduce вычитает
  (с ограничением по [0, ∞)).

  Серия нажатий: если жать одно и то же действие подряд (в той же локации),
  счётчик растёт. Любое другое действие, переход через карту или смена
  локации сбрасывают серию.

  После gameOver все действия заблокированы.

  Если после действия текущая локация оказалась закрыта по расписанию,
  игрока автоматически перемещает в defaultExit этой локации (обычно street).
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

  function evictIfClosed(state) {
    const loc = GAME_DATA.locations[state.location];
    if (!loc || !loc.hours) return { state, messages: [] };
    if (Rules.isLocationOpen(GAME_DATA, state.location, state.variables.minutes, state.variables.day)) {
      return { state, messages: [] };
    }
    const target = loc.defaultExit;
    if (!target || !GAME_DATA.locations[target]) {
      return { state, messages: [] };
    }
    const fromName = loc.name;
    const toName = GAME_DATA.locations[target].name;
    const next = {
      ...state,
      location: target,
      lastAction: null,
      streakAction: null,
      streakCount: 0
    };
    return {
      state: next,
      messages: [`Переход: ${fromName} -> ${toName} (закрыто)`]
    };
  }

  function applyRestore(vars, spec) {
    if (!spec || typeof spec !== "object") return;
    Object.entries(spec).forEach(([key, value]) => {
      vars[key] = value;
    });
  }

  function applyReduce(vars, spec) {
    if (!spec || typeof spec !== "object") return;
    Object.entries(spec).forEach(([key, value]) => {
      const current = Number(vars[key]) || 0;
      vars[key] = Math.max(0, current - Number(value));
    });
  }

  function onAction(id) {
    const initial = Game.getState();
    if (initial.gameOver) return;

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

    // Серия нажатий
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

    // Восстановление/снижение до времени.
    if (action.restoreBeforeTime || action.reduceBeforeTime) {
      working = { ...working, variables: { ...working.variables } };
      applyRestore(working.variables, action.restoreBeforeTime);
      applyReduce(working.variables, action.reduceBeforeTime);
    }

    if (action.sleep) {
      working = { ...working, sleeping: true };
    }

    const minutes = Number(action.minutes) || 1;
    effectList.push({ type: "advanceTime", minutes });

    const { state: nextState, messages } = Rules.applyEffects(
      effectList,
      working,
      GAME_DATA
    );
    Game.setState(nextState);

    // Восстановление/снижение после времени.
    if (action.restoreAfterTime || action.reduceAfterTime || nextState.sleeping) {
      const after = { ...nextState, variables: { ...nextState.variables } };
      applyRestore(after.variables, action.restoreAfterTime);
      applyReduce(after.variables, action.reduceAfterTime);
      after.sleeping = false;
      Game.setState(after);
    }

    // Если локация закрылась по времени — выгоняем игрока на улицу.
    const evicted = evictIfClosed(Game.getState());
    if (evicted.messages.length) {
      Game.setState(evicted.state);
    }

    const moveMessages = [
      ...messages.filter(m => m.kind === "move").map(m => m.text),
      ...evicted.messages
    ];
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
    const state = Game.getState();
    if (state.gameOver) return;
    if (!GAME_DATA.locations[target]) return;
    if (!Rules.isAdjacent(GAME_DATA, state.location, target)) return;
    if (!Rules.isLocationOpen(GAME_DATA, target, state.variables.minutes, state.variables.day)) return;

    const { state: nextState, messages } = Rules.applyEffects(
      [
        { type: "move", to: target },
        { type: "advanceTime", minutes: 1 }
      ],
      state,
      GAME_DATA
    );

    const evicted = evictIfClosed(nextState);

    Game.setState({
      ...evicted.state,
      lastAction: null,
      streakAction: null,
      streakCount: 0
    });
    Game.pushLog([...messages.map(m => m.text), ...evicted.messages]);
    Game.clearInfo();
    Game.render();
  }

  Object.assign(window.Game, { onAction, handleGoto, findAction });
})();