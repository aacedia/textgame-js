/*
  UI — главное меню. Показывается до старта игры, поверх всего.
  Регистрирует в window.UI:
    UI.showMainMenu()
    UI.hideMainMenu()
    UI.renderMainMenu(model)

  model:
    {
      hasSave: boolean,          // есть ли сохранение в localStorage
      message: string,           // текст ошибки/подсказки ("" — нет)
      logo: string,              // путь к png-логотипу
      logoAlt: string,
      title: string              // запасной текстовый заголовок
    }

  Клики по пунктам вызывают зарегистрированные колбэки:
    UI.onMainMenuNew()
    UI.onMainMenuLoad()
    UI.onMainMenuLoadFile()
  Если колбэк не задан — пункт неактивен.

  Подключается после ui-core.js, до ui.js.
*/
(() => {
    "use strict";

    const UI = window.UI;
    if (!UI) { console.error("ui-mainmenu.js: window.UI не найден."); return; }

    const handlers = {
        onNew: null,
        onLoad: null,
        onLoadFile: null,
        onMessageClear: null
    };

    // Внутренняя ссылка на корневой элемент; создаётся один раз в showMainMenu.
    let root = null;

    /* ---------- создание разметки ---------- */

    function build() {
        const el = document.createElement("div");
        el.className = "mainmenu";
        el.id = "mainmenu";
        el.hidden = true;

        el.innerHTML =
            `<div class="mainmenu__bg" aria-hidden="true"></div>` +
            `<div class="mainmenu__content">` +
            `  <img class="mainmenu__logo" id="mainmenu-logo" alt="">` +
            `  <nav class="mainmenu__nav" id="mainmenu-nav"></nav>` +
            `  <div class="mainmenu__message" id="mainmenu-message" aria-live="polite"></div>` +
            `</div>`;

        // Клик по фону ничего не делает — специально, чтобы не уходить в игру случайно.

        document.body.appendChild(el);
        return el;
    }

    /* ---------- публичный рендер ---------- */

    function renderMainMenu(model) {
        if (!root) root = build();

        const logo = root.querySelector("#mainmenu-logo");
        const nav = root.querySelector("#mainmenu-nav");
        const msg = root.querySelector("#mainmenu-message");

        // Логотип
        if (model.logo) {
            logo.src = model.logo;
            logo.alt = model.logoAlt || model.title || "Логотип игры";
            logo.style.display = "";
            logo.classList.remove("mainmenu__logo--fallback");

            // Если png не загрузился — подменяем на текстовый заголовок.
            logo.onerror = () => {
                logo.style.display = "none";
                let fallback = root.querySelector(".mainmenu__logo--fallback");
                if (!fallback) {
                    fallback = document.createElement("div");
                    fallback.className = "mainmenu__logo mainmenu__logo--fallback";
                    logo.parentElement.insertBefore(fallback, logo);
                }
                fallback.textContent = model.title || "TEXTGAME";
            };
        } else {
            logo.style.display = "none";
            let fallback = root.querySelector(".mainmenu__logo--fallback");
            if (!fallback) {
                fallback = document.createElement("div");
                fallback.className = "mainmenu__logo mainmenu__logo--fallback";
                logo.parentElement.insertBefore(fallback, logo);
            }
            fallback.textContent = model.title || "TEXTGAME";
        }

        // Пункты меню
        nav.replaceChildren();

        const items = [
            {
                key: "new",
                label: "Новая игра",
                disabled: false,
                onClick: () => handlers.onNew && handlers.onNew()
            },
            {
                key: "load",
                label: "Загрузить сохранение",
                disabled: !model.hasSave,
                onClick: () => handlers.onLoad && handlers.onLoad()
            },
            {
                key: "loadFile",
                label: "Загрузить из файла",
                disabled: false,
                onClick: () => handlers.onLoadFile && handlers.onLoadFile()
            }
        ];

        items.forEach(item => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "mainmenu__item";
            b.textContent = item.label;
            b.disabled = item.disabled;
            if (item.disabled) b.dataset.disabled = "1";
            b.addEventListener("click", () => {
                if (b.disabled) return;
                item.onClick();
            });
            nav.appendChild(b);
        });

        // Сообщение
        msg.textContent = model.message || "";
    }

    /* ---------- показать / скрыть ---------- */

    function showMainMenu(model) {
        if (!root) root = build();
        renderMainMenu(model || {});
        root.hidden = false;

        // Не даём прокручивать игру под меню.
        document.body.classList.add("mainmenu-open");

        // Фокус на первый активный пункт — для клавиатуры.
        const first = root.querySelector(".mainmenu__item:not([disabled])");
        if (first) first.focus({ preventScroll: true });
    }

    function hideMainMenu() {
        if (!root) return;
        root.hidden = true;
        document.body.classList.remove("mainmenu-open");
    }

    /* ---------- регистрация колбэков ---------- */

    function setMainMenuHandlers(opts) {
        Object.assign(handlers, opts || {});
    }

    Object.assign(UI, {
        renderMainMenu,
        showMainMenu,
        hideMainMenu,
        setMainMenuHandlers
    });
})();