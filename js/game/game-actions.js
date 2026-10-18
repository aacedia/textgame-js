/*
  Действия игрока. Принимает id от UI:
    - "use:<itemId>"        — использование расходника из инвентаря;
    - "sleep:<minutes>"     — сон с выбранной длительностью;
    - иначе                 — id действия из текущей локации.

  Время действия — action.minutes, по умолчанию 1 минута, применяется
  после эффектов.

  restoreBeforeTime / reduceBeforeTime — до advanceTime.
  restoreAfterTime / reduceAfterTime   — после advanceTime.
  restore ставит значение, reduce вычитает (с ограничением по [0, ∞)).

  Серия нажатий: если жать одно и то же действие подряд (в той же локации),
  счётчик растёт. Любое другое действие или смена локации сбрасывают серию.

  После gameOver действия заблокированы.

  Если после действия текущая локация оказалась закрыта по расписанию,
  игрока автоматически перемещает в defaultExit этой локации.
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

  function plural(n, one, few, many) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
  }

  function onAction(id) {
    const initial = Game.getState();
    if (initial.gameOver) return;

    if (id.startsWith("use:")) {
      handleUse(id.slice(4));
      return;
    }
    if (id.startsWith("sleep:")) {
      handleSleep(Number(id.slice(6)));
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

    if (action.restoreAfterTime || action.reduceAfterTime || nextState.sleeping) {
      const after = { ...nextState, variables: { ...nextState.variables } };
      applyRestore(after.variables, action.restoreAfterTime);
      applyReduce(after.variables, action.reduceAfterTime);
      after.sleeping = false;
      Game.setState(after);
    }

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

  function handleUse(itemId) {
    const state = Game.getState();
    if (state.gameOver) return;
    if (!state.inventory.includes(itemId)) return;

    const item = GAME_DATA.items[itemId];
    if (!item || !item.consumable || !item.use) return;

    const use = item.use;

    // Тратим один экземпляр предмета.
    const idx = state.inventory.indexOf(itemId);
    const inventory = state.inventory.slice();
    inventory.splice(idx, 1);

    let working = { ...state, inventory };

    if (use.restoreBeforeTime || use.reduceBeforeTime) {
      working = { ...working, variables: { ...working.variables } };
      applyRestore(working.variables, use.restoreBeforeTime);
      applyReduce(working.variables, use.reduceBeforeTime);
    }

    if (use.sleep) {
      working = { ...working, sleeping: true };
    }

    const effectList = [...(use.effects || [])];
    const minutes = Number(use.minutes) || 1;
    effectList.push({ type: "advanceTime", minutes });

    const { state: nextState, messages } = Rules.applyEffects(effectList, working, GAME_DATA);
    Game.setState(nextState);

    if (use.restoreAfterTime || use.reduceAfterTime || nextState.sleeping) {
      const after = { ...nextState, variables: { ...nextState.variables } };
      applyRestore(after.variables, use.restoreAfterTime);
      applyReduce(after.variables, use.reduceAfterTime);
      after.sleeping = false;
      Game.setState(after);
    }

    const evicted = evictIfClosed(Game.getState());
    if (evicted.messages.length) {
      Game.setState(evicted.state);
    }

    const moveMessages = [
      ...messages.filter(m => m.kind === "move").map(m => m.text),
      ...evicted.messages
    ];
    const infoMessages = messages.filter(m => m.kind === "info").map(m => m.text);

    Game.pushLog([
      `Использовано: ${item.name}`,
      ...moveMessages,
      ...infoMessages
    ]);

    const batch = [];
    if (use.text) batch.push({ kind: "text", text: use.text });
    if (use.image) {
      batch.push({
        kind: "image",
        src: use.image,
        alt: use.imageAlt || use.text || "",
        caption: use.imageCaption || ""
      });
    }

    if (batch.length) {
      Game.setInfo(batch);
    } else {
      Game.clearInfo();
    }

    Game.render();
  }

  function handleSleep(minutes) {
    const state = Game.getState();
    if (state.gameOver) return;
    if (state.location !== "apartment") return;

    const safeMinutes = Math.max(60, Math.min(720, Number(minutes) || 480));

    const fatigueReduction = (safeMinutes / 60) * 12.5;

    let working = { ...state, sleeping: true, variables: { ...state.variables } };
    working.variables.fatigue = Math.max(0, (Number(working.variables.fatigue) || 0) - fatigueReduction);

    const { state: nextState, messages } = Rules.applyEffects(
      [{ type: "advanceTime", minutes: safeMinutes }],
      working,
      GAME_DATA
    );
    Game.setState(nextState);

    const after = { ...nextState, variables: { ...nextState.variables }, sleeping: false };
    after.variables.stamina = 100;
    after.variables.health = 100;
    Game.setState(after);

    const evicted = evictIfClosed(Game.getState());
    if (evicted.messages.length) {
      Game.setState(evicted.state);
    }

    const moveMessages = evicted.messages;
    const infoMessages = messages.filter(m => m.kind === "info").map(m => m.text);

    const hours = safeMinutes / 60;
    const hoursText = `${hours} ${plural(hours, "час", "часа", "часов")}`;

    Game.pushLog([
      `Действие: Сон (${hoursText})`,
      ...moveMessages,
      ...infoMessages
    ]);

    // Картинка и alt берутся из действия sleep, если заданы.
    const apartment = GAME_DATA.locations["apartment"];
    const sleepAction = apartment && apartment.actions
      ? apartment.actions.find(a => a.id === "sleep")
      : null;

    const batch = [];
    batch.push({ kind: "text", text: `Ты ложишься спать и просыпаешься через ${hoursText}.` });
    if (sleepAction && sleepAction.image) {
      batch.push({
        kind: "image",
        src: sleepAction.image,
        alt: sleepAction.imageAlt || "Сон",
        caption: sleepAction.imageCaption || ""
      });
    }

    Game.setInfo(batch);
    Game.render();
  }

  Object.assign(window.Game, { onAction, handleUse, handleSleep, findAction });
})();