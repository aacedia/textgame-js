# textgame-js

Текстовая игра на HTML5 + JavaScript в духе QSP. Запуск — открыть `index.html` в браузере, сборки нет.

[Live Demo](https://aacedia.github.io/textgame-js/)

## Устройство

Слои снизу вверх:

    data → rules → save → game → ui

- **data** — контент: локации, предметы, NPC, диалоги, стартовое состояние. `window.GAME_DATA`.
- **rules** — чистые функции: условия, эффекты, время. `window.Rules`.
- **save** — обёртка над localStorage. `window.Save`.
- **game** — состояние, view-модель, диспетчеры. `window.Game`.
- **ui** — рендер и DOM. `window.UI`.

Модули регистрируют методы через `Object.assign(window.X, {...})`. Порядок подключения в `index.html` важен:

    data → rules → save → ui-* → game-*

UI не читает `state` и не знает про правила. Логика не трогает DOM. Встречаются они только в `game-viewmodel.js`.

## Что где лежит

- **Контент** — `js/data/`. Локации в `js/data/locations/`, диалоги в `js/data/dialogues/`, предметы в `items.js`, NPC в `character.js`, стартовое состояние и константы в `data.js`.
- **Новое правило** — `js/rules/`.
- **Новый элемент UI** — отдельный `ui-*.js`, регистрация в `window.UI`, подключение до `ui.js`.
- **Новая игровая логика** — отдельный `game-*.js`, регистрация в `window.Game`, подключение до `game.js`.

Валидация данных запускается при старте (`js/data/data-validation.js`) и пишет предупреждения в консоль.

## Читы

Вводятся в диалоге «Чит-код» (кнопка в панели «Управление»).

- `player.additem F <amount>` — добавить деньги.
- `player.additem <itemId> <amount>` — добавить предметы.
- `time.add <минуты>` — сдвинуть время (потребности не меняются).
- `relation.set <npcId> <value>` — установить отношение с NPC (0–100).