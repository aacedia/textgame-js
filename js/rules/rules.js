/*
  Слой правил. Чистые функции без побочных эффектов и без DOM.
  Ничего не знают про UI. Принимают state аргументом, возвращают новый state.

  Публичный API:
    Rules.deepClone(value)
    Rules.hasItem(state, id)
    Rules.isAdjacent(gameData, from, to)
    Rules.formatTime(minutes)
    Rules.isLocationOpen(gameData, id, minutes)
    Rules.describeHours(hours)
    Rules.checkCondition(condition, state, gameData)
    Rules.describeConditionFailure(condition, state, gameData)
    Rules.applyEffect(effect, state, gameData)   -> { state, messages }
    Rules.applyEffects(effects, state, gameData) -> { state, messages }
    Rules.classifyEffect(effect)                 -> "move" | "item" | "money" | "time" | "state"
    Rules.classifyAction(action)                 -> категория действия (см. ниже)

  Сообщения в messages — массив объектов { kind: "move" | "info", text }.
    "move"  — переход между локациями (для «Истории событий»);
    "info"  — всё остальное (для панели «Информация»).

  Поддерживаемые условия:
    { item: "keys" }
    { flag: "attendedClass", equals: true | false }
    { not: <условие> }
    { all: [<условие>, ...] }
    { any: [<условие>, ...] }
    { variableAtLeast: { name: "money", value: 100 } }
    { variableEquals:  { name: "day",   value: 1   } }
    { variableDiffers: { name: "lastClassDay", other: "day" } }
    { locationOpen: "shop" }

  Поддерживаемые эффекты:
    { type: "move", to: "locationId" }
    { type: "giveItem", item: "itemId" }
    { type: "removeItem", item: "itemId" }
    { type: "setFlag", flag: "name", value: true }
    { type: "changeVariable", name: "money", amount: -100 }
    { type: "setVariable", name: "day", value: 1 }
    { type: "setVariableFromVariable", name: "lastClassDay", from: "day" }
    { type: "advanceTime", minutes: 480 }
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
    return (gameData.links[from] || []).includes(to);
  }

  function formatTime(minutes) {
    const total = Number(minutes) || 0;
    const h = Math.floor(total / 60) % 24;
    const m = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // Проверяет, открыта ли локация в указанное время (в минутах от полуночи).
  // Локации без поля hours считаются открытыми всегда.
  function isLocationOpen(gameData, id, minutes) {
    const loc = gameData.locations[id];
    if (!loc || !loc.hours) return true;
    const { from, to } = loc.hours;
    const t = ((Number(minutes) || 0) % 1440 + 1440) % 1440;
    if (from <= to) return t >= from && t < to;
    // Интервал через полночь: например, с 22:00 до 06:00
    return t >= from || t < to;
  }

  // Человекочитаемая строка расписания: "08:00–20:00".
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

  /*
    Возвращает причину недоступности действия в виде строки или null, если
    условие на самом деле выполнено. Понимает только простые случаи:
    locationOpen, item, flag, variableAtLeast, variableDiffers. Для сложных
    условий (all/any/not) возвращает null, и UI покажет общий текст.
  */
  function describeConditionFailure(condition, state, gameData) {
    if (!condition) return null;
    if (checkCondition(condition, state, gameData)) return null;

    if (condition.locationOpen) {
      const loc = gameData.locations[condition.locationOpen];
      if (loc && loc.hours) return `Откроется в ${formatTime(loc.hours.from)}`;
      return "Сейчас закрыто";
    }
    if (condition.item) return "Нужен подходящий предмет";
    if (condition.variableAtLeast) {
      const suffix = condition.variableAtLeast.name === "money" ? " ₽" : "";
      return `Нужно ${condition.variableAtLeast.value}${suffix}`;
    }
    if (condition.variableDiffers) return "Уже сделано сегодня";
    if (condition.flag && condition.equals === false) return "Уже сделано";
    return null;
  }

  /* ---------- эффекты ---------- */

  /*
    Чистый редьюсер: возвращает новый state и массив сообщений.
    Сообщения — объекты { kind: "move" | "info", text }.
  */
  function applyEffect(effect, state, gameData) {
    const next = deepClone(state);
    const messages = [];

    switch (effect.type) {
      case "move": {
        const target = gameData.locations[effect.to];
        if (target) {
          next.location = effect.to;
          messages.push({ kind: "move", text: `Ты переходишь: ${target.name}.` });
        }
        break;
      }

      case "giveItem": {
        const item = gameData.items[effect.item];
        if (item && !next.inventory.includes(effect.item)) {
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
            messages.push({ kind: "info", text: "Наступает новый день." });
          } else {
            messages.push({ kind: "info", text: `Проходит ${daysPassed} дн.` });
          }
        }
        break;
      }
    }

    return { state: next, messages };
  }

  /*
    Применяет массив эффектов по очереди, накапливая сообщения.
  */
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

  /*
    Определяет смысловую категорию одного эффекта:
      "move"  — переход между локациями;
      "item"  — выдача или изъятие предмета;
      "money" — изменение переменной money;
      "time"  — сдвиг времени;
      "state" — всё остальное (флаги, переменные, копирование).
  */
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

  /*
    Определяет категорию действия по его эффектам.
      - Если эффектов нет — "state" (нейтральная категория).
      - Если все эффекты одной категории — эта категория.
      - Если категории разные — "mixed" (комплексное действие).

    Используется UI для цветовой маркировки кнопок действий.
  */
  function classifyAction(action) {
    const effects = (action && action.effects) || [];
    if (!effects.length) return "state";
    const kinds = new Set(effects.map(classifyEffect));
    if (kinds.size === 1) return kinds.values().next().value;
    return "mixed";
  }

  /* ---------- время суток ---------- */

  /*
    Определяет часть суток по текущему времени (в минутах от полуночи).
      "morning" — 05:00–11:59
      "day"     — 12:00–16:59
      "evening" — 17:00–22:59
      "night"   — 23:00–04:59
  */
  function getTimeOfDay(minutes) {
    const t = ((Number(minutes) || 0) % 1440 + 1440) % 1440;
    if (t >= 5 * 60 && t < 12 * 60) return "morning";
    if (t >= 12 * 60 && t < 17 * 60) return "day";
    if (t >= 17 * 60 && t < 23 * 60) return "evening";
    return "night";
  }

  // Эмодзи для части суток. Используется в статусе.
  function describeTimeOfDay(timeOfDay) {
    switch (timeOfDay) {
      case "morning": return "🌅";
      case "day": return "☀️";
      case "evening": return "🌆";
      case "night":
      default: return "🌙";
    }
  }

  /* ---------- экспорт ---------- */

  return {
    deepClone,
    hasItem,
    isAdjacent,
    formatTime,
    isLocationOpen,
    describeHours,
    getTimeOfDay,
    describeTimeOfDay,
    checkCondition,
    describeConditionFailure,
    applyEffect,
    applyEffects,
    classifyEffect,
    classifyAction
  };
})();