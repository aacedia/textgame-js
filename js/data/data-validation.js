/*
  Валидация data.js. Проверяет ссылки и связи между данными:
    - links и move.to ссылаются на существующие локации;
    - giveItem.item и removeItem.item — на существующие предметы;
    - condition.item — на существующий предмет (для простых условий);
    - id действий уникальны в пределах локации;
    - hours корректны;
    - initialState ссылается на существующие сущности.

  Модуль не падает при ошибках. Он возвращает { ok, errors } и пишет
  предупреждения в консоль. Игра продолжает работу.

  Публичный API:
    DataValidation.validate(gameData) -> { ok, errors }

  Должен подключаться после data.js. Вызывается из game.js при старте.
*/
window.DataValidation = (() => {
    "use strict";

    /* ---------- утилита ---------- */

    function pushError(errors, path, message) {
        errors.push({ path, message });
    }

    /* ---------- проверки локаций ---------- */

    function validateLocations(gameData, errors) {
        const locations = gameData.locations || {};
        const links = gameData.links || {};

        // Все локации, упомянутые в links, должны существовать.
        Object.keys(links).forEach(from => {
            if (!locations[from]) {
                pushError(errors, `links.${from}`, `links ссылается на несуществующую локацию "${from}"`);
            }
        });

        // Каждая локация из locations должна иметь корректные links и actions.
        Object.entries(locations).forEach(([id, loc]) => {
            // links: массив строк, все локации существуют.
            const targets = links[id];
            if (targets !== undefined) {
                if (!Array.isArray(targets)) {
                    pushError(errors, `links.${id}`, `links.${id} должен быть массивом`);
                } else {
                    targets.forEach(to => {
                        if (!locations[to]) {
                            pushError(errors, `links.${id}`, `"${id}" ссылается на несуществующую локацию "${to}"`);
                        }
                    });
                }
            }

            // hours: from и to в диапазоне [0, 1440).
            if (loc.hours) {
                const { from, to } = loc.hours;
                if (!isValidMinute(from)) {
                    pushError(errors, `locations.${id}.hours.from`, `некорректное значение from="${from}"`);
                }
                if (!isValidMinute(to)) {
                    pushError(errors, `locations.${id}.hours.to`, `некорректное значение to="${to}"`);
                }
            }

            // actions: массив (если есть).
            if (loc.actions !== undefined && !Array.isArray(loc.actions)) {
                pushError(errors, `locations.${id}.actions`, `actions должен быть массивом`);
                return;
            }

            // Действия.
            validateActions(id, loc.actions || [], gameData, errors);
        });
    }

    function isValidMinute(value) {
        return typeof value === "number"
            && Number.isFinite(value)
            && value >= 0
            && value < 1440;
    }

    /* ---------- проверки действий ---------- */

    function validateActions(locationId, actions, gameData, errors) {
        const seen = new Set();
        actions.forEach((action, index) => {
            const where = `locations.${locationId}.actions[${index}]`;

            // id обязателен и уникален в пределах локации.
            if (!action.id) {
                pushError(errors, where, `действие без поля "id"`);
            } else if (seen.has(action.id)) {
                pushError(errors, where, `дубликат id "${action.id}" в локации "${locationId}"`);
            } else {
                seen.add(action.id);
            }

            // effects: массив (если есть).
            if (action.effects !== undefined && !Array.isArray(action.effects)) {
                pushError(errors, where, `effects должен быть массивом`);
                return;
            }

            // Проверяем ссылки в эффектах.
            (action.effects || []).forEach((effect, effIndex) => {
                validateEffectRefs(
                    `${where}.effects[${effIndex}]`,
                    effect,
                    gameData,
                    errors
                );
            });

            // Проверяем простые ссылки в condition.
            if (action.condition) {
                validateConditionRefs(`${where}.condition`, action.condition, gameData, errors);
            }
        });
    }

    function validateEffectRefs(path, effect, gameData, errors) {
        if (!effect || typeof effect !== "object") return;

        if (effect.type === "move") {
            if (effect.to && !gameData.locations[effect.to]) {
                pushError(errors, path, `move → несуществующая локация "${effect.to}"`);
            }
        }

        if (effect.type === "giveItem" || effect.type === "removeItem") {
            if (effect.item && !gameData.items[effect.item]) {
                pushError(errors, path, `${effect.type} → несуществующий предмет "${effect.item}"`);
            }
        }
    }

    function validateConditionRefs(path, condition, gameData, errors) {
        if (!condition || typeof condition !== "object") return;

        if (Array.isArray(condition.all)) {
            condition.all.forEach((c, i) =>
                validateConditionRefs(`${path}.all[${i}]`, c, gameData, errors));
        }
        if (Array.isArray(condition.any)) {
            condition.any.forEach((c, i) =>
                validateConditionRefs(`${path}.any[${i}]`, c, gameData, errors));
        }
        if (condition.not) {
            validateConditionRefs(`${path}.not`, condition.not, gameData, errors);
        }
        if (condition.item && !gameData.items[condition.item]) {
            pushError(errors, path, `condition.item → несуществующий предмет "${condition.item}"`);
        }
        if (condition.locationOpen && !gameData.locations[condition.locationOpen]) {
            pushError(errors, path, `condition.locationOpen → несуществующая локация "${condition.locationOpen}"`);
        }
    }

    /* ---------- проверки персонажа ---------- */

    function validateCharacter(gameData, errors) {
        const ch = gameData.character;
        if (!ch || typeof ch !== "object") {
            pushError(errors, "character", "секция character отсутствует или не объект");
            return;
        }
        if (ch.avatar !== undefined && typeof ch.avatar !== "string") {
            pushError(errors, "character.avatar", "avatar должен быть строкой");
        }
    }

    /* ---------- проверки initialState ---------- */

    function validateInitialState(gameData, errors) {
        const s = gameData.initialState;
        if (!s || typeof s !== "object") {
            pushError(errors, "initialState", "секция initialState отсутствует или не объект");
            return;
        }
        if (!gameData.locations[s.location]) {
            pushError(errors, "initialState.location", `несуществующая локация "${s.location}"`);
        }
        if (!Array.isArray(s.inventory)) {
            pushError(errors, "initialState.inventory", "inventory должен быть массивом");
        } else {
            s.inventory.forEach(id => {
                if (!gameData.items[id]) {
                    pushError(errors, "initialState.inventory", `несуществующий предмет "${id}"`);
                }
            });
        }
    }

    /* ---------- проверки стартовой локации и links ---------- */

    function validateStart(gameData, errors) {
        if (gameData.start && !gameData.locations[gameData.start]) {
            pushError(errors, "start", `стартовая локация "${gameData.start}" не существует`);
        }
    }

    /* ---------- главная функция ---------- */

    function validate(gameData) {
        const errors = [];

        if (!gameData || typeof gameData !== "object") {
            pushError(errors, "", "GAME_DATA отсутствует или не объект");
            return { ok: false, errors };
        }

        validateLocations(gameData, errors);
        validateCharacter(gameData, errors);
        validateInitialState(gameData, errors);
        validateStart(gameData, errors);

        return { ok: errors.length === 0, errors };
    }

    return { validate };
})();