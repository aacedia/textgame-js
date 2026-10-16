/*
  UI — ядро. Базовые утилиты, инициализация, диспетчер рендера.
  Публикует window.UI с общими методами и вызывает соседние модули
  (ui-side.js, ui-controls.js) через тот же объект UI.

  Этот файл подключается первым среди ui-*.js, но ui.js (точка входа)
  — последним.

  Публичный API:
    UI.init({ onAction, onCommand })
    UI.render(viewModel)
    UI.showDialog(title, body, buttons)
    UI.escapeHtml(value)
    UI.$(id)
    UI.getHandlers()

  viewModel — объект со всеми данными для одного кадра:
    {
      status: { day, time, money, locationName },
      location: {
        name, tag, tagText?, tagClass?, notice?,
        description[], image?, imageAlt?, imageCaption?
      },
      info: { visible, entries: [{ kind: "text" | "image", ... }] },
      actions: [{ id, label, hint, available, unavailableReason? }],
      log: [ "строка", ... ],
      logOpen: boolean,
      side: {
        activeTab: "inventory" | "map" | "quests" | "status",
        tabs: [{ id, label }],
        content: { type: "...", ... }
      },
      controlsOpen: boolean
    }

  UI не хранит состояние. Он просто рисует то, что ему передали.
*/
window.UI = (() => {
  "use strict";

  const $ = id => document.getElementById(id);

  let handlers = { onAction: () => { }, onCommand: () => { } };

  /* ---------- инициализация ---------- */

  function init(opts) {
    handlers = Object.assign(handlers, opts || {});

    // Кнопки панели «Управление» — сохранить/загрузить/справка/рестарт.
    document.querySelectorAll("[data-command]").forEach(btn => {
      btn.addEventListener("click", () => handlers.onCommand(btn.dataset.command));
    });

    // Заголовок «Управление» — сворачивание/разворачивание.
    const controlsToggle = $("controls-toggle");
    if (controlsToggle) {
      controlsToggle.addEventListener("click", () => handlers.onCommand("controls:toggle"));
    }

    // Заголовок «История событий» — сворачивание/разворачивание.
    const logToggle = $("log-toggle");
    if (logToggle) {
      logToggle.addEventListener("click", () => handlers.onCommand("log:toggle"));
    }

    // Делегируем инициализацию соседним модулям, если они есть.
    if (typeof UI.initSide === "function") UI.initSide(handlers);
    if (typeof UI.initControls === "function") UI.initControls(handlers);
  }

  function getHandlers() { return handlers; }

  /* ---------- утилиты ---------- */

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[c]);
  }

  /* ---------- главный рендер ---------- */

  function render(vm) {
    renderStatus(vm.status);
    renderLocation(vm.location);
    renderInfo(vm.info);
    renderActions(vm.actions);
    renderLog(vm.log, vm.logOpen);
    if (typeof UI.renderSide === "function") UI.renderSide(vm.side);
    if (typeof UI.renderControls === "function") UI.renderControls(vm.controlsOpen);
  }

  /* ---------- статус (шапка) ---------- */

  function renderStatus(status) {
    $("status").innerHTML =
      `День ${status.day} · ${status.time}<br>` +
      `Баланс: ${status.money} ₽<br>` +
      `Локация: ${escapeHtml(status.locationName)}`;
  }

  /* ---------- локация ---------- */

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
    if (!figure || !img || !caption) return;

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

  /* ---------- панель «Информация» ---------- */

  function renderInfo(info) {
    const panel = $("info-panel");
    const list = $("info-list");
    if (!panel || !list) return;

    if (!info || !info.visible) {
      panel.hidden = true;
      list.replaceChildren();
      return;
    }

    panel.hidden = false;
    list.replaceChildren();
    info.entries.forEach(entry => {
      if (entry.kind === "image") {
        list.appendChild(buildInfoImage(entry));
      } else if (entry.kind === "text") {
        list.appendChild(buildInfoText(entry));
      }
    });
  }

  function buildInfoText(entry) {
    const p = document.createElement("p");
    p.className = "infoentry infoentry--text";
    p.textContent = entry.text || "";
    return p;
  }

  function buildInfoImage(entry) {
    const figure = document.createElement("figure");
    figure.className = "infoentry infoentry--image";

    const img = document.createElement("img");
    img.className = "infoentry-img";
    img.src = entry.src;
    img.alt = entry.alt || "";
    img.loading = "lazy";
    img.onerror = () => { figure.hidden = true; };
    figure.appendChild(img);

    if (entry.caption) {
      const cap = document.createElement("figcaption");
      cap.className = "infoentry-caption";
      cap.textContent = entry.caption;
      figure.appendChild(cap);
    }

    return figure;
  }

  /* ---------- действия ---------- */

  function renderActions(actions) {
    const root = $("actions");
    root.replaceChildren();
    actions.forEach(action => {
      const button = document.createElement("button");
      button.disabled = !action.available;
      if (action.accent) {
        button.classList.add("action", "action--" + action.accent);
      } else {
        button.classList.add("action");
      }
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

  /* ---------- «История событий» ---------- */

  function renderLog(entries, open) {
    const toggle = $("log-toggle");
    const body = $("log-body");
    if (toggle && body) {
      const isOpen = !!open;
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      body.hidden = !isOpen;
    }

    const root = $("log");
    if (!root) return;
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

  /* ---------- экспорт ---------- */

  return {
    init,
    render,
    showDialog,
    escapeHtml,
    $,
    getHandlers
  };
})();