/*
  Команды UI: сохранение/загрузка/рестарт/справка, переключение вкладок,
  сворачивание панелей, фильтр инвентаря, чит-код, выбор в диалоге,
  закрытие диалога, получение стипендии, экспорт/импорт сохранения в файл.

  Публичный API:
    Game.onCommand(command)
    Game.saveGame()
    Game.loadGame()
    Game.restart()
    Game.showHelp()
    Game.buildSnapshot()
    Game.validateSnapshot(snapshot)
    Game.chooseDialogue(index)
    Game.closeDialogue()
    Game.claimStipend()
    Game.exportSave()
    Game.importSave()
    Game.importSaveFromFile(file)
    Game.applyLoadedSnapshot(data)

  Команды, которые обрабатывает onCommand:
    "tab:<id>"                   — переключить вкладку боковой панели
    "inventory:filter:<id>"      — установить фильтр инвентаря
    "controls:toggle"            — свернуть/развернуть «Управление»
    "log:toggle"                 — свернуть/развернуть «Историю событий»
    "save"                       — сохранить
    "load"                       — загрузить
    "export"                     — экспорт сохранения в файл
    "import"                     — импорт сохранения из файла
    "restart"                    — начать заново
    "help"                       — справка
    "cheat:apply:<command>"      — чит-код
    "dialogue:choose:<index>"    — выбрать вариант в диалоге
    "dialogue:close"             — закрыть диалог
    "stipend:claim"              — забрать накопленную стипендию
*/
window.Game = window.Game || {};

