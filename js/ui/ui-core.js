/*
  UI — ядро. Базовые утилиты, инициализация, диспетчер рендера.
  Публикует window.UI с общими методами и вызывает соседние модули
  (ui-side.js, ui-controls.js) через тот же объект UI.

  Этот файл подключается первым среди ui-*.js, ui.js — последним.

  Публичный API:
    UI.init({ onAction, onCommand })
    UI.render(viewModel)
    UI.showDialog(title, body, buttons)
    UI.escapeHtml(value)
    UI.$(id)
    UI.getHandlers()

  viewModel:
    {
      status: { day, time, money, date, timeOfDay, timeIcon },
      location: { name, tag, tagText?, tagClass?, notice?, description[], image?, imageAlt?, imageCaption? },
      info: { visible, entries: [{ kind: "text" | "image", ... }] },
      actions: [{ id, label, hint, available, unavailableReason?, accent?, recent?, count?, type?, choices? }],
      log: [ "строка", ... ],
      logOpen: boolean,
      side: { activeTab, tabs: [{ id, label }], content: { type, ... }, character: {...} },
      controlsOpen: boolean,
      gameOver: boolean,
      dialogue: { text, choices: [{ text, index }] } | null
    }
*/
window.UI = (() => {
  "use strict";

  const $ = id => document.getElementById(id);

  let handlers = { onAction: () => { }, onCommand: () => { } };

  /* ---------- инициализация ---------- */

  function init(opts) {
    handlers = Object.assign(handlers, opts || {});

    // Кнопки панели «Управление»: сохранить, загрузить, справка, чит-код, рестарт.
    document.querySelectorAll("[data-command]").forEach(btn => {
      btn.addEventListener("click", () => {
        const cmd = btn.dataset.command;
        if (cmd === "cheat") {
          openCheatDialog();
        } else {
          handlers.onCommand(cmd);
        }
      });
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

    // Кнопка «Начать заново» в оверлее «Игра окончена».
    const gameOverRestart = $("game-over-restart");
    if (gameOverRestart) {
      gameOverRestart.addEventListener("click", () => handlers.onCommand("restart"));
    }

    // Закрытие диалога с Химари по Esc: сообщаем наружу.
    const dlg = $("dialogue-dialog");
    if (dlg) {
      dlg.addEventListener("close", () => handlers.onCommand("dialogue:close"));
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
    if (typeof UI.renderCharacterPanel === "function") UI.renderCharacterPanel(vm.side.character);
    if (typeof UI.renderSide === "function") UI.renderSide(vm.side);
    if (typeof UI.renderControls === "function") UI.renderControls(vm.controlsOpen);
    renderGameOver(vm.gameOver);
    renderDialogue(vm.dialogue);
  }

  /* ---------- статус ---------- */

  function renderStatus(status) {
    const root = $("status");
    root.replaceChildren();

    const dateText = status.date && status.date.text ? status.date.text : `день ${status.day}`;

    const timeBadge = buildBadge({
      main: `${status.timeIcon ? status.timeIcon + " " : ""}${status.time}`,
      sub: dateText,
      modifier: "badge--time" + (status.timeOfDay ? " badge--time--" + status.timeOfDay : "")
    });
    root.appendChild(timeBadge);

    const moneyBadge = buildBadge({
      main: `${status.money} ¥`,
      modifier: "badge--money"
    });
    root.appendChild(moneyBadge);
  }

  function buildBadge({ main, sub, modifier }) {
    const badge = document.createElement("span");
    badge.className = "badge" + (modifier ? " " + modifier : "");
    const mainEl = document.createElement("span");
    mainEl.className = "badge__main";
    mainEl.textContent = main || "";
    badge.appendChild(mainEl);
    if (sub) {
      const subEl = document.createElement("span");
      subEl.className = "badge__sub";
      subEl.textContent = sub;
      badge.appendChild(subEl);
    }
    return badge;
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

    const descRoot = $("description");
    descRoot.replaceChildren();
    (loc.description || []).forEach(item => {
      if (item.type === "parts" && Array.isArray(item.parts)) {
        const p = document.createElement("p");
        item.parts.forEach(part => {
          if (part.link) {
            const a = document.createElement("a");
            a.href = "#";
            a.className = "inline-action";
            a.dataset.action = part.link.action;
            a.textContent = part.link.text;
            a.addEventListener("click", e => {
              e.preventDefault();
              handlers.onAction(part.link.action);
            });
            p.appendChild(a);
          } else {
            p.appendChild(document.createTextNode(part.text || ""));
          }
        });
        descRoot.appendChild(p);
      } else {
        const p = document.createElement("p");
        p.textContent = item.text || "";
        descRoot.appendChild(p);
      }
    });

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

  /* ---------- информация ---------- */

  function renderInfo(info) {
    const panel = $("info-panel");
    const list = $("info-list");
    if (!panel || !list) return;

    if (!info || !info.visible) {
      panel.hidden = true;
      list.replaceChildren();
      return;
    }

    // Если в "Информации" только картинка (без текста) — панель не нужна:
    // картинка уходит наверх, в описание локации.
    const textEntries = (info.entries || []).filter(
      e => e.kind === "text" || e.kind === "rich"
    );
    if (!textEntries.length) {
      panel.hidden = true;
      list.replaceChildren();
      return;
    }

    panel.hidden = false;
    list.replaceChildren();
    textEntries.forEach(entry => {
      list.appendChild(buildInfoText(entry));
    });
  }

  function buildInfoText(entry) {
    if (entry.kind === "rich") {
      const p = document.createElement("p");
      p.className = "infoentry infoentry--text";
      (entry.parts || []).forEach(part => {
        if (part.link) {
          const a = document.createElement("a");
          a.href = part.link.href;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.className = "inline-action";
          a.textContent = part.link.text;
          p.appendChild(a);
        } else {
          p.appendChild(document.createTextNode(part.text || ""));
        }
      });
      return p;
    }
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

      // Иконка предмета (если действие выдаёт предмет).
      const iconHtml = action.itemIconImage
        ? `<img class="action-icon-img" src="${escapeHtml(action.itemIconImage)}" alt="">`
        : (action.itemIcon ? `<span class="action-icon-emoji">${escapeHtml(action.itemIcon)}</span>` : "");

      // Кнопка «назад»: компактная, на всю ширину, без описания.
      if (action.type === "back") {
        button.className = "action action--back";
        button.disabled = !action.available;
        button.innerHTML = `<span class="action-title">${escapeHtml(action.label)}</span>`;
        button.title = action.label;
        button.addEventListener("click", () => handlers.onAction(action.id));
        root.appendChild(button);
        return;
      }

      button.disabled = !action.available;
      button.classList.add("action");
      if (action.accent) button.classList.add("action--" + action.accent);
      if (action.recent) button.classList.add("action--recent");

      const countHtml = action.count > 1
        ? `<span class="action-count" title="Нажато раз: ${action.count}">${action.count}</span>`
        : "";

      const hintText = action.available
        ? (action.hint || "")
        : (action.unavailableReason || "Сейчас недоступно");

      button.innerHTML =
        `<span class="action-head">` +
        iconHtml +
        `<span class="action-title">${escapeHtml(action.label)}${countHtml}</span>` +
        `</span>` +
        `<span class="hint">${escapeHtml(hintText)}</span>`;
      button.title = action.available ? action.label : hintText;

      const img = button.querySelector(".action-icon-img");
      if (img) {
        img.onerror = () => {
          const wrap = img.parentElement;
          if (action.itemIcon) {
            wrap.innerHTML = `<span class="action-icon-emoji">${escapeHtml(action.itemIcon)}</span>`;
          } else {
            img.remove();
          }
        };
      }

      button.addEventListener("click", () => {
        if (action.type === "choice" && Array.isArray(action.choices)) {
          openChoice(action);
        } else {
          handlers.onAction(action.id);
        }
      });

      root.appendChild(button);
    });
  }

  /* ---------- диалог выбора (например, сон) ---------- */

  function openChoice(action) {
    const dialog = $("dialog");
    $("dialog-title").textContent = action.label;
    $("dialog-body").replaceChildren();

    const wrap = document.createElement("div");
    wrap.className = "choice-list";
    action.choices.forEach(choice => {
      const b = document.createElement("button");
      b.textContent = choice.label;
      b.className = "choice-item";
      b.addEventListener("click", () => {
        dialog.close();
        handlers.onAction(action.id + ":" + choice.minutes);
      });
      wrap.appendChild(b);
    });
    $("dialog-body").appendChild(wrap);

    const actionsEl = $("dialog-actions");
    actionsEl.replaceChildren();
    const cancel = document.createElement("button");
    cancel.textContent = "Отмена";
    cancel.addEventListener("click", () => dialog.close());
    actionsEl.appendChild(cancel);

    dialog.showModal();
  }

  /* ---------- история событий ---------- */

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

  /* ---------- «Игра окончена» ---------- */

  function renderGameOver(active) {
    const root = $("game-over");
    if (!root) return;
    root.hidden = !active;
  }

  /* ---------- диалог ---------- */

  function renderDialogue(dialogue) {
    const dlg = $("dialogue-dialog");
    const body = $("dialogue-body");
    const actions = $("dialogue-actions");
    const nameEl = $("dialogue-name");
    const avatarWrap = $("dialogue-avatar");
    const avatarImg = $("dialogue-avatar-img");
    const relationValue = $("dialogue-relation-value");
    const relationFill = $("dialogue-relation-fill");
    if (!dlg || !body || !actions) return;

    if (!dialogue) {
      if (dlg.open) dlg.close();
      return;
    }

    // Шапка с аватаром и отношением.
    if (dialogue.npc) {
      if (nameEl) nameEl.textContent = dialogue.npc.name || "";
      if (avatarWrap && avatarImg) {
        if (dialogue.npc.avatar) {
          avatarImg.src = dialogue.npc.avatar;
          avatarImg.alt = dialogue.npc.avatarAlt || dialogue.npc.name || "";
          avatarImg.style.display = "";
          avatarWrap.replaceChildren(avatarImg);
          avatarWrap.classList.remove("dialogue-avatar--empty");
        } else {
          avatarImg.removeAttribute("src");
          avatarImg.alt = "";
          avatarImg.style.display = "none";
          avatarWrap.classList.add("dialogue-avatar--empty");
          avatarWrap.replaceChildren(document.createTextNode("?"));
        }
      }
      if (relationValue && dialogue.relationship) {
        relationValue.textContent = `${dialogue.relationship.value}/${dialogue.relationship.max}`;
      }
      if (relationFill && dialogue.relationship) {
        relationFill.style.width = dialogue.relationship.pct + "%";
      }
    }

    body.textContent = dialogue.text || "";
    actions.replaceChildren();
    (dialogue.choices || []).forEach(choice => {
      const b = document.createElement("button");
      b.className = "dialogue-choice";
      if (choice.iconImage) {
        const img = document.createElement("img");
        img.className = "dialogue-choice__icon";
        img.src = choice.iconImage;
        img.alt = "";
        img.onerror = () => img.remove();
        b.appendChild(img);
      } else if (choice.icon) {
        const span = document.createElement("span");
        span.className = "dialogue-choice__icon-emoji";
        span.textContent = choice.icon;
        b.appendChild(span);
      }
      const label = document.createElement("span");
      label.className = "dialogue-choice__label";
      label.textContent = choice.text;
      b.appendChild(label);
      b.addEventListener("click", () => {
        handlers.onCommand("dialogue:choose:" + choice.index);
      });
      actions.appendChild(b);
    });

    if (!dlg.open) dlg.showModal();
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

  /* ---------- чит-диалог ---------- */

  function openCheatDialog() {
    const dialog = $("cheat-dialog");
    const input = $("cheat-input");
    const apply = $("cheat-apply");
    const cancel = $("cheat-cancel");
    if (!dialog || !input || !apply || !cancel) return;

    input.value = "";

    let submitted = false;
    const onSubmit = () => {
      if (submitted) return;
      submitted = true;
      const command = input.value.trim();
      dialog.close();
      if (command) {
        setTimeout(() => handlers.onCommand("cheat:apply:" + command), 0);
      }
    };

    apply.onclick = e => {
      e.preventDefault();
      onSubmit();
    };
    cancel.onclick = e => {
      e.preventDefault();
      dialog.close();
    };
    input.onkeydown = e => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        dialog.close();
      }
    };

    dialog.showModal();
    input.focus();
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