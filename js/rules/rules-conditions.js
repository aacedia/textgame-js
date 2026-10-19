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
            if (inner.item) {
                const item = (gameData.items || {})[inner.item];
                return `Уже есть: ${item ? item.name : inner.item}`;
            }
            if (inner.flag) return "Уже сделано";
            if (inner.variableAtLeast) return "Уже достигнуто";
            if (inner.variableEquals) return "Уже так";
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
            const suffix =
                name === "money" ? " ¥" :
                    name === "stamina" ? " выносливости" :
                        name === "health" ? " здоровья" :
                            name === "hunger" ? " голода" :
                                name === "thirst" ? " жажды" :
                                    name === "fatigue" ? " усталости" :
                                        name === "foodPortions" ? " порций еды" : "";
            return `Нужно ${value}${suffix}`;
        }
        if (condition.variableDiffers) return "Уже сделано сегодня";
        if (condition.flag && condition.equals === false) return "Уже сделано";
        return null;
    }

    Object.assign(window.Rules, {
        checkCondition,
        describeConditionFailure
    });
})();