/*
  Условия. Регистрирует в window.Rules:
    Rules.checkCondition(condition, state, gameData)
    Rules.describeConditionFailure(condition, state, gameData)

  Подключается после rules.js.
*/
(() => {
    "use strict";

    const Rules = window.Rules;
    if (!Rules) { console.error("rules-conditions.js: window.Rules не найден."); return; }

    const { hasItem, isLocationOpen, formatTime, formatDate, warn } = Rules;

    /* ---------- условия ---------- */

    function checkCondition(condition, state, gameData) {
        if (state && state.gameOver) return false;
        if (!condition) return true;
        if (condition.all) return condition.all.every(c => checkCondition(c, state, gameData));
        if (condition.any) return condition.any.some(c => checkCondition(c, state, gameData));
        if (condition.not) return !checkCondition(condition.not, state, gameData);
        if (condition.item) return hasItem(state, condition.item);
        if (condition.flag) {
            const expected = condition.equals === undefined ? true : condition.equals;
            return state.flags[condition.flag] === expected;
        }
        if (condition.variableAtLeast) {
            const { name, value } = condition.variableAtLeast;
            return Number(state.variables[name] || 0) >= value;
        }
        if (condition.variableEquals) {
            const { name, value } = condition.variableEquals;
            return state.variables[name] === value;
        }
        if (condition.variableDiffers) {
            const { name, other } = condition.variableDiffers;
            return state.variables[name] !== state.variables[other];
        }
        if (condition.locationOpen) {
            return isLocationOpen(gameData, condition.locationOpen, state.variables.minutes, state.variables.day);
        }
        if (condition.timeBetween) {
            const { from, to } = condition.timeBetween;
            const t = ((Number(state.variables.minutes) || 0) % 1440 + 1440) % 1440;
            if (from <= to) return t >= from && t < to;
            return t >= from || t < to;
        }
        if (condition.randomChance !== undefined) {
            const chance = Math.max(0, Math.min(100, Number(condition.randomChance) || 0));
            return Math.random() * 100 < chance;
        }
        warn(`неизвестное условие`, condition);
        return false;
    }

    function describeConditionFailure(condition, state, gameData) {
        if (!condition) return null;
        if (checkCondition(condition, state, gameData)) return null;

        if (condition.reason) return condition.reason;

        if (Array.isArray(condition.all)) {
            for (const c of condition.all) {
                const reason = describeConditionFailure(c, state, gameData);
                if (reason) return reason;
            }
            return "Не все условия выполнены";
        }
        if (Array.isArray(condition.any)) {
            for (const c of condition.any) {
                const reason = describeConditionFailure(c, state, gameData);
                if (reason) return reason;
            }
            return "Ни одно из условий не выполнено";
        }

        if (condition.not) {
            const inner = condition.not;
            // not: { flag } — условие не выполнено, когда флаг УЖЕ стоит.
            if (inner.flag) {
                const expected = inner.equals === undefined ? true : inner.equals;
                if (state.flags[inner.flag] === expected) {
                    if (expected === true) return "Уже сделано";
                    return "Условие уже выполнено";
                }
                return null;
            }
            // not: { item } — предмет уже есть.
            if (inner.item) {
                const item = (gameData.items || {})[inner.item];
                return `Уже есть: ${item ? item.name : inner.item}`;
            }
            // not: { variableAtLeast } — значение уже достигнуто.
            if (inner.variableAtLeast) {
                const { name, value } = inner.variableAtLeast;
                return describeVariableAtLeast(name, value, true);
            }
            // not: { variableEquals } — значение уже равно.
            if (inner.variableEquals) {
                const { name, value } = inner.variableEquals;
                const label = describeVariableName(name);
                return label ? `Уже: ${label} = ${value}` : "Уже так";
            }
            // not: { variableDiffers } — значения совпадают.
            if (inner.variableDiffers) {
                return "Уже сделано сегодня";
            }
            // not: { timeBetween } — сейчас не в этом промежутке.
            if (inner.timeBetween) {
                const { from, to } = inner.timeBetween;
                return `Недоступно с ${formatTime(from)} до ${formatTime(to)}`;
            }
            // not: { locationOpen } — локация закрыта.
            if (inner.locationOpen) {
                return "Сейчас закрыто";
            }
            // not: { not } — двойное отрицание.
            if (inner.not) {
                return describeConditionFailure(inner.not, state, gameData);
            }
            return "Условие уже выполнено";
        }

        if (condition.locationOpen) {
            const loc = (gameData.locations || {})[condition.locationOpen];
            if (loc && Array.isArray(loc.closedWeekdays) && state.variables.day != null) {
                const date = formatDate(state.variables.day, gameData);
                if (loc.closedWeekdays.includes(date.weekdayIndex)) {
                    return "Сегодня закрыто";
                }
            }
            if (loc && loc.hours) return `Откроется в ${formatTime(loc.hours.from)}`;
            return "Сейчас закрыто";
        }
        if (condition.timeBetween) {
            const { from, to } = condition.timeBetween;
            return `Доступно с ${formatTime(from)} до ${formatTime(to)}`;
        }
        if (condition.item) {
            const item = (gameData.items || {})[condition.item];
            const name = item ? item.name : condition.item;
            return `Нужен предмет: ${name}`;
        }
        if (condition.variableAtLeast) {
            const { name, value } = condition.variableAtLeast;
            return describeVariableAtLeast(name, value, false);
        }
        if (condition.variableEquals) {
            const { name, value } = condition.variableEquals;
            const label = describeVariableName(name);
            if (value === null || value === undefined) {
                return label
                    ? `Нужно: ${label} не задано`
                    : "Недоступно";
            }
            return label
                ? `Нужно: ${label} = ${value}`
                : "Недоступно";
        }
        if (condition.variableDiffers) return "Уже сделано сегодня";
        if (condition.flag) {
            const expected = condition.equals === undefined ? true : condition.equals;
            if (expected === false) return "Уже сделано";
            return "Условие не выполнено";
        }
        return null;
    }

    // Человекочитаемое описание требования к переменной (>= value).
    // forNot=true — сообщение в стиле «уже достигнуто».
    function describeVariableAtLeast(name, value, forNot) {
        const suffix =
            name === "money" ? " ¥" :
                name === "stamina" ? " выносливости" :
                    name === "health" ? " здоровья" :
                        name === "hunger" ? " голода" :
                            name === "thirst" ? " жажды" :
                                name === "fatigue" ? " усталости" :
                                    name === "foodPortions" ? " порций еды" :
                                        name === "staminaMax" ? " выносливости (макс.)" :
                                            name === "healthMax" ? " здоровья (макс.)" :
                                                name === "knowledge" ? " знаний" : "";
        const label = describeVariableName(name);
        if (forNot) {
            if (name === "knowledge") {
                return "Полностью подготовлен";
            }
            return label
                ? `Уже достигнуто: ${label} ${value}${suffix}`
                : `Уже достигнуто: ${value}`;
        }
        return label
            ? `Нужно: ${label} ${value}${suffix}`
            : `Нужно ${value}${suffix}`;
    }

    // Человекочитаемое имя переменной для сообщений о недоступности.
    function describeVariableName(name) {
        switch (name) {
            case "money": return "деньги";
            case "stamina": return "выносливость";
            case "staminaMax": return "макс. выносливость";
            case "health": return "здоровье";
            case "healthMax": return "макс. здоровье";
            case "hunger": return "голод";
            case "thirst": return "жажда";
            case "fatigue": return "усталость";
            case "mood": return "настроение";
            case "foodPortions": return "порции еды";
            case "day": return "день";
            case "minutes": return "время";
            case "classesAttended": return "посещённые занятия";
            case "pendingStipend": return "накопленная стипендия";
            default:
                // Служебные переменные (orderType, lastXxxDay и т.п.)
                // не должны всплывать в подсказках.
                return "";
        }
    }

    Object.assign(window.Rules, {
        checkCondition,
        describeConditionFailure
    });
})();