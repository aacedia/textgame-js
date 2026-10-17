/*
  UI — боковая панель.
  Регистрирует методы в window.UI:
    renderSide, renderTabs, renderInventory, renderMap, renderQuests,
    renderCharacterPanel.

  Панель «Персонаж» — отдельное окно в правой колонке (не вкладка),
  рендерится через renderCharacterPanel.

  Зависит от window.UI.escapeHtml и window.UI.getHandlers.
  Должен подключаться после ui-core.js.
*/
(() => {
  "use strict";

  const UI = window.UI;
  if (!UI) { console.error("ui-side.js: window.UI не найден. Подключите ui-core.js раньше."); return; }

  const { escapeHtml, getHandlers } = UI;

  /* ---------- боковая панель: вкладки ---------- */

  function renderSide(side) {
    renderTabs(side.tabs, side.activeTab);
    const root = UI.$("side-content");
    root.replaceChildren();
    switch (side.content.type) {
      case "inventory": renderInventory(root, side.content.items); break;
      case "map": renderMap(root, side.content.rows); break;
      case "quests": renderQuests(root, side.content.quests); break;
    }
  }

  function renderTabs(tabs, activeId) {
    const root = UI.$("tabs");
    root.replaceChildren();
    tabs.forEach(tab => {
      const b = document.createElement("button");
      b.className = "tab" + (activeId === tab.id ? " active" : "");
      b.textContent = tab.label;
      b.setAttribute("aria-pressed", activeId === tab.id ? "true" : "false");
      b.addEventListener("click", () => getHandlers().onCommand("tab:" + tab.id));
      root.appendChild(b);
    });
  }

  /* ---------- вкладка «Инвентарь» ---------- */

  function renderInventory(root, items) {
    if (!items.length) {
      root.innerHTML = '<p class="empty">Пока пусто. Найденные предметы появятся здесь.</p>';
      return;
    }
    const ul = document.createElement("ul");
    ul.className = "inventory";
    items.forEach(item => {
      const li = document.createElement("li");
      li.className = "item";
      li.innerHTML =
        `<span class="itemicon" aria-hidden="true">${escapeHtml(item.icon || "◆")}</span>` +
        `<span><span class="itemname">${escapeHtml(item.name)}</span><br>` +
        `<span class="itemnote">${escapeHtml(item.description || "")}</span></span>`;
      ul.appendChild(li);
    });
    root.appendChild(ul);
  }

  /* ---------- вкладка «Карта» ---------- */

  function renderMap(root, rows) {
    const list = document.createElement("div");
    list.className = "maplist";
    rows.forEach(row => {
      const rowEl = document.createElement("div");
      rowEl.className = "maprow" + (row.current ? " current" : "");
      const closedMark = row.open === false
        ? ' <small class="closed">· закрыто</small>'
        : "";
      rowEl.innerHTML =
        `<span>${escapeHtml(row.name)}` +
        `${row.current ? " <small>· здесь</small>" : ""}` +
        `${closedMark}</span>`;
      const btn = document.createElement("button");
      btn.textContent = row.current ? "Текущая" : "Перейти";
      btn.disabled = row.current || !row.reachable;
      btn.title = !row.reachable && !row.current
        ? (row.open === false ? "Локация закрыта" : "Сюда нельзя попасть напрямую")
        : "";
      btn.addEventListener("click", () => getHandlers().onAction("goto:" + row.id));
      rowEl.appendChild(btn);
      list.appendChild(rowEl);
    });
    root.appendChild(list);
  }

  /* ---------- вкладка «Задания» ---------- */

  function renderQuests(root, quests) {
    root.innerHTML = quests
      .map(q => `<p>${q.done ? "✓" : "○"} ${escapeHtml(q.text)}</p>`)
      .join("");
  }

  /* ---------- панель «Персонаж» ---------- */

  function renderCharacterPanel(info) {
    const root = UI.$("character-content");
    if (!root || !info) return;
    root.replaceChildren();

    // Аватар
    const hasAvatar = !!info.avatar;
    const avatarEl = document.createElement("div");
    avatarEl.className = "character-avatar" + (hasAvatar ? "" : " character-avatar--empty");

    if (hasAvatar) {
      const img = document.createElement("img");
      img.id = "character-avatar-img";
      img.src = info.avatar;
      img.alt = info.avatarAlt || info.name || "Персонаж";
      img.onerror = () => {
        avatarEl.classList.add("character-avatar--empty");
        avatarEl.replaceChildren(document.createTextNode("?"));
      };
      avatarEl.appendChild(img);
    } else {
      avatarEl.textContent = "?";
      avatarEl.setAttribute("aria-hidden", "true");
    }
    root.appendChild(avatarEl);

    // Имя
    if (info.name) {
      const nameEl = document.createElement("div");
      nameEl.className = "character-name";
      nameEl.textContent = info.name;
      root.appendChild(nameEl);
    }

    // Описание
    if (info.description) {
      const descEl = document.createElement("p");
      descEl.className = "character-desc";
      descEl.textContent = info.description;
      root.appendChild(descEl);
    }
  }

  /* ---------- экспорт ---------- */

  Object.assign(UI, {
    renderSide,
    renderTabs,
    renderInventory,
    renderMap,
    renderQuests,
    renderCharacterPanel
  });
})();