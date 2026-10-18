/*
  UI — боковая панель.
  Регистрирует методы в window.UI:
    renderSide, renderTabs, renderInventory, renderQuests,
    renderCharacterPanel.
  Панель «Персонаж» — отдельное окно в правой колонке (не вкладка).
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
      case "inventory": renderInventory(root, side.content); break;
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

  function renderInventory(root, content) {
    const items = content.items || [];
    const filter = content.filter || "all";
    const filters = content.filters || [];

    // Панель фильтров
    if (filters.length) {
      const bar = document.createElement("div");
      bar.className = "inv-filters";
      filters.forEach(f => {
        const b = document.createElement("button");
        b.className = "inv-filter" + (f.id === filter ? " active" : "");
        b.textContent = f.label;
        b.addEventListener("click", () => getHandlers().onCommand("inventory:filter:" + f.id));
        bar.appendChild(b);
      });
      root.appendChild(bar);
    }

    if (!items.length) {
      const p = document.createElement("p");
      p.className = "empty";
      p.textContent = filter === "all"
        ? "Пока пусто. Найденные предметы появятся здесь."
        : "В этой категории пусто.";
      root.appendChild(p);
      return;
    }

    const ul = document.createElement("ul");
    ul.className = "inventory";
    items.forEach(item => {
      const li = document.createElement("li");
      li.className = "item";

      const countHtml = item.count > 1
        ? `<span class="item-count">×${item.count}</span>`
        : "";

      const useHtml = item.consumable
        ? `<button class="item-use" data-item="${escapeHtml(item.id)}">Использовать</button>`
        : "";

      li.innerHTML =
        `<span class="itemicon" aria-hidden="true">${escapeHtml(item.icon || "◆")}</span>` +
        `<span class="item-body">` +
        `<span class="itemname">${escapeHtml(item.name)}${countHtml}</span><br>` +
        `<span class="itemnote">${escapeHtml(item.description || "")}</span>` +
        `</span>` +
        useHtml;

      const btn = li.querySelector(".item-use");
      if (btn) {
        btn.addEventListener("click", () => getHandlers().onAction("use:" + item.id));
      }

      ul.appendChild(li);
    });
    root.appendChild(ul);
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

    // Полоски характеристик
    if (Array.isArray(info.bars)) {
      root.appendChild(buildBars(info.bars));
    }
  }

  function buildBars(bars) {
    const wrap = document.createElement("div");
    wrap.className = "character-bars";
    bars.forEach(bar => {
      const row = document.createElement("div");
      row.className = "char-bar char-bar--" + bar.color;
      if (bar.level && bar.level !== "normal") {
        row.classList.add("char-bar--" + bar.level);
      }
      if (bar.tooltip) {
        row.title = bar.tooltip;
        row.classList.add("char-bar--with-tooltip");
      }

      const label = document.createElement("div");
      label.className = "char-bar__label";
      label.textContent = bar.label;

      const track = document.createElement("div");
      track.className = "char-bar__track";
      const fill = document.createElement("div");
      fill.className = "char-bar__fill";
      const pct = Math.max(0, Math.min(100, (Number(bar.value) / Math.max(1, Number(bar.max))) * 100));
      fill.style.width = pct + "%";
      track.appendChild(fill);

      const value = document.createElement("div");
      value.className = "char-bar__value";
      value.textContent = `${Math.round(Number(bar.value) || 0)}/${bar.max}`;

      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(value);
      wrap.appendChild(row);
    });
    return wrap;
  }

  /* ---------- экспорт ---------- */

  Object.assign(UI, {
    renderSide,
    renderTabs,
    renderInventory,
    renderQuests,
    renderCharacterPanel
  });
})();