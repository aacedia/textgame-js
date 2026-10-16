/*
  Действия игрока. Принимает id от UI, находит соответствующее действие
  в GAME_DATA, применяет эффекты через Rules, обновляет состояние и лог.

  Разделение сообщений по каналам:
    - "move"  → "История событий" (накапливается, как раньше).
    - "info"  → "Информация" (заменяется при каждом новом осмысленном действии).
    - action.text и action.image → "Информация".

  Если действие — чисто переход (только move-эффект без text/image),
  "Информация" очищается. Если у перехода есть text или image — они
  показываются в "Информации", а переход дополнительно попадает в "Историю".

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

  /* ---------- поиск действия ---------- */

  function findAction(id) {
    const state = Game.getState();
    const loc = GAME_DATA.locations[state.location];
    return loc.actions.find(a => a.id === id) || null;
  }

  /* ---------- главный диспетчер ---------- */

  function onAction(id) {
    // Переход через карту: "goto:<locationId>"
    if (id.startsWith("goto:")) {
      handleGoto(id.slice(5));
      return;
    }

    const state = Game.getState();
    const action = findAction(id);
    if (!action) return;
    if (!Rules.checkCondition(action.condition, state, GAME_DATA)) return;

    // Пометка "одноразового" действия
    let working = state;
    if (action.once) {
      working = { ...working, flags: { ...working.flags, [action.id + "_done"]: true } };
    }

    // Применяем эффекты через правила
    const { state: nextState, messages } = Rules.applyEffects(
      action.effects || [],
      working,
      GAME_DATA
    );
    Game.setState(nextState);

    // Разбираем сообщения по каналам
    const moveMessages = messages.filter(m => m.kind === "move").map(m => m.text);
    const infoMessages = messages.filter(m => m.kind === "info").map(m => m.text);

    // "История событий" — только переходы
    if (moveMessages.length) Game.pushLog(moveMessages);

    // "Информация" — результат последнего осмысленного действия.
    // Порядок: текст действия → картинка → сообщения от эффектов.
    const batch = [];
    if (action.text) {
      batch.push({ kind: "text", text: action.text });
    }
    if (action.image) {
      batch.push({
        kind: "image",
        src: action.image,
        alt: action.imageAlt || action.text || "",
        caption: action.imageCaption || ""
      });
    }
    infoMessages.forEach(text => batch.push({ kind: "text", text }));

    // Если действие — чисто переход (move без собственного text/image),
    // очищаем "Информацию", чтобы она не висела с прошлого осмысленного действия.
    const isMoveOnly = moveMessages.length > 0 && batch.length === 0;
    if (isMoveOnly) {
      Game.clearInfo();
    } else if (batch.length) {
      Game.setInfo(batch);
    }

    Game.render();
  }

  /* ---------- переход через карту ---------- */

  function handleGoto(target) {
    if (!GAME_DATA.locations[target]) return;
    const state = Game.getState();
    if (!Rules.isAdjacent(GAME_DATA, state.location, target)) return;
    if (!Rules.isLocationOpen(GAME_DATA, target, state.variables.minutes)) return;

    Game.setState({ ...state, location: target });
    Game.pushLog([`Ты переходишь: ${GAME_DATA.locations[target].name}.`]);
    Game.clearInfo();
    Game.render();
  }

  /* ---------- экспорт ---------- */

  Object.assign(window.Game, { onAction, handleGoto, findAction });
})();