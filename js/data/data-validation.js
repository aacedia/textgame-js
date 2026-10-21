window.DataValidation = (() => {
    "use strict";

    function pushError(errors, path, message) {
        errors.push({ path, message });
    }

    function isValidMinute(value) {
        return typeof value === "number"
            && Number.isFinite(value)
            && value >= 0
            && value < 1440;
    }

    function validateLocations(gameData, errors) {
        const locations = gameData.locations || {};
        const links = gameData.links || {};

        Object.keys(links).forEach(from => {
            if (!locations[from]) {
                pushError(errors, `links.${from}`, `links ссылается на несуществующую локацию "${from}"`);
            }
        });

        Object.entries(locations).forEach(([id, loc]) => {
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

            if (loc.hours) {
                const { from, to } = loc.hours;
                if (!isValidMinute(from)) {
                    pushError(errors, `locations.${id}.hours.from`, `некорректное значение from="${from}"`);
                }
                if (!isValidMinute(to)) {
                    pushError(errors, `locations.${id}.hours.to`, `некорректное значение to="${to}"`);
                }
            }

            if (loc.defaultExit !== undefined) {
                if (typeof loc.defaultExit !== "string" || !loc.defaultExit) {
                    pushError(errors, `locations.${id}.defaultExit`, `defaultExit должен быть непустой строкой`);
                } else if (!locations[loc.defaultExit]) {
                    pushError(errors, `locations.${id}.defaultExit`, `defaultExit ссылается на несуществующую локацию "${loc.defaultExit}"`);
                }
            }

            if (loc.actions !== undefined && !Array.isArray(loc.actions)) {
                pushError(errors, `locations.${id}.actions`, `actions должен быть массивом`);
                return;
            }

            validateActions(id, loc.actions || [], gameData, errors);
        });
    }

    function validateActions(locationId, actions, gameData, errors) {
        const seen = new Set();
        actions.forEach((action, index) => {
            const where = `locations.${locationId}.actions[${index}]`;

            if (!action.id) {
                pushError(errors, where, `действие без поля "id"`);
            } else if (seen.has(action.id)) {
                pushError(errors, where, `дубликат id "${action.id}" в локации "${locationId}"`);
            } else {
                seen.add(action.id);
            }

            if (action.minutes !== undefined) {
                if (typeof action.minutes !== "number" || Number.isNaN(action.minutes)) {
                    pushError(errors, `${where}.minutes`, `minutes должен быть числом`);
                } else if (action.minutes < 0) {
                    pushError(errors, `${where}.minutes`, `minutes не может быть отрицательным`);
                }
            }

            if (action.effects !== undefined && !Array.isArray(action.effects)) {
                pushError(errors, where, `effects должен быть массивом`);
                return;
            }

            (action.effects || []).forEach((effect, effIndex) => {
                validateEffectRefs(`${where}.effects[${effIndex}]`, effect, gameData, errors);
            });

            if (action.condition) {
                validateConditionRefs(`${where}.condition`, action.condition, gameData, errors);
            }

            if (action.hiddenWhen) {
                validateConditionRefs(`${where}.hiddenWhen`, action.hiddenWhen, gameData, errors);
            }

            if (action.variants !== undefined) {
                if (!Array.isArray(action.variants)) {
                    pushError(errors, where, `variants должен быть массивом`);
                } else {
                    action.variants.forEach((variant, vIndex) => {
                        const vPath = `${where}.variants[${vIndex}]`;
                        if (!variant || typeof variant !== "object") {
                            pushError(errors, vPath, `вариант должен быть объектом`);
                            return;
                        }
                        if (variant.effects !== undefined && !Array.isArray(variant.effects)) {
                            pushError(errors, vPath, `effects варианта должен быть массивом`);
                            return;
                        }
                        (variant.effects || []).forEach((effect, eIndex) => {
                            validateEffectRefs(`${vPath}.effects[${eIndex}]`, effect, gameData, errors);
                        });
                        if (variant.condition) {
                            validateConditionRefs(`${vPath}.condition`, variant.condition, gameData, errors);
                        }
                    });
                }
            }
        });
    }

    function validateEffectRefs(path, effect, gameData, errors) {
        if (!effect || typeof effect !== "object") return;

        if (effect.type === "move") {
            if (effect.to && !(gameData.locations || {})[effect.to]) {
                pushError(errors, path, `move → несуществующая локация "${effect.to}"`);
            }
        }

        if (effect.type === "giveItem" || effect.type === "removeItem") {
            if (effect.item && !(gameData.items || {})[effect.item]) {
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
        if (condition.item && !(gameData.items || {})[condition.item]) {
            pushError(errors, path, `condition.item → несуществующий предмет "${condition.item}"`);
        }
        if (condition.locationOpen && !(gameData.locations || {})[condition.locationOpen]) {
            pushError(errors, path, `condition.locationOpen → несуществующая локация "${condition.locationOpen}"`);
        }
    }

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

    function validateInitialState(gameData, errors) {
        const s = gameData.initialState;
        if (!s || typeof s !== "object") {
            pushError(errors, "initialState", "секция initialState отсутствует или не объект");
            return;
        }
        if (!(gameData.locations || {})[s.location]) {
            pushError(errors, "initialState.location", `несуществующая локация "${s.location}"`);
        }
        if (!Array.isArray(s.inventory)) {
            pushError(errors, "initialState.inventory", "inventory должен быть массивом");
        } else {
            s.inventory.forEach(id => {
                if (!(gameData.items || {})[id]) {
                    pushError(errors, "initialState.inventory", `несуществующий предмет "${id}"`);
                }
            });
        }
    }

    function validateStart(gameData, errors) {
        if (gameData.start && !(gameData.locations || {})[gameData.start]) {
            pushError(errors, "start", `стартовая локация "${gameData.start}" не существует`);
        }
    }

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