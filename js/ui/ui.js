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

  // Drawer-режим для боковых панелей на узких экранах
  function initDrawers() {
    const layout = document.querySelector(".layout");
    const btnSide = document.getElementById("toggle-side");
    const btnRight = document.getElementById("toggle-side-right");
    if (!layout || !btnSide || !btnRight) return;

    const closeAll = () => {
      layout.classList.remove("side-open", "side-right-open");
    };

    btnSide.addEventListener("click", e => {
      e.stopPropagation();
      layout.classList.toggle("side-open");
      layout.classList.remove("side-right-open");
    });

    btnRight.addEventListener("click", e => {
      e.stopPropagation();
      layout.classList.toggle("side-right-open");
      layout.classList.remove("side-open");
    });

    // Клик по затемнению / вне шторки — закрыть
    layout.addEventListener("click", e => {
      if (e.target === layout) closeAll();
    });

    // Esc — закрыть
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeAll();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDrawers);
  } else {
    initDrawers();
  }

  window.UI.__ready = true;
})();