(() => {
  "use strict";

  const GAME_DATA = window.GAME_DATA;
  const Rules = window.Rules;
  const Save = window.Save;
  const UI = window.UI;
  if (!GAME_DATA) { console.error("game-commands.js: window.GAME_DATA не найден."); return; }
  if (!Rules) { console.error("game-commands.js: window.Rules не найден."); return; }
  if (!Save) { console.error("game-commands.js: window.Save не найден."); return; }
  if (!UI) { console.error("game-commands.js: window.UI не найден."); return; }

  const SAVE_VERSION = 2;
  const LOG_LIMIT = Game.LOG_LIMIT;
  const INFO_LIMIT = Game.INFO_LIMIT;

  const VALID_TABS = ["quests", "inventory"];
  const VALID_FILTERS = ["all", "consumable", "electronics", "other"];

  /* ---------- диспетчер команд ---------- */

  function onCommand(command) {
    if (command.startsWith("tab:")) {
      Game.patchState({ uiTab: command.slice(4) });
      Game.render();
      return;
    }

    if (command.startsWith("inventory:filter:")) {
      const filter = command.slice("inventory:filter:".length);
      if (VALID_FILTERS.includes(filter)) {
        Game.patchState({ inventoryFilter: filter });
        Game.render();
      }
      return;
    }

    if (command === "controls:toggle") {
      const state = Game.getState();
      Game.patchState({ controlsOpen: !state.controlsOpen });
      Game.render();
      return;
    }
    if (command === "log:toggle") {
      const state = Game.getState();
      Game.patchState({ logOpen: !state.logOpen });
      Game.render();
      return;
    }

    if (command.startsWith("cheat:apply:")) {
      const raw = command.slice("cheat:apply:".length);
      applyCheat(raw);
      return;
    }

    if (command.startsWith("dialogue:choose:")) {
      const idx = Number(command.slice("dialogue:choose:".length));
      chooseDialogue(idx);
      return;
    }
    if (command === "dialogue:close") {
      closeDialogue();
      return;
    }

    if (command === "stipend:claim") {
      claimStipend();
      return;
    }

    switch (command) {
      case "save": saveGame(); break;
      case "load": loadGame(); break;
      case "export": exportSave(); break;
      case "import": importSave(); break;
      case "restart": restart(); break;
      case "help": showHelp(); break;
    }
  }

  /* ---------- диалоги ---------- */

  // Выбор варианта в текущем узле диалога по индексу.
  function chooseDialogue(index) {
    const state = Game.getState();
    if (!state.dialogue) return;

    const dlg = (GAME_DATA.dialogues || {})[state.dialogue.id];
    if (!dlg) return;

    const node = dlg.nodes[state.dialogue.nodeId];
    if (!node || !Array.isArray(node.choices)) return;

    const choice = node.choices[index];
    if (!choice) return;

    // Условие выбора: если не выполнено — игнорируем клик.
    if (choice.condition && !Rules.checkCondition(choice.condition, state, GAME_DATA)) return;

    // Применяем эффекты выбора.
    let next = state;
    if (Array.isArray(choice.effects) && choice.effects.length) {
      const result = Rules.applyEffects(choice.effects, state, GAME_DATA);
      next = result.state;
    }

    // Команда-действие вместо перехода — закрываем диалог и вызываем onCommand.
    if (choice.command) {
      Game.setState({ ...next, dialogue: null });
      Game.render();
      onCommand(choice.command);
      return;
    }

    if (choice.close) {
      Game.setState({ ...next, dialogue: null });
      Game.render();
      return;
    }

    if (choice.next && dlg.nodes[choice.next]) {
      Game.setState({ ...next, dialogue: { id: state.dialogue.id, nodeId: choice.next } });
      Game.render();
    }
  }

  function closeDialogue() {
    const state = Game.getState();
    if (!state.dialogue) return;
    Game.setState({ ...state, dialogue: null });
    Game.render();
  }

  /* ---------- стипендия ---------- */

  function claimStipend() {
    const state = Game.getState();
    const pending = Number(state.variables.pendingStipend) || 0;
    const STIPEND_THRESHOLD = 500;

    if (pending < STIPEND_THRESHOLD) {
      UI.showDialog(
        "Стипендия",
        `Пока рано. Минимум для получения — ${STIPEND_THRESHOLD} ¥. Накоплено: ${pending} ¥.`,
        [{ label: "Понятно", primary: true }]
      );
      return;
    }

    Game.patchState({
      variables: {
        ...state.variables,
        money: (Number(state.variables.money) || 0) + pending,
        pendingStipend: 0
      }
    });
    Game.pushLog([`Стипендия: +${pending} ¥`]);
    Game.setInfo([{ kind: "text", text: `Вы получили накопленную стипендию: ${pending} ¥.` }]);
    Game.render();
    UI.showDialog("Стипендия", `Вы получили ${pending} ¥.`, [{ label: "Спасибо", primary: true }]);
  }

  /* ---------- чит-код ---------- */

  /* ---------- чит-код ---------- */

  function applyCheat(raw) {
    const state = Game.getState();
    const text = String(raw || "").trim();
    if (!text) return;

    // time <минуты>
    const timeAdd = text.match(/^time\s+(-?\d+)$/i);
    if (timeAdd) {
      const minutes = Number(timeAdd[1]) || 0;
      const before = Number(state.variables.minutes) || 0;
      const total = before + minutes;
      const daysPassed = Math.floor(total / 1440);
      const nextMinutes = ((total % 1440) + 1440) % 1440;
      const next = {
        ...state,
        variables: {
          ...state.variables,
          minutes: nextMinutes,
          day: daysPassed > 0
            ? (Number(state.variables.day) || 1) + daysPassed
            : state.variables.day
        }
      };
      Game.setState(next);
      Game.pushLog([`Чит: время +${minutes} мин.`]);
      Game.render();
      UI.showDialog("Чит-код", `Время сдвинуто на ${minutes} мин.`, [{ label: "ОК", primary: true }]);
      return;
    }

    // relation <npcId> <value>
    const relSet = text.match(/^relation\s+(\w+)\s+(-?\d+)$/i);
    if (relSet) {
      const npcId = relSet[1];
      const value = Math.max(0, Math.min(100, Number(relSet[2]) || 0));
      const key = `relationship_${npcId}`;
      const npcs = (GAME_DATA.character && GAME_DATA.character.npcs) || {};
      if (!npcs[npcId]) {
        UI.showDialog("Чит-код", `Неизвестный NPC: ${npcId}`, [{ label: "Закрыть", primary: true }]);
        return;
      }
      Game.patchState({
        variables: { ...state.variables, [key]: value }
      });
      Game.pushLog([`Чит: отношение с ${npcs[npcId].name} = ${value}`]);
      UI.showDialog("Чит-код", `Отношение с ${npcs[npcId].name} установлено на ${value}.`, [{ label: "ОК", primary: true }]);
      Game.render();
      return;
    }

    // additem <itemId|F> <amount>
    const addMatch = text.match(/^additem\s+(\S+)\s+(\d+)$/i);
    if (!addMatch) {
      UI.showDialog(
        "Чит-код",
        "Неизвестная команда.",
        [{ label: "Закрыть", primary: true }]
      );
      return;
    }

    const id = addMatch[1];
    const amount = Math.max(1, Number(addMatch[2]) || 0);

    // F — код валюты.
    if (id === "F" || id === "f") {
      const before = Number(state.variables.money) || 0;
      Game.patchState({
        variables: { ...state.variables, money: before + amount }
      });
      Game.pushLog([`Чит: добавлено ${amount} ¥`]);
      UI.showDialog("Чит-код", `Добавлено ${amount} ¥.`, [{ label: "ОК", primary: true }]);
      Game.render();
      return;
    }

    // Иначе — предмет из GAME_DATA.items.
    if (!GAME_DATA.items[id]) {
      UI.showDialog("Чит-код", `Неизвестный предмет: ${id}`, [{ label: "Закрыть", primary: true }]);
      return;
    }

    const inventory = [...state.inventory];
    for (let i = 0; i < amount; i++) inventory.push(id);
    Game.patchState({ inventory });
    Game.pushLog([`Чит: получено ${amount} × ${GAME_DATA.items[id].name}`]);
    UI.showDialog("Чит-код", `Добавлено ${amount} × ${GAME_DATA.items[id].name}.`, [{ label: "ОК", primary: true }]);
    Game.render();
  }

  /* ---------- снимок состояния ---------- */

  function buildSnapshot() {
    return {
      version: SAVE_VERSION,
      state: Game.getState(),
      logEntries: Game.getLog(),
      infoEntries: Game.getInfo()
    };
  }

  function validateSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== "object") return { ok: false, reason: "format" };
    if (snapshot.version !== SAVE_VERSION) return { ok: false, reason: "version" };
    const s = snapshot.state;
    if (!s || typeof s !== "object") return { ok: false, reason: "format" };
    if (!GAME_DATA.locations[s.location]) return { ok: false, reason: "location" };

    const base = Game.freshState();
    const merged = Object.assign(base, s);
    merged.inventory = Array.isArray(merged.inventory)
      ? merged.inventory.filter(id => GAME_DATA.items[id])
      : [];
    merged.flags = Object.assign({}, base.flags, merged.flags || {});
    merged.variables = Object.assign({}, base.variables, merged.variables || {});
    // Старые сохранения могут не содержать healthMax — подставляем стартовый максимум,
    // чтобы прокачка здоровья работала от 50, а не от 0.
    if (merged.variables.healthMax == null) {
      merged.variables.healthMax = base.variables.healthMax ?? 50;
    }
    if (merged.variables.health == null) {
      merged.variables.health = base.variables.health ?? 50;
    }

    if (!VALID_TABS.includes(merged.uiTab)) {
      merged.uiTab = "quests";
    }
    if (!VALID_FILTERS.includes(merged.inventoryFilter)) {
      merged.inventoryFilter = "all";
    }

    // Закрываем диалог при загрузке — состояние диалога не сохраняем.
    merged.dialogue = null;

    const logs = Array.isArray(snapshot.logEntries)
      ? snapshot.logEntries.slice(0, LOG_LIMIT)
      : ["Сохранение загружено."];

    const infos = Array.isArray(snapshot.infoEntries)
      ? snapshot.infoEntries.filter(Game.isInfoEntry).slice(0, INFO_LIMIT)
      : [];

    return { ok: true, data: { state: merged, logEntries: logs, infoEntries: infos } };
  }

  // Применяет провалидированный снимок к игре.
  // Используется и loadGame(), и импортом из файла.
  function applyLoadedSnapshot(data) {
    Game.setState(data.state);
    Game.resetLog(data.logEntries);
    Game.setInfo(data.infoEntries);
    Game.render();
  }

  /* ---------- сохранение ---------- */

  function saveGame() {
    const result = Save.write(buildSnapshot());
    if (result.ok) {
      UI.showDialog("Сохранение", "Игра сохранена в этом браузере.", [
        { label: "Продолжить", primary: true }
      ]);
      return;
    }
    UI.showDialog(
      "Ошибка сохранения",
      "Не удалось сохранить игру. Возможно, браузер запрещает локальное хранилище или оно переполнено.",
      [{ label: "Закрыть", primary: true }]
    );
  }

  /* ---------- загрузка ---------- */

  function loadGame() {
    const result = Save.read();
    if (!result.ok) {
      UI.showDialog("Не удалось загрузить", messageForLoadError(result.error), [
        { label: "Понятно", primary: true }
      ]);
      return;
    }

    const validation = validateSnapshot(result.snapshot);
    if (!validation.ok) {
      UI.showDialog(
        "Несовместимое сохранение",
        messageForValidationError(validation.reason),
        [{ label: "Закрыть", primary: true }]
      );
      return;
    }

    applyLoadedSnapshot(validation.data);
    UI.showDialog("Загрузка", "Сохранение успешно загружено.", [
      { label: "Продолжить", primary: true }
    ]);
  }

  /* ---------- экспорт в файл ---------- */

  function exportSave() {
    const result = Save.download(buildSnapshot());
    if (result.ok) {
      UI.showDialog("Экспорт", "Сохранение скачано как файл.", [
        { label: "Продолжить", primary: true }
      ]);
      return;
    }
    UI.showDialog(
      "Ошибка экспорта",
      "Не удалось создать файл сохранения. Возможно, браузер блокирует скачивание.",
      [{ label: "Закрыть", primary: true }]
    );
  }

  /* ---------- импорт из файла ---------- */

  // Вызывается UI, когда пользователь выбрал файл.
  // file — File из <input type="file">.
  function importSaveFromFile(file) {
    Save.readFile(file).then(result => {
      if (!result.ok) {
        UI.showDialog(
          "Не удалось прочитать файл",
          messageForLoadError(result.error),
          [{ label: "Понятно", primary: true }]
        );
        return;
      }

      const validation = validateSnapshot(result.snapshot);
      if (!validation.ok) {
        UI.showDialog(
          "Несовместимое сохранение",
          messageForValidationError(validation.reason),
          [{ label: "Закрыть", primary: true }]
        );
        return;
      }

      // Подтверждение перед перезаписью текущего прогресса.
      UI.showDialog(
        "Загрузить сохранение из файла?",
        "Текущий прогресс будет заменён содержимым файла. Сохранение в браузере останется без изменений.",
        [
          { label: "Отмена" },
          {
            label: "Загрузить", primary: true, action: () => {
              applyLoadedSnapshot(validation.data);
              UI.showDialog("Загрузка", "Сохранение из файла успешно загружено.", [
                { label: "Продолжить", primary: true }
              ]);
            }
          }
        ]
      );
    });
  }

  // Импорт через системный диалог выбора файла.
  // Если в index.html есть статический #import-file-input, UI может
  // кликнуть по нему сам и вызвать importSaveFromFile напрямую.
  function importSave() {
    Save.pickFile(file => {
      if (!file) return; // пользователь отменил
      importSaveFromFile(file);
    }, "application/json,.json");
  }

  /* ---------- рестарт ---------- */

  function restart() {
    UI.showDialog(
      "Начать заново?",
      "Текущий прогресс будет сброшен. Сохранение в браузере останется без изменений.",
      [
        { label: "Отмена" },
        {
          label: "Начать заново", primary: true, action: () => {
            Game.setState(Game.freshState());
            Game.resetLog();
            Game.clearInfo();
            Game.render();
          }
        }
      ]
    );
  }

  /* ---------- справка ---------- */

  function showHelp() {
    UI.showDialog(
      "Справка",
      "Выбирай действия в центральном окне. Серые действия пока недоступны: обычно не выполнены условия или не хватает предмета. В правом окне — персонаж и вкладки с заданиями и инвентарём. В инвентаре можно фильтровать предметы по типу. Сохранение хранится в localStorage этого браузера. Кнопки «Экспорт в файл» и «Импорт из файла» позволяют сохранить прогресс в файл и загрузить его обратно.",
      [{ label: "Понятно", primary: true }]
    );
  }

  /* ---------- тексты ошибок ---------- */

  function messageForLoadError(error) {
    switch (error) {
      case "empty": return "Сохранение для этой игры не найдено в этом браузере.";
      case "parse": return "Файл сохранения повреждён и не может быть прочитан.";
      default: return "Не удалось получить доступ к локальному хранилищу браузера.";
    }
  }

  function messageForValidationError(reason) {
    switch (reason) {
      case "version": return "Сохранение создано в другой версии игры и не может быть загружено.";
      case "location": return "Локация из сохранения больше не существует в текущей версии игры.";
      case "format":
      default: return "Сохранение имеет неподдерживаемый формат.";
    }
  }

  /* ---------- экспорт ---------- */

  Object.assign(window.Game, {
    onCommand,
    saveGame,
    loadGame,
    restart,
    showHelp,
    buildSnapshot,
    validateSnapshot,
    chooseDialogue,
    closeDialogue,
    claimStipend,
    exportSave,
    importSave,
    importSaveFromFile,
    applyLoadedSnapshot
  });
})();