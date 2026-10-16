/*
  Команды UI: сохранение/загрузка/рестарт/справка, переключение вкладок,
  сворачивание панелей «Управление» и «История событий».

  Публичный API:
    Game.onCommand(command)
    Game.saveGame()
    Game.loadGame()
    Game.restart()
    Game.showHelp()
    Game.buildSnapshot()
    Game.validateSnapshot(snapshot)

  Команды, которые обрабатывает onCommand:
    "tab:<id>"           — переключить вкладку боковой панели
    "controls:toggle"    — свернуть/развернуть панель «Управление»
    "log:toggle"         — свернуть/развернуть панель «История событий»
    "save"               — сохранить игру
    "load"               — загрузить игру
    "restart"            — начать заново (с подтверждением)
    "help"               — показать справку
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

  /* ---------- диспетчер команд ---------- */

  function onCommand(command) {
    if (command.startsWith("tab:")) {
      Game.patchState({ uiTab: command.slice(4) });
      Game.render();
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
    switch (command) {
      case "save": saveGame(); break;
      case "load": loadGame(); break;
      case "restart": restart(); break;
      case "help": showHelp(); break;
    }
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

  /*
    Проверяет снимок сохранения на совместимость с текущими данными игры.
    Возвращает:
      { ok: true, data: { state, logEntries, infoEntries } }
    либо
      { ok: false, reason: "format" | "version" | "location" }

    Нормализация:
      - state мержится с freshState() поверх (чтобы появились новые поля);
      - inventory фильтруется по известным предметам из GAME_DATA.items;
      - flags и variables мержатся с базовыми (чтобы новые ключи появились
        со значениями по умолчанию);
      - logEntries обрезается по LOG_LIMIT;
      - infoEntries фильтруется по Game.isInfoEntry и обрезается по INFO_LIMIT.
  */
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

    const logs = Array.isArray(snapshot.logEntries)
      ? snapshot.logEntries.slice(0, LOG_LIMIT)
      : [];

    const infos = Array.isArray(snapshot.infoEntries)
      ? snapshot.infoEntries.filter(Game.isInfoEntry).slice(0, INFO_LIMIT)
      : [];

    return { ok: true, data: { state: merged, logEntries: logs, infoEntries: infos } };
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

    Game.setState(validation.data.state);
    Game.resetLog(validation.data.logEntries);
    Game.setInfo(validation.data.infoEntries);
    Game.render();
    UI.showDialog("Загрузка", "Сохранение успешно загружено.", [
      { label: "Продолжить", primary: true }
    ]);
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
      "Выбирай действия в центральном окне. Серые действия пока недоступны: обычно не выполнены условия или не хватает предмета. В правом окне переключаются инвентарь, карта, задания и сведения о персонаже. Сохранение хранится в localStorage этого браузера.",
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
    validateSnapshot
  });
})();