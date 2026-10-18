/*
  Слой правил. Чистые функции без побочных эффектов и без DOM.
  Ничего не знают про UI. Принимают state аргументом, возвращают новый state.

  Публичный API:
    Rules.deepClone(value)
    Rules.hasItem(state, id)
    Rules.isAdjacent(gameData, from, to)
    Rules.formatTime(minutes)
    Rules.isLocationOpen(gameData, id, minutes, dayNumber)
    Rules.describeHours(hours)
    Rules.getTimeOfDay(minutes)
    Rules.describeTimeOfDay(timeOfDay)
    Rules.checkCondition(condition, state, gameData)
    Rules.describeConditionFailure(condition, state, gameData)
    Rules.applyNeeds(state, minutes, gameData)   -> { state, messages }
    Rules.applyEffect(effect, state, gameData)   -> { state, messages }
    Rules.applyEffects(effects, state, gameData) -> { state, messages }
    Rules.classifyEffect(effect)                 -> "move" | "item" | "money" | "time" | "state"
    Rules.classifyAction(action)                 -> категория действия
    Rules.pickVariant(variants, state, gameData, actionId) -> { variant, index } | null

  Сообщения в messages — массив объектов { kind: "move" | "info", text }.

  Конец игры: если health <= 0, state.gameOver = true. При gameOver
  checkCondition возвращает false — все действия недоступны.
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

  function isLocationOpen(gameData, id, minutes, dayNumber) {
    const loc = (gameData.locations || {})[id];
    if (!loc) return false;

    // День недели: 0 = понедельник, ..., 6 = воскресенье.
    if (Array.isArray(loc.closedWeekdays) && dayNumber != null) {
      const date = formatDate(dayNumber, gameData);
      const idx = (date.weekday && (gameData.weekdays || []).indexOf(date.weekday)) ?? -1;
      if (loc.closedWeekdays.includes(idx)) return false;
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
      default:
        warn(`неизвестный тип эффекта "${effect.type}"`, effect);
        return false;
    }
  }

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
        const idx = (gameData.weekdays || []).indexOf(date.weekday);
        if (loc.closedWeekdays.includes(idx)) {
          return "Сегодня закрыто";
        }
      }
      if (loc && loc.hours) return `Откроется в ${formatTime(loc.hours.from)}`;
      return "Сейчас закрыто";
    }
    if (condition.item) {
      const item = (gameData.items || {})[condition.item];
      const name = item ? item.name : condition.item;
      return `Нужен предмет: ${name}`;
    }
    if (condition.variableAtLeast) {
      const { name, value } = condition.variableAtLeast;
      const suffix =
        name === "money" ? " ₽" :
          name === "stamina" ? " выносливости" :
            name === "health" ? " здоровья" :
              name === "hunger" ? " голода" :
                name === "thirst" ? " жажды" :
                  name === "fatigue" ? " усталости" : "";
      return `Нужно ${value}${suffix}`;
    }
    if (condition.variableDiffers) return "Уже сделано сегодня";
    if (condition.flag && condition.equals === false) return "Уже сделано";
    return null;
  }

  /* ---------- потребности ---------- */

  function applyNeeds(state, minutes, gameData) {
    const next = deepClone(state);
    const messages = [];

    const needsMax = Number(gameData.needsMax ?? 100);
    const healthMax = Number(gameData.healthMax ?? 100);
    const rates = gameData.needsRates || {};
    const damagePerHour = Number(gameData.damagePerHour ?? 10);
    const delta = Number(minutes) || 0;

    const isSleeping = !!next.sleeping;
    const hungerMultiplier = isSleeping ? 0.5 : 1;
    const damageMultiplier = isSleeping ? 0.5 : 1;
    const fatigueDamages = !isSleeping;

    let damage = 0;

    ["hunger", "thirst", "fatigue"].forEach(key => {
      if (isSleeping && key === "fatigue") {
        // Во сне усталость не растёт и не наносит урон.
        next.variables[key] = Math.min(needsMax, Math.max(0, Number(next.variables[key]) || 0));
        return;
      }

      const rate = (Number(rates[key]) || 0) * (key === "hunger" ? hungerMultiplier : 1);
      const current = Number(next.variables[key]) || 0;

      let minutesAtMax = 0;
      let grown;
      if (current >= needsMax) {
        minutesAtMax = delta;
        grown = needsMax;
      } else if (rate > 0) {
        const minutesToMax = (needsMax - current) / rate;
        if (minutesToMax >= delta) {
          grown = current + rate * delta;
        } else {
          grown = needsMax;
          minutesAtMax = delta - minutesToMax;
        }
      } else {
        grown = current;
      }

      next.variables[key] = Math.min(needsMax, Math.max(0, grown));

      if (key === "fatigue" && !fatigueDamages) return;
      damage += (Math.max(0, minutesAtMax) / 60) * damagePerHour;
    });

    damage *= damageMultiplier;

    const totalDamage = damage > 0 ? Math.max(1, Math.floor(damage)) : 0;

    if (totalDamage > 0) {
      const hp = Number(next.variables.health) || 0;
      const nextHp = Math.max(0, Math.min(healthMax, hp - totalDamage));
      next.variables.health = nextHp;
      messages.push({ kind: "info", text: `Здоровье -${totalDamage}.` });

      if (nextHp <= 0 && !next.gameOver) {
        next.gameOver = true;
        messages.push({ kind: "info", text: "Ты теряешь сознание. Игра окончена." });
      }
    }

    return { state: next, messages };
  }

  /* ---------- эффекты ---------- */

  function applyEffect(effect, state, gameData) {
    const next = deepClone(state);
    const messages = [];

    if (!effect || typeof effect !== "object") {
      warn(`эффект не является объектом`, effect);
      return { state: next, messages };
    }
    if (!validateEffectShape(effect)) {
      return { state: next, messages };
    }

    switch (effect.type) {
      case "move": {
        const target = (gameData.locations || {})[effect.to];
        const from = (gameData.locations || {})[next.location];
        if (!target) {
          warn(`move → неизвестная локация "${effect.to}"`, effect);
          break;
        }
        const fromName = from ? from.name : "?";
        next.location = effect.to;
        messages.push({ kind: "move", text: `Переход: ${fromName} -> ${target.name}` });
        break;
      }

      case "giveItem": {
        const item = (gameData.items || {})[effect.item];
        if (!item) {
          warn(`giveItem → неизвестный предмет "${effect.item}"`, effect);
          break;
        }
        if (!next.inventory.includes(effect.item)) {
          next.inventory.push(effect.item);
          messages.push({ kind: "info", text: `Получен предмет: ${item.name}.` });
        }
        break;
      }

      case "removeItem": {
        next.inventory = next.inventory.filter(id => id !== effect.item);
        break;
      }

      case "setFlag": {
        next.flags[effect.flag] = effect.value;
        break;
      }

      case "changeVariable": {
        const before = Number(next.variables[effect.name] || 0);
        const after = before + effect.amount;
        next.variables[effect.name] = after;

        if (effect.name === "money") {
          const diff = after - before;
          if (diff > 0) {
            messages.push({ kind: "info", text: `Получено: ${diff} ₽` });
          } else if (diff < 0) {
            messages.push({ kind: "info", text: `Потрачено: ${-diff} ₽` });
          }
        }

        if (effect.name === "health" && after <= 0 && !next.gameOver) {
          next.gameOver = true;
          messages.push({ kind: "info", text: "Ты теряешь сознание. Игра окончена." });
        }
        break;
      }

      case "setVariable": {
        next.variables[effect.name] = effect.value;
        if (effect.name === "health" && Number(effect.value) <= 0 && !next.gameOver) {
          next.gameOver = true;
          messages.push({ kind: "info", text: "Ты теряешь сознание. Игра окончена." });
        }
        break;
      }

      case "setVariableFromVariable": {
        next.variables[effect.name] = next.variables[effect.from];
        break;
      }

      case "advanceTime": {
        const before = next.variables.minutes;
        const total = before + effect.minutes;
        const daysPassed = Math.floor(total / 1440);
        next.variables.minutes = ((total % 1440) + 1440) % 1440;
        if (daysPassed > 0) {
          next.variables.day += daysPassed;
          if (daysPassed === 1) {
            messages.push({ kind: "info", text: "Наступает новый день." });
          } else {
            messages.push({ kind: "info", text: `Проходит ${daysPassed} дн.` });
          }
        }

        const needsResult = applyNeeds(next, effect.minutes, gameData);
        next.variables = needsResult.state.variables;
        if (needsResult.state.gameOver) next.gameOver = true;
        messages.push(...needsResult.messages);
        break;
      }
    }

    return { state: next, messages };
  }

  function applyEffects(effects, state, gameData) {
    let current = state;
    const messages = [];
    for (const effect of effects || []) {
      const result = applyEffect(effect, current, gameData);
      current = result.state;
      messages.push(...result.messages);
    }
    return { state: current, messages };
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
        return effect.name === "money" ? "money" : "state";
      case "setVariable":
      case "setVariableFromVariable":
      case "setFlag":
      default:
        return "state";
    }
  }

  function classifyAction(action) {
    const effects = (action && action.effects) || [];
    if (!effects.length) return "state";
    const kinds = new Set(effects.map(classifyEffect));
    if (kinds.size === 1) return kinds.values().next().value;
    return "mixed";
  }

  /* ---------- выбор варианта ---------- */

  function pickVariant(variants, state, gameData, actionId) {
    if (!Array.isArray(variants) || !variants.length) return null;

    const eligible = [];
    variants.forEach((v, i) => {
      if (!v.condition || checkCondition(v.condition, state, gameData)) {
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

  function formatDate(dayNumber, gameData) {
    const start = gameData.startDate || { year: 2026, month: 9, day: 1 };
    const weekdays = gameData.weekdays || ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    // Разница в днях от начала игры. dayNumber = 1 — первый день.
    const offset = Math.max(0, Number(dayNumber) - 1);

    // Считаем дату через Date — надёжно и с корректными переходами между месяцами.
    const base = new Date(start.year, start.month - 1, start.day);
    base.setDate(base.getDate() + offset);

    const y = base.getFullYear();
    const m = base.getMonth() + 1;
    const d = base.getDate();

    // День недели: 0 = воскресенье, 1 = понедельник. Приводим к нашему массиву.
    const wdIndex = (base.getDay() + 6) % 7;
    const weekday = weekdays[wdIndex];

    return {
      day: d,
      month: m,
      year: y,
      weekday,
      text: `${weekday}, ${d} ${monthName(m)} ${y}`
    };
  }

  function monthName(m) {
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    return months[m - 1] || "";
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
    checkCondition,
    describeConditionFailure,
    applyNeeds,
    applyEffect,
    applyEffects,
    classifyEffect,
    classifyAction,
    pickVariant
  };
})();