/*
  UI — адаптивные шторки (drawer) для мобильного режима.
  Открытие/закрытие боковых панелей кнопками-бургерами и свайпом от края.

  Работает только при ширине <= 1000px (см. styles-responsive.css).
  Регистрирует в window.UI: initDrawer, initDrawers, initDrawerSwipe.
  Подключается после ui-core.js.
*/
(() => {
    "use strict";

    const UI = window.UI;
    if (!UI) { console.error("ui-drawer.js: window.UI не найден. Подключите ui-core.js раньше."); return; }

    const MOBILE_QUERY = "(max-width: 1000px)";
    const EDGE = 24;          // ширина «краевой» зоны для свайпа, px
    const THRESHOLD = 0.35;   // доля ширины шторки, после которой она «доводится»
    const VELOCITY = 0.4;     // px/ms — порог скорости для «доводки»

    const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;

    function getLayout() { return document.querySelector(".layout"); }
    function getSide() { return document.querySelector(".side"); }
    function getSideRight() { return document.querySelector(".side-right"); }

    function closeAll() {
        const layout = getLayout();
        if (!layout) return;
        layout.classList.remove("side-open", "side-right-open");
    }

    /* ---------- Кнопки-бургеры ---------- */

    function initDrawerButtons() {
        const layout = getLayout();
        const btnSide = document.getElementById("toggle-side");
        const btnRight = document.getElementById("toggle-side-right");
        if (!layout || !btnSide || !btnRight) return;

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

    /* ---------- Свайп от края ---------- */

    function initDrawerSwipe() {
        const layout = getLayout();
        const side = getSide();
        const sideRight = getSideRight();
        if (!layout || !side || !sideRight) return;

        let active = null; // { side: "left"|"right", startX, startTime, el, width, mode }

        function drawerWidth(el) {
            return el.getBoundingClientRect().width || 0;
        }

        function onPointerDown(e) {
            if (!isMobile()) return;
            if (e.pointerType === "mouse" && e.button !== 0) return;

            const w = window.innerWidth;
            const x = e.clientX;

            // Левый край и левая шторка закрыта → начинаем открывать
            if (x <= EDGE && !layout.classList.contains("side-open")) {
                active = { side: "left", startX: x, startTime: performance.now(), el: side, width: drawerWidth(side), mode: "open" };
            }
            // Правый край и правая шторка закрыта → начинаем открывать
            else if (x >= w - EDGE && !layout.classList.contains("side-right-open")) {
                active = { side: "right", startX: x, startTime: performance.now(), el: sideRight, width: drawerWidth(sideRight), mode: "open" };
            }
            // Потянули по открытой шторке в сторону закрытия
            else if (layout.classList.contains("side-open") && x <= drawerWidth(side)) {
                active = { side: "left", startX: x, startTime: performance.now(), el: side, width: drawerWidth(side), mode: "close" };
            }
            else if (layout.classList.contains("side-right-open") && x >= w - drawerWidth(sideRight)) {
                active = { side: "right", startX: x, startTime: performance.now(), el: sideRight, width: drawerWidth(sideRight), mode: "close" };
            }

            if (active) {
                active.el.style.transition = "none";
                active.el.setPointerCapture?.(e.pointerId);
            }
        }

        function onPointerMove(e) {
            if (!active) return;
            const dx = e.clientX - active.startX;

            let offset; // translateX для шторки
            if (active.side === "left") {
                offset = active.mode === "open"
                    ? Math.min(0, -active.width + Math.max(0, dx))
                    : Math.min(0, -Math.max(0, -dx));
            } else {
                offset = active.mode === "open"
                    ? Math.max(0, active.width - Math.max(0, -dx))
                    : Math.max(0, Math.max(0, dx));
            }

            // Затемнение пропорционально прогрессу
            const progress = 1 - Math.abs(offset) / active.width;
            layout.classList.add(active.side === "left" ? "side-swipe-left" : "side-swipe-right");
            layout.style.setProperty("--swipe-progress", String(Math.max(0, Math.min(1, progress))));

            active.el.style.transform = `translateX(${offset}px)`;
        }

        function onPointerUp(e) {
            if (!active) return;
            const dx = e.clientX - active.startX;
            const dt = Math.max(1, performance.now() - active.startTime);
            const velocity = dx / dt;
            const moved = Math.abs(dx);
            const enough = moved > active.width * THRESHOLD || Math.abs(velocity) > VELOCITY;

            const el = active.el;
            const sideName = active.side;

            el.style.transition = "";
            el.style.transform = "";
            layout.classList.remove("side-swipe-left", "side-swipe-right");
            layout.style.removeProperty("--swipe-progress");

            if (active.mode === "open") {
                if (enough) {
                    layout.classList.add(sideName === "left" ? "side-open" : "side-right-open");
                    layout.classList.remove(sideName === "left" ? "side-right-open" : "side-open");
                }
            } else {
                if (enough) {
                    layout.classList.remove(sideName === "left" ? "side-open" : "side-right-open");
                }
            }

            active = null;
        }

        window.addEventListener("pointerdown", onPointerDown, { passive: true });
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerup", onPointerUp, { passive: true });
        window.addEventListener("pointercancel", onPointerUp, { passive: true });
    }

    /* ---------- Инициализация ---------- */

    function initDrawers() {
        initDrawerButtons();
        initDrawerSwipe();
    }

    function initDrawer() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initDrawers);
        } else {
            initDrawers();
        }
    }

    Object.assign(UI, { initDrawer, initDrawers, initDrawerSwipe });
})();