/*
  UI — ядро. Базовые утилиты, инициализация, диспетчер рендера.
  Публикует window.UI с общими методами и вызывает соседние модули
  (ui-side.js, ui-controls.js) через тот же объект UI.

  Этот файл должен подключаться первым среди ui-*.js, но ui.js (точка входа)
  — последним.
*/
window.UI = (() => {
  "use strict";

  const $ = id => document.getElementById(id);

  let handlers = { onAction: () => {}, onCommand: () => {} };

  function init(opts) {
    handlers = Object.assign(handlers, opts || {});

    // Кнопки панели «Управление».
    document.querySelectorAll("[data-command]").forEach(btn => {
      btn.addEventListener("click", () => handlers.onCommand(btn.dataset.command));
    });

    // Заголовок «Управление» — сворачивание/разворачивание.
    const toggle = $("controls-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => handlers.onCommand("controls:toggle"));
    }

    // Делегируем инициализацию соседним модулям, если они есть.
    if (typeof UI.initSide === "function")     UI.initSide(handlers);
    if (typeof UI.initControls === "function") UI.initControls(handlers);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[c]);
  }

  function getHandlers() { return handlers; }

  /* ---------- главный рендер ---------- */

  function render(vm) {
    renderStatus(vm.status);
    renderLocation(vm.location);
    renderActions(vm.actions);
    renderLog(vm.log);
    if (typeof UI.renderSide === "function")     UI.renderSide(vm.side);
    if (typeof UI.renderControls === "function") UI.renderControls(vm.controlsOpen);
  }

  function renderStatus(status) {
    $("status").innerHTML =
      `День ${status.day} · ${status.time}<br>` +
      `Баланс: ${status.money} ₽<br>` +
      `Локация: ${escapeHtml(status.locationName)}`;
  }

  function renderLocation(loc) {
    $("location-name").textContent = loc.name;

    const tagEl = $("location-tag");
    tagEl.textContent = loc.tagText || loc.tag || "";
    tagEl.className = "tag" + (loc.tagClass ? " " + loc.tagClass : "");

    const noticeEl = $("location-notice");
    if (loc.notice) {
      noticeEl.textContent = loc.notice;
      noticeEl.hidden = false;
    } else {
      noticeEl.textContent = "";
      noticeEl.hidden = true;
    }

    $("description").innerHTML = loc.description
      .map(p => `<p>${escapeHtml(p)}</p>`)
      .join("");

    renderLocationImage(loc);
  }

  function renderLocationImage(loc) {
    const figure = $("location-image");
    const img = $("location-image-img");
    const caption = $("location-image-caption");
    if (loc.image) {
      img.src = loc.image;
      img.alt = loc.imageAlt || `Изображение локации: ${loc.name}`;
      caption.textContent = loc.imageCaption || "";
      caption.hidden = !loc.imageCaption;
      figure.hidden = false;
    } else {
      img.removeAttribute("src");
      img.alt = "";
      caption.textContent = "";
      figure.hidden = true;
    }
  }

  function renderActions(actions) {
    const root = $("actions");
    root.replaceChildren();
    actions.forEach(action => {
      const button = document.createElement("button");
      button.disabled = !action.available;
      const hintText = action.available
        ? (action.hint || "")
        : (action.unavailableReason || "Сейчас недоступно");
      button.innerHTML =
        `<span class="action-title">${escapeHtml(action.label)}</span>` +
        `<span class="hint">${escapeHtml(hintText)}</span>`;
      button.title = action.available ? action.label : hintText;
      button.addEventListener("click", () => handlers.onAction(action.id));
      root.appendChild(button);
    });
  }

  function renderLog(entries) {
    const root = $("log");
    root.replaceChildren();
    entries.slice(0, 10).forEach(entry => {
      const div = document.createElement("div");
      div.className = "logentry";
      div.textContent = entry;
      root.appendChild(div);
    });
  }

  /* ---------- диалоги ---------- */

  function showDialog(title, body, buttons) {
    $("dialog-title").textContent = title;
    $("dialog-body").textContent = body;
    const root = $("dialog-actions");
    root.replaceChildren();
    (buttons || []).forEach(({ label, action, primary = false }) => {
      const b = document.createElement("button");
      b.textContent = label;
      if (primary) b.style.borderColor = "var(--accent)";
      b.addEventListener("click", () => { $("dialog").close(); if (action) action(); });
      root.appendChild(b);
    });
    $("dialog").showModal();
  }

  // Публичный API ядра. Соседние модули допишут свои методы в этот же объект.
  return {
    init,
    render,
    showDialog,
    escapeHtml,
    $,
    getHandlers
  };
})();