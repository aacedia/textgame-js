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
    Rules.getTimeOfDay(minutes)
    Rules.describeTimeOfDay(timeOfDay)
    Rules.checkCondition(condition, state, gameData)
    Rules.describeConditionFailure(condition, state, gameData)
    Rules.applyEffect(effect, state, gameData)   -> { state, messages }
    Rules.applyEffects(effects, state, gameData) -> { state, messages }
    Rules.classifyEffect(effect)                 -> "move" | "item" | "money" | "time" | "state"
    Rules.classifyAction(action)                 -> категория действия

  Сообщения в messages — массив объектов { kind: "move" | "info", text }.
    "move"  — переход между локациями (для «Истории событий»);
    "info"  — всё остальное (для панели «Информация»).

  Валидация. При опечатках в типе эффекта/условия или при отсутствии
  обязательного поля функция пишет console.warn и обрабатывает случай
  как «ничего не произошло». Это безопасно для игры и заметно в консоли.

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

  // Предупреждение в консоль с указанием функции и проблемного объекта.
  function warn(message, payload) {
    if (payload !== undefined) {
      console.warn(`Rules: ${message}`, payload);
    } else {
      console.warn(`Rules: ${message}`);
    }
  }

  // Проверяет, что у эффекта есть обязательные поля по его типу.
  // Возвращает true, если структура корректна.
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

  // Возвращает true для известных условий, false — для неизвестных.
  // Используется только для предупреждения в консоль.
  const KNOWN_CONDITIONS = [
    "all", "any", "not",
    "item", "flag",
    "variableAtLeast", "variableEquals", "variableDiffers",
    "locationOpen"
  ];

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
    // Условие не распознано — предупреждаем и считаем невыполненным.
    warn(`неизвестное условие`, condition);
    return false;
  }

  function describeConditionFailure(condition, state, gameData) {
    if (!condition) return null;
    if (checkCondition(condition, state, gameData)) return null;

    // Составное условие: находим первую невыполненную ветку и описываем её.
    if (Array.isArray(condition.all)) {
      for (const c of condition.all) {
        const reason = describeConditionFailure(c, state, gameData);
        if (reason) return reason;
      }
      return "Не все условия выполнены";
    }
    if (Array.isArray(condition.any)) {
      // Для any ни одна ветка не выполнена — перечисляем причины коротко.
      // Возвращаем причину первой ветки как наиболее вероятную.
      for (const c of condition.any) {
        const reason = describeConditionFailure(c, state, gameData);
        if (reason) return reason;
      }
      return "Ни одно из условий не выполнено";
    }
    if (condition.not) {
      // Для not причина — что условие на самом деле выполнено.
      return null;
    }

    if (condition.locationOpen) {
      const loc = gameData.locations[condition.locationOpen];
      if (loc && loc.hours) return `Откроется в ${formatTime(loc.hours.from)}`;
      return "Сейчас закрыто";
    }
    if (condition.item) {
      const item = gameData.items[condition.item];
      const name = item ? item.name : condition.item;
      return `Нужен предмет: ${name}`;
    }
    if (condition.variableAtLeast) {
      const suffix = condition.variableAtLeast.name === "money" ? " ₽" : "";
      return `Нужно ${condition.variableAtLeast.value}${suffix}`;
    }
    if (condition.variableDiffers) return "Уже сделано сегодня";
    if (condition.flag && condition.equals === false) return "Уже сделано";
    return null;
  }

  /* ---------- эффекты ---------- */

  function applyEffect(effect, state, gameData) {
    const next = deepClone(state);
    const messages = [];

    // Проверка структуры: если эффект сломан, ничего не делаем.
    // warn уже вызван внутри validateEffectShape.
    if (!effect || typeof effect !== "object") {
      warn(`эффект не является объектом`, effect);
      return { state: next, messages };
    }
    if (!validateEffectShape(effect)) {
      return { state: next, messages };
    }

    switch (effect.type) {
      case "move": {
        const target = gameData.locations[effect.to];
        if (!target) {
          warn(`move → неизвестная локация "${effect.to}"`, effect);
          break;
        }
        next.location = effect.to;
        messages.push({ kind: "move", text: `Ты переходишь: ${target.name}.` });
        break;
      }

      case "giveItem": {
        const item = gameData.items[effect.item];
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

  /*
    Выбирает случайный вариант из массива с учётом:
      - condition каждого варианта (подходящие фильтруются);
      - прошлого выбора для этого действия (state.lastVariant[actionId]).
        Если у прошлого варианта не выставлен repeatable: true, он исключается
        из выбора, когда есть альтернативы.
  
    Возвращает { variant, index } или null, если подходящих нет.
    index — позиция варианта в исходном массиве (для сохранения в state).
  */
  function pickVariant(variants, state, gameData, actionId) {
    if (!Array.isArray(variants) || !variants.length) return null;

    // Собираем индексы подходящих вариантов с учётом condition.
    const eligible = [];
    variants.forEach((v, i) => {
      if (!v.condition || checkCondition(v.condition, state, gameData)) {
        eligible.push(i);
      }
    });
    if (!eligible.length) return null;

    // Прошлый индекс для этого действия (если был).
    const lastIndex = state.lastVariant && state.lastVariant[actionId];

    // Если прошлый вариант всё ещё в пуле и не repeatable — исключаем его,
    // но только если есть альтернативы.
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
    isLocationOpen,
    describeHours,
    getTimeOfDay,
    describeTimeOfDay,
    checkCondition,
    describeConditionFailure,
    applyEffect,
    applyEffects,
    classifyEffect,
    classifyAction,
    pickVariant
  };
})();