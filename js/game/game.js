/*
  Игровой движок — точка входа.
  Подключается последним среди game-*.js.
  Связывает UI с состоянием и командами, определяет render и запускает игру.
*/
window.Game = window.Game || {};

(() => {
  "use strict";

  const GAME_DATA = window.GAME_DATA;
  const Rules = window.Rules;
  const Save = window.Save;
  const UI = window.UI;
  if (!GAME_DATA) { console.error("game.js: window.GAME_DATA не найден."); return; }
  if (!Rules) { console.error("game.js: window.Rules не найден."); return; }
  if (!Save) { console.error("game.js: window.Save не найден."); return; }
  if (!UI) { console.error("game.js: window.UI не найден."); return; }

  // Проверяем, что все модули зарегистрировали свои методы.
  const required = [
    "getState", "setState", "patchState",
    "getLog", "pushLog", "resetLog", "freshState",
    "buildViewModel",
    "onAction",
    "onCommand"
  ];
  const missing = required.filter(name => typeof Game[name] !== "function");
  if (missing.length) {
    console.error("game.js: не зарегистрированы методы:", missing.join(", "));
    return;
  }

  function render() {
    UI.render(Game.buildViewModel());
  }

  Object.assign(window.Game, { render });

  /* ---------- старт ---------- */

  // Проверка данных при старте. Не блокирует игру: если что-то не так, пишем в консоль и продолжаем.
  if (typeof DataValidation !== "undefined" && typeof DataValidation.validate === "function") {
    const report = DataValidation.validate(GAME_DATA);
    if (!report.ok) {
      console.warn(`DataValidation: обнаружено ${report.errors.length} проблем(ы) в data.js:`);
      report.errors.forEach(err => {
        const prefix = err.path ? `[${err.path}] ` : "";
        console.warn(`  ${prefix}${err.message}`);
      });
    }
  }

  UI.init({ onAction: Game.onAction, onCommand: Game.onCommand });
  render();
})();