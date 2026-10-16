/*
  UI — точка входа.
  Подключается последним среди ui-*.js. Проверяет, что все модули
  зарегистрировали свои методы, и оставляет хук на случай расширения.
*/
(() => {
  "use strict";

  const UI = window.UI;
  if (!UI) { console.error("ui.js: window.UI не найден. Проверьте порядок подключения ui-*.js."); return; }

  const required = [
    "init", "render", "showDialog", "escapeHtml",
    "renderSide", "renderControls"
  ];
  const missing = required.filter(name => typeof UI[name] !== "function");
  if (missing.length) {
    console.error("ui.js: не зарегистрированы методы:", missing.join(", "));
    return;
  }

  window.UI.__ready = true;
})();