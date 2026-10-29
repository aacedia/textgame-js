/*
  Слой правил — каркас. Чистые функции без побочных эффектов и без DOM.
  Публикует window.Rules с утилитами, валидацией, классификацией, pickVariant.
  Условия и эффекты подключаются отдельными файлами (rules-conditions.js,
  rules-effects.js) и дописываются в тот же объект.

  Публичный API:
    Rules.deepClone(value)
    Rules.hasItem(state, id)
    Rules.isAdjacent(gameData, from, to)
    Rules.formatTime(minutes)
    Rules.formatDate(dayNumber, gameData)
    Rules.isLocationOpen(gameData, id, minutes, dayNumber)
    Rules.describeHours(hours)
    Rules.getTimeOfDay(minutes)
    Rules.describeTimeOfDay(timeOfDay)
    Rules.warn(message, payload)
    Rules.validateEffectShape(effect)
    Rules.classifyEffect(effect)
    Rules.classifyAction(action)
    Rules.pickVariant(variants, state, gameData, actionId)
*/
window.Rules = (() => {
  "use strict";

  /* ---------- утилиты ---------- */

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function hasItem(state, id) {
    return state.inventory.includes(id);
  }

  function isAdjacent(gameData, from, to) {
    return ((gameData.links || {})[from] || []).includes(to);
  }

  function formatTime(minutes) {
    const total = Number(minutes) || 0;
    const h = Math.floor(total / 60) % 24;
    const m = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  function monthName(m) {
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    return months[m - 1] || "";
  }

  function formatDate(dayNumber, gameData) {
    const start = gameData.startDate || { year: 2026, month: 9, day: 1 };
    const weekdays = gameData.weekdays || ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    const offset = Math.max(0, Number(dayNumber) - 1);
    const base = new Date(start.year, start.month - 1, start.day);
    base.setDate(base.getDate() + offset);

    const y = base.getFullYear();
    const m = base.getMonth() + 1;
    const d = base.getDate();

    const wdIndex = (base.getDay() + 6) % 7;
    const weekday = weekdays[wdIndex];

    return {
      day: d,
      month: m,
      year: y,
      weekday,
      weekdayIndex: wdIndex,
      text: `${weekday}, ${d} ${monthName(m)} ${y}`
    };
  }

  function isLocationOpen(gameData, id, minutes, dayNumber) {
    const loc = (gameData.locations || {})[id];
    if (!loc) return false;

    if (Array.isArray(loc.closedWeekdays) && dayNumber != null) {
      const date = formatDate(dayNumber, gameData);
      if (loc.closedWeekdays.includes(date.weekdayIndex)) return false;
    }

    if (!loc.hours) return true;
    const { from, to } = loc.hours;
    const t = ((Number(minutes) || 0) % 1440 + 1440) % 1440;
    if (from <= to) return t >= from && t < to;
    return t >= from || t < to;
  }

  function describeHours(hours) {
    if (!hours) return "круглосуточно";
    return `${formatTime(hours.from)}–${formatTime(hours.to)}`;
  }

  /* ---------- время суток ---------- */

  function getTimeOfDay(minutes) {
    const t = ((Number(minutes) || 0) % 1440 + 1440) % 1440;
    if (t >= 5 * 60 && t < 12 * 60) return "morning";
    if (t >= 12 * 60 && t < 17 * 60) return "day";
    if (t >= 17 * 60 && t < 23 * 60) return "evening";
    return "night";
  }

  function describeTimeOfDay(timeOfDay) {
    switch (timeOfDay) {
      case "morning": return "🌅";
      case "day": return "☀️";
      case "evening": return "🌆";
      case "night":
      default: return "🌙";
    }
  }

  /* ---------- валидация ---------- */

  function warn(message, payload) {
    if (payload !== undefined) {
      console.warn(`Rules: ${message}`, payload);
    } else {
      console.warn(`Rules: ${message}`);
    }
  }

  function validateEffectShape(effect) {
    switch (effect.type) {
      case "move":
        if (typeof effect.to !== "string" || !effect.to) {
          warn(`move без поля "to"`, effect);
          return false;
        }
        return true;
      case "giveItem":
      case "removeItem":
        if (typeof effect.item !== "string" || !effect.item) {
          warn(`${effect.type} без поля "item"`, effect);
          return false;
        }
        return true;
      case "setFlag":
        if (typeof effect.flag !== "string" || !effect.flag) {
          warn(`setFlag без поля "flag"`, effect);
          return false;
        }
        return true;
      case "changeVariable":
        if (typeof effect.name !== "string" || !effect.name) {
          warn(`changeVariable без поля "name"`, effect);
          return false;
        }
        if (typeof effect.amount !== "number" || Number.isNaN(effect.amount)) {
          warn(`changeVariable без числового "amount"`, effect);
          return false;
        }
        return true;
      case "setVariable":
        if (typeof effect.name !== "string" || !effect.name) {
          warn(`setVariable без поля "name"`, effect);
          return false;
        }
        return true;
      case "setVariableFromVariable":
        if (typeof effect.name !== "string" || !effect.name) {
          warn(`setVariableFromVariable без поля "name"`, effect);
          return false;
        }
        if (typeof effect.from !== "string" || !effect.from) {
          warn(`setVariableFromVariable без поля "from"`, effect);
          return false;
        }
        return true;
      case "advanceTime":
        if (typeof effect.minutes !== "number" || Number.isNaN(effect.minutes)) {
          warn(`advanceTime без числового "minutes"`, effect);
          return false;
        }
        return true;
      case "addRandomMoney":
        if (typeof effect.min !== "number" || Number.isNaN(effect.min)) {
          warn(`addRandomMoney без числового "min"`, effect);
          return false;
        }
        if (typeof effect.max !== "number" || Number.isNaN(effect.max)) {
          warn(`addRandomMoney без числового "max"`, effect);
          return false;
        }
        return true;
      case "gradeClass":
        return true;
      default:
        warn(`неизвестный тип эффекта "${effect.type}"`, effect);
        return false;
    }
  }

  /* ---------- классификация действий ---------- */

  function classifyEffect(effect) {
    if (!effect || typeof effect !== "object") return "state";
    switch (effect.type) {
      case "move": return "move";
      case "giveItem":
      case "removeItem": return "item";
      case "advanceTime": return "time";
      case "changeVariable":
        if (effect.name === "money") {
          return effect.amount < 0 ? "spend" : "money";
        }
        return "state";
      case "setVariable":
      case "setVariableFromVariable":
      case "setFlag":
      default:
        return "state";
    }
  }

  function classifyAction(action) {
    const effects = (action && action.effects) || [];
    const kinds = new Set(effects.map(classifyEffect));

    if (action && action.minutes && action.minutes > 1) {
      kinds.add("time");
    }

    if (!kinds.size) return "state";

    // Приоритеты.
    if (kinds.has("spend")) return "spend";
    if (kinds.has("money")) return "money";
    if (kinds.has("move")) return "move";
    if (kinds.has("time") && !kinds.has("item")) return "time";
    if (kinds.has("item")) return "item";

    if (kinds.size === 1) return kinds.values().next().value;
    return "mixed";
  }

  /* ---------- выбор варианта ---------- */

  /*
    Выбирает случайный вариант из массива с учётом condition и прошлого
    выбора. Учитывает флаг repeatable: если у прошлого варианта он не
    выставлен, вариант исключается из пула, когда есть альтернативы.
  */
  function pickVariant(variants, state, gameData, actionId) {
    if (!Array.isArray(variants) || !variants.length) return null;

    const eligible = [];
    variants.forEach((v, i) => {
      if (!v.condition || Rules.checkCondition(v.condition, state, gameData)) {
        eligible.push(i);
      }
    });
    if (!eligible.length) return null;

    const lastIndex = state.lastVariant && state.lastVariant[actionId];

    let pool = eligible;
    if (lastIndex !== undefined && eligible.length > 1) {
      const lastVariant = variants[lastIndex];
      const isRepeatable = !!(lastVariant && lastVariant.repeatable);
      if (!isRepeatable) {
        const withoutLast = eligible.filter(i => i !== lastIndex);
        if (withoutLast.length) pool = withoutLast;
      }
    }

    const index = pool[Math.floor(Math.random() * pool.length)];
    return { variant: variants[index], index };
  }

  /* ---------- экспорт ---------- */

  return {
    deepClone,
    hasItem,
    isAdjacent,
    formatTime,
    formatDate,
    isLocationOpen,
    describeHours,
    getTimeOfDay,
    describeTimeOfDay,
    warn,
    validateEffectShape,
    classifyEffect,
    classifyAction,
    pickVariant
  };
})();