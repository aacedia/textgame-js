/*
  UI — сворачиваемая панель «Управление».
  Регистрирует renderControls в window.UI.

  Должен подключаться после ui-core.js.
*/
(() => {
  "use strict";

  const UI = window.UI;
  if (!UI) { console.error("ui-controls.js: window.UI не найден. Подключите ui-core.js раньше."); return; }

  function renderControls(open) {
    const toggle = UI.$("controls-toggle");
    const content = UI.$("controls-content");
    if (!toggle || !content) return;
    const isOpen = !!open;
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    content.hidden = !isOpen;
  }

  // Заглушка для симметрии: клик по кнопке уже обработан в ui-core.js.
  function initControls(_handlers) { /* no-op */ }

  Object.assign(UI, { renderControls, initControls });
})();