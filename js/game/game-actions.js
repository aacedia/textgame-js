/*
  Действия игрока. Принимает id от UI, находит соответствующее действие
  в GAME_DATA, применяет эффекты через Rules, обновляет состояние и лог.

  Разделение сообщений по каналам:
    - "История событий" получает:
        * "Действие: <label> (<location name>)" — при каждом нажатии;
        * "Переход: <from> -> <to>" — из эффектов move;
        * информационные сообщения эффектов ("Получен предмет: …",
          "Наступает новый день.").
    - "Информация" получает только авторский текст и картинку действия
      (или выбранного варианта). Служебные сообщения эффектов сюда больше
      не попадают — они идут в историю.

  Если действие — чисто переход (move без text/image), "Информация" очищается.

  Публичный API:
    Game.onAction(id)
    Game.handleGoto(locationId)
    Game.findAction(id)
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

    // Выбор варианта, если он есть. pickVariant возвращает { variant, index }
    // или null. Учитывает прошлый выбор для этого действия и флаг repeatable.
    const picked = Rules.pickVariant(action.variants, working, GAME_DATA, action.id);
    const variant = picked ? picked.variant : null;

    // Запоминаем индекс выбранного варианта, чтобы в следующий раз
    // не выбрать его же (если у него нет repeatable: true).
    if (picked) {
      working = {
        ...working,
        lastVariant: { ...(working.lastVariant || {}), [action.id]: picked.index }
      };
    }

    // Собираем список эффектов: сначала эффекты самого действия,
    // потом эффекты выбранного варианта (если он есть).
    const effectList = [
      ...(action.effects || []),
      ...(variant && variant.effects ? variant.effects : [])
    ];

    // Применяем эффекты через правила
    const { state: nextState, messages } = Rules.applyEffects(
      effectList,
      working,
      GAME_DATA
    );
    Game.setState(nextState);

    // Разбираем сообщения по каналам
    const moveMessages = messages.filter(m => m.kind === "move").map(m => m.text);
    const infoMessages = messages.filter(m => m.kind === "info").map(m => m.text);

    // "История событий": действие + переходы + результаты эффектов.
    // Порядок в массиве: сначала "Действие", потом эффекты.
    // pushLog добавляет в начало, поэтому в логе "Действие" окажется сверху.
    const locName = GAME_DATA.locations[state.location].name;
    const logBatch = [
      `Действие: ${action.label} (${locName})`,
      ...moveMessages,
      ...infoMessages
    ];
    Game.pushLog(logBatch);

    // Текст и картинка для "Информации" берутся сначала из варианта,
    // потом из действия. Служебные сообщения эффектов сюда не попадают.
    const text = (variant && variant.text) || action.text;
    const image = (variant && variant.image) || action.image;
    const imageAlt = (variant && variant.imageAlt) || action.imageAlt || text;
    const imageCaption = (variant && variant.imageCaption) || action.imageCaption;

    // "Информация": только авторский текст и картинка.
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

    const fromName = GAME_DATA.locations[state.location].name;
    const toName = GAME_DATA.locations[target].name;

    Game.setState({ ...state, location: target });
    Game.pushLog([`Переход: ${fromName} -> ${toName}`]);
    Game.clearInfo();
    Game.render();
  }

  /* ---------- экспорт ---------- */

  Object.assign(window.Game, { onAction, handleGoto, findAction });
})();