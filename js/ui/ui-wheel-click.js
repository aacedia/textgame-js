/*
  UI — прокрутка колесом как «левый клик» над кнопками.
  Работает только для явно размеченных контейнеров (см. data-wheel-click),
  чтобы не ломать прокрутку там, где она нужна.

  Разметка:
    <div class="actions" id="actions" data-wheel-click>
      <button ...>...</button>
      ...
    </div>

  Правила:
    - один клик на один жест колеса, пауза 300 мс;
    - не срабатывает при Ctrl/Shift/Alt/Meta (это зум/горизонтальный скролл);
    - игнорирует :disabled и aria-disabled="true";
    - не мешает прокрутке, если у контейнера есть собственный overflow
      и контент реально прокручивается.
*/
(() => {
    "use strict";

    const UI = window.UI;
    if (!UI) { console.error("ui-wheel-click.js: window.UI не найден."); return; }

    const COOLDOWN_MS = 300;

    const lastFire = new WeakMap(); // element -> timestamp

    function isInteractiveTarget(el, container) {
        // Ищем ближайшую кнопку/ссылку/кликабельный элемент под курсором,
        // но не выше самого контейнера.
        const candidate = el.closest("button, a, [role='button'], .tab, .inv-filter, .quest, .item");
        if (!candidate) return null;
        if (!container.contains(candidate)) return null;
        return candidate;
    }

    function hasOwnScrollable(el) {
        // true, если у элемента реально есть свой скролл и он не «влезает» целиком.
        if (!el || el === document.documentElement) return false;
        const style = window.getComputedStyle(el);
        const oy = style.overflowY;
        if (oy !== "auto" && oy !== "scroll" && oy !== "overlay") return false;
        return el.scrollHeight > el.clientHeight + 1;
    }

    function fire(target) {
        const now = performance.now();
        const prev = lastFire.get(target) || 0;
        if (now - prev < COOLDOWN_MS) return;
        lastFire.set(target, now);

        if (target.matches(":disabled") || target.getAttribute("aria-disabled") === "true") {
            return;
        }
        // Для <a> и [role='button'] без .click() — вызываем click(); браузер
        // корректно отработает и нативный обработчик.
        target.click();
    }

    function onWheel(e) {
        // Не перехватываем модификаторы — это не «левый клик», а зум/горизонталь.
        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

        // Только «вертикальное» колесо или трекпад с явным dx.
        const container = e.currentTarget;
        if (!container) return;

        // Если у контейнера есть свой скролл и он не прокручен до края —
        // пользователь, скорее всего, хочет скроллить, а не кликать.
        if (hasOwnScrollable(container)) {
            const atTop = container.scrollTop <= 0;
            const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
            const goingUp = e.deltaY < 0;
            const goingDown = e.deltaY > 0;
            if ((goingUp && !atTop) || (goingDown && !atBottom)) {
                return; // пусть скроллит
            }
        }

        // Аналогично, если под курсором вложенный прокручиваемый элемент.
        const path = e.composedPath ? e.composedPath() : [];
        for (const node of path) {
            if (node === container) break;
            if (node instanceof Element && hasOwnScrollable(node)) return;
        }

        const target = isInteractiveTarget(e.target, container);
        if (!target) return;

        // Один жест = один клик. Если пользователь крутит дальше в пределах
        // COOLDOWN_MS, fire() сам отбросит повтор.
        e.preventDefault(); // останавливаем «инерционный» скролл страницы
        fire(target);
    }

    function initWheelClick(root) {
        const scope = root || document;
        scope.querySelectorAll("[data-wheel-click]").forEach(container => {
            if (container.dataset.wheelClickBound === "1") return;
            container.dataset.wheelClickBound = "1";
            container.addEventListener("wheel", onWheel, { passive: false });
        });
    }

    // Инициализация после DOMContentLoaded.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => initWheelClick());
    } else {
        initWheelClick();
    }

    Object.assign(UI, { initWheelClick });
})();