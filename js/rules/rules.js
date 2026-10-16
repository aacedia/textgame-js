/*
  Слой правил. Чистые функции без побочных эффектов и без DOM.
*/
window.Rules = (() => {
  "use strict";

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function hasItem(state, id) {
    return state.inventory.includes(id);
  }

  function isAdjacent(gameData, from, to) {
    return (gameData.links[from] || []).includes(to);
  }

  function formatTime(minutes) {
    const total = Number(minutes) || 0;
    const h = Math.floor(total / 60) % 24;
    const m = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  function isLocationOpen(gameData, id, minutes) {
    const loc = gameData.locations[id];
    if (!loc || !loc.hours) return true;
    const { from, to } = loc.hours;
    const t = ((Number(minutes) || 0) % 1440 + 1440) % 1440;
    if (from <= to) return t >= from && t < to;
    return t >= from || t < to;
  }

  function describeHours(hours) {
    if (!hours) return "круглосуточно";
    return `${formatTime(hours.from)}–${formatTime(hours.to)}`;
  }

  /* ---------- условия ---------- */

  function checkCondition(condition, state, gameData) {
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
      return isLocationOpen(gameData, condition.locationOpen, state.variables.minutes);
    }
    return false;
  }

  function describeConditionFailure(condition, state, gameData) {
    if (!condition) return null;
    if (checkCondition(condition, state, gameData)) return null;

    if (condition.locationOpen) {
      const loc = gameData.locations[condition.locationOpen];
      if (loc && loc.hours) {
        return `Откроется в ${formatTime(loc.hours.from)}`;
      }
      return "Сейчас закрыто";
    }
    if (condition.item) {
      return "Нужен подходящий предмет";
    }
    if (condition.variableAtLeast) {
      const suffix = condition.variableAtLeast.name === "money" ? " ₽" : "";
      return `Нужно ${condition.variableAtLeast.value}${suffix}`;
    }
    if (condition.variableDiffers) {
      return "Уже сделано сегодня";
    }
    if (condition.flag && condition.equals === false) {
      return "Уже сделано";
    }
    return null;
  }

  /* ---------- эффекты ---------- */

  function applyEffect(effect, state, gameData) {
    const next = deepClone(state);
    const messages = [];

    switch (effect.type) {
      case "move": {
        const target = gameData.locations[effect.to];
        if (target) {
          next.location = effect.to;
          messages.push(`Ты переходишь: ${target.name}.`);
        }
        break;
      }
      case "giveItem": {
        const item = gameData.items[effect.item];
        if (item && !next.inventory.includes(effect.item)) {
          next.inventory.push(effect.item);
          messages.push(`Получен предмет: ${item.name}.`);
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
        next.variables[effect.name] =
          Number(next.variables[effect.name] || 0) + effect.amount;
        break;
      }
      case "setVariable": {
        next.variables[effect.name] = effect.value;
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
            messages.push("Наступает новый день.");
          } else {
            messages.push(`Проходит ${daysPassed} дн.`);
          }
        }
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

  return {
    deepClone,
    hasItem,
    isAdjacent,
    formatTime,
    isLocationOpen,
    describeHours,
    checkCondition,
    describeConditionFailure,
    applyEffect,
    applyEffects
  };
})();