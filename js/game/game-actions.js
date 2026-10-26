/*
  Действия игрока. Принимает id от UI:
    - "use:<itemId>"        — использование расходника из инвентаря;
    - "sleep:<minutes>"     — сон с выбранной длительностью;
    - иначе                 — id действия из текущей локации.

  Если у действия есть поле `dialogue` — открывается диалог (state.dialogue).
  Эффекты действия применяются сразу при старте (например, фиксация дня).

  Порядок эффектов:
    advanceTime идёт ПЕРВЫМ (время тратится, потребности растут),
    потом эффекты действия / варианта. Это нужно, чтобы бонусы к настроению
    и другим переменным применялись уже после снижения за прошедшее время
    и могли достичь максимума.

  restoreBeforeTime / reduceBeforeTime — до advanceTime.
  restoreAfterTime / reduceAfterTime   — после всех эффектов.
  restore ставит значение, reduce вычитает (с ограничением по [0, ∞)).

  Сообщения:
    - kind: "info"       — только в «Историю событий».
    - kind: "infoExtra"  — в «Историю событий» и в «Информацию»
                           (например, «Получено: 100 ¥», «Чаевые: 41 ¥»).

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

  /* ---------- поиск действия ---------- */

  function findAction(id) {
    const state = Game.getState();
    const loc = GAME_DATA.locations[state.location];
    return loc.actions.find(a => a.id === id) || null;
  }

  /* ---------- выгон из закрытой локации ---------- */

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

  /* ---------- вспомогательные ---------- */

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

  // Склонение числительных: 1 час, 2 часа, 5 часов.
  function plural(n, one, few, many) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
  }

  // Разделяет сообщения эффектов на три потока:
  //   move      — переходы (только в «Историю событий»);
  //   info      — только в «Историю событий»;
  //   infoExtra — в «Историю событий» и в «Информацию».
  function splitMessages(messages) {
    const move = [];
    const info = [];
    const infoExtra = [];

    messages.forEach(m => {
      if (m.kind === "move") move.push(m.text);
      else if (m.kind === "infoExtra") { info.push(m.text); infoExtra.push(m.text); }
      else info.push(m.text);
    });

    return { move, info, infoExtra };
  }

  /* ---------- диалоги ---------- */

  function startDialogue(dialogueId, state, action) {
    const dlg = (GAME_DATA.dialogues || {})[dialogueId];
    if (!dlg) {
      console.warn(`Диалог "${dialogueId}" не найден.`);
      return;
    }

    let working = state;
    // Эффекты действия применяются сразу при старте диалога
    // (например, фиксация lastHimariDay = day).
    if (action && Array.isArray(action.effects) && action.effects.length) {
      const { state: next } = Rules.applyEffects(action.effects, working, GAME_DATA);
      working = next;
    }

    Game.setState({
      ...working,
      dialogue: { id: dialogueId, nodeId: dlg.start }
    });
    Game.render();
  }

  /* ---------- главный диспетчер ---------- */

  function onAction(id) {
    const initial = Game.getState();
    if (initial.gameOver) return;

    // Использование расходника.
    if (id.startsWith("use:")) {
      handleUse(id.slice(4));
      return;
    }
    // Сон с выбранной длительностью.
    if (id.startsWith("sleep:")) {
      handleSleep(Number(id.slice(6)));
      return;
    }

    const state = Game.getState();
    const action = findAction(id);
    if (!action) return;
    if (!Rules.checkCondition(action.condition, state, GAME_DATA)) return;

    // Диалог: эффекты действия применяются сразу, state.dialogue ставится.
    if (action.dialogue) {
      startDialogue(action.dialogue, state, action);
      return;
    }

    // Пометка "одноразового" действия.
    let working = state;
    if (action.once) {
      working = { ...working, flags: { ...working.flags, [action.id + "_done"]: true } };
    }

    // Выбор варианта, если он есть.
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

    // restore/reduce до времени.
    if (action.restoreBeforeTime || action.reduceBeforeTime) {
      working = { ...working, variables: { ...working.variables } };
      applyRestore(working.variables, action.restoreBeforeTime);
      applyReduce(working.variables, action.reduceBeforeTime);
    }

    if (action.sleep) {
      working = { ...working, sleeping: true };
    }

    // advanceTime — первым, потом эффекты действия и варианта.
    const minutes = Number(action.minutes) || 1;
    const effectList = [
      { type: "advanceTime", minutes },
      ...(action.effects || []),
      ...(variant && variant.effects ? variant.effects : [])
    ];

    const { state: nextState, messages } = Rules.applyEffects(
      effectList,
      working,
      GAME_DATA
    );
    Game.setState(nextState);

    // restore/reduce после времени и эффектов.
    if (action.restoreAfterTime || action.reduceAfterTime || nextState.sleeping) {
      const after = { ...nextState, variables: { ...nextState.variables } };
      applyRestore(after.variables, action.restoreAfterTime);
      applyReduce(after.variables, action.reduceAfterTime);
      after.sleeping = false;
      Game.setState(after);
    }

    // Если локация закрылась по времени — выгоняем игрока.
    const evicted = evictIfClosed(Game.getState());
    if (evicted.messages.length) {
      Game.setState(evicted.state);
    }

    // Разбираем сообщения на три потока.
    const { move, info, infoExtra } = splitMessages(messages);
    const moveMessages = [...move, ...evicted.messages];

    // "История событий": действие + переходы + все сообщения эффектов.
    const locName = GAME_DATA.locations[state.location].name;
    Game.pushLog([
      `Действие: ${action.label} (${locName})`,
      ...moveMessages,
      ...info
    ]);

    // "Информация": авторский текст + картинка + infoExtra-сообщения.
    const text = (variant && variant.text) || action.text;
    const image = (variant && variant.image) || action.image;
    const imageAlt = (variant && variant.imageAlt) || action.imageAlt || text;
    const imageCaption = (variant && variant.imageCaption) || action.imageCaption;

    const batch = [];
    if (text) batch.push({ kind: "text", text });
    if (image) {
      batch.push({ kind: "image", src: image, alt: imageAlt || "", caption: imageCaption || "" });
    }
    infoExtra.forEach(t => batch.push({ kind: "text", text: t }));

    // Если действие — чисто переход (move без text/image), очищаем "Информацию".
    const isMoveOnly = moveMessages.length > 0 && batch.length === 0;
    if (isMoveOnly) {
      Game.clearInfo();
    } else if (batch.length) {
      Game.setInfo(batch);
    }

    Game.render();
  }

  /* ---------- использование расходника ---------- */

  /* ---------- использование расходника ---------- */

  function handleUse(itemId) {
    const state = Game.getState();
    if (state.gameOver) return;
    if (!state.inventory.includes(itemId)) return;

    const item = GAME_DATA.items[itemId];
    if (!item || !item.use) return;

    const use = item.use;

    let working = state;

    // Тратим ровно один экземпляр предмета (только для расходников).
    let inventory = working.inventory;
    if (item.consumable) {
      const idx = inventory.indexOf(itemId);
      inventory = inventory.slice();
      inventory.splice(idx, 1);
    }
    working = { ...working, inventory };

    if (use.restoreBeforeTime || use.reduceBeforeTime) {
      working = { ...working, variables: { ...working.variables } };
      applyRestore(working.variables, use.restoreBeforeTime);
      applyReduce(working.variables, use.reduceBeforeTime);
    }

    if (use.sleep) {
      working = { ...working, sleeping: true };
    }

    // advanceTime — первым, потом эффекты предмета.
    const minutes = Number(use.minutes) || 1;
    const effectList = [
      { type: "advanceTime", minutes },
      ...(use.effects || [])
    ];

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

    // Разбираем сообщения на три потока.
    const { move, info, infoExtra } = splitMessages(messages);
    const moveMessages = [...move, ...evicted.messages];

    Game.pushLog([
      `Использовано: ${item.name}`,
      ...moveMessages,
      ...info
    ]);

    // Текст: случайный из randomTexts, если задан.
    // randomTexts может содержать как строки, так и объекты с полем link.
    let useText = use.text;
    if (Array.isArray(use.randomTexts) && use.randomTexts.length) {
      useText = use.randomTexts[Math.floor(Math.random() * use.randomTexts.length)];
    }

    const batch = [];
    if (typeof useText === "string") {
      batch.push({ kind: "text", text: useText });
    } else if (useText) {
      const parts = [];
      if (useText.text) parts.push({ text: useText.text });
      if (useText.link) parts.push({ link: useText.link });
      if (useText.after) parts.push({ text: useText.after });
      batch.push({ kind: "rich", parts });
    }
    if (use.image) {
      batch.push({
        kind: "image",
        src: use.image,
        alt: use.imageAlt || "",
        caption: use.imageCaption || ""
      });
    }
    infoExtra.forEach(t => batch.push({ kind: "text", text: t }));

    if (batch.length) {
      Game.setInfo(batch);
    } else {
      Game.clearInfo();
    }

    Game.render();
  }

  /* ---------- сон ---------- */

  function handleSleep(minutes) {
    const state = Game.getState();
    if (state.gameOver) return;
    if (state.location !== "apartment") return;

    const safeMinutes = Math.max(60, Math.min(720, Number(minutes) || 480));

    // Усталость снижается пропорционально: примерно 12.5 за час (100 за 8 часов).
    const fatigueReduction = (safeMinutes / 60) * 12.5;

    let working = { ...state, sleeping: true, variables: { ...state.variables } };
    working.variables.fatigue = Math.max(0, (Number(working.variables.fatigue) || 0) - fatigueReduction);

    // Время сна.
    const { state: nextState, messages } = Rules.applyEffects(
      [{ type: "advanceTime", minutes: safeMinutes }],
      working,
      GAME_DATA
    );
    Game.setState(nextState);

    // После сна: восстанавливаем выносливость и здоровье.
    // Здоровье восстанавливается до ТЕКУЩЕГО максимума (healthMax),
    // который может быть больше 100 после тренировок в парке.
    const after = { ...nextState, variables: { ...nextState.variables }, sleeping: false };
    after.variables.stamina = Number(after.variables.staminaMax ?? 100);
    after.variables.health = Number(after.variables.healthMax ?? GAME_DATA.healthMax ?? 100);
    Game.setState(after);

    const evicted = evictIfClosed(Game.getState());
    if (evicted.messages.length) {
      Game.setState(evicted.state);
    }

    const { move, info } = splitMessages(messages);
    const moveMessages = [...move, ...evicted.messages];

    const hours = safeMinutes / 60;
    const hoursText = `${hours} ${plural(hours, "час", "часа", "часов")}`;

    Game.pushLog([
      `Действие: Сон (${hoursText})`,
      ...moveMessages,
      ...info
    ]);

    // Картинка берётся из действия sleep в квартире.
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

  /* ---------- экспорт ---------- */

  Object.assign(window.Game, {
    onAction,
    handleUse,
    handleSleep,
    startDialogue,
    findAction
  });
})();