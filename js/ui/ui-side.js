/*
  UI — боковая панель.
  Регистрирует методы в window.UI: renderSide, renderTabs, renderInventory,
  renderMap, renderQuests, renderCharacter.

  Зависит от window.UI.escapeHtml и window.UI.getHandlers.
  Должен подключаться после ui-core.js.
*/
(() => {
  "use strict";

  const UI = window.UI;
  if (!UI) { console.error("ui-side.js: window.UI не найден. Подключите ui-core.js раньше."); return; }

  const { escapeHtml, getHandlers } = UI;

  /* ---------- боковая панель ---------- */

  function renderSide(side) {
    renderTabs(side.tabs, side.activeTab);
    const root = UI.$("side-content");
    root.replaceChildren();
    switch (side.content.type) {
      case "inventory": renderInventory(root, side.content.items); break;
      case "map":       renderMap(root, side.content.rows);        break;
      case "quests":    renderQuests(root, side.content.quests);   break;
      case "status":    renderCharacter(root, side.content.info);  break;
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

  function renderQuests(root, quests) {
    root.innerHTML = quests
      .map(q => `<p>${q.done ? "✓" : "○"} ${escapeHtml(q.text)}</p>`)
      .join("");
  }

  function renderCharacter(root, info) {
    const hasAvatar = !!info.avatar;
    const avatarHtml = hasAvatar
      ? `<div class="character-avatar">` +
          `<img id="character-avatar-img" src="${escapeHtml(info.avatar)}" ` +
               `alt="${escapeHtml(info.avatarAlt || info.name || "Персонаж")}">` +
        `</div>`
      : `<div class="character-avatar character-avatar--empty" aria-hidden="true">?</div>`;

    const nameHtml = info.name
      ? `<div class="character-name">${escapeHtml(info.name)}</div>`
      : "";

    const descHtml = info.description
      ? `<p class="character-desc">${escapeHtml(info.description)}</p>`
      : "";

    root.innerHTML =
      `<div class="character-card">` +
        avatarHtml +
        nameHtml +
        descHtml +
      `</div>` +
      `<div class="character-stats">` +
        `<p><strong>День:</strong> ${info.day}</p>` +
        `<p><strong>Время:</strong> ${info.time}</p>` +
        `<p><strong>Деньги:</strong> ${info.money} ₽</p>` +
        `<p><strong>Инвентарь:</strong> ${info.inventoryCount} предмет(а)</p>` +
      `</div>`;
  }

  // Регистрируем публичные методы в общем объекте UI.
  Object.assign(UI, {
    renderSide,
    renderTabs,
    renderInventory,
    renderMap,
    renderQuests,
    renderCharacter
  });
})();