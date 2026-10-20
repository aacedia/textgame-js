/*
  Эффекты. Регистрирует в window.Rules:
    Rules.applyNeeds(state, minutes, gameData)
    Rules.applyEffect(effect, state, gameData)
    Rules.applyEffects(effects, state, gameData)

  Подключается после rules.js.

  Сообщения:
    kind: "info"      — только в «Историю событий»;
    kind: "infoExtra" — в «Историю событий» и в «Информацию».
*/
(() => {
    "use strict";

    const Rules = window.Rules;
    if (!Rules) { console.error("rules-effects.js: window.Rules не найден."); return; }

    const { deepClone, warn, validateEffectShape } = Rules;

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
        const rateMultiplier = isSleeping ? 0.1 : 1;

        /* ---- Настроение ---- */

        const moodMax = Number(gameData.moodMax ?? 100);
        const moodRates = gameData.moodRates || {};
        const passiveLoss = Number(moodRates.passive ?? 0);
        const perHighNeed = Number(moodRates.perHighNeed ?? 0);
        const highThreshold = Number(moodRates.highNeedThreshold ?? 80);

        let moodLoss = passiveLoss;
        ["hunger", "thirst", "fatigue"].forEach(key => {
            const v = Number(next.variables[key]) || 0;
            if (v > highThreshold) moodLoss += perHighNeed;
        });

        const hours = delta / 60;
        const moodMultiplier = isSleeping ? 0.1 : 1;
        next.variables.mood = Math.max(
            0,
            Math.min(moodMax, (Number(next.variables.mood) || 0) - moodLoss * hours * moodMultiplier)
        );
        const lowMood = next.variables.mood <= 0;

        /* ---- Потребности ---- */

        const lowMoodMultiplier = lowMood ? Number(moodRates.lowMoodMultiplier ?? 2) : 1;
        const combinedMultiplier = rateMultiplier * lowMoodMultiplier;

        let damage = 0;

        ["hunger", "thirst", "fatigue"].forEach(key => {
            if (isSleeping && key === "fatigue") {
                next.variables[key] = Math.min(needsMax, Math.max(0, Number(next.variables[key]) || 0));
                return;
            }

            const rate = (Number(rates[key]) || 0) * combinedMultiplier;
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
            damage += (Math.max(0, minutesAtMax) / 60) * damagePerHour;
        });

        damage *= isSleeping ? 0.5 : 1;

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
                next.inventory.push(effect.item);
                messages.push({ kind: "info", text: `Получен предмет: ${item.name}.` });
                break;
            }

            case "removeItem": {
                const idx = next.inventory.indexOf(effect.item);
                if (idx !== -1) {
                    next.inventory.splice(idx, 1);
                }
                break;
            }

            case "setFlag": {
                next.flags[effect.flag] = effect.value;
                break;
            }

            case "changeVariable": {
                const before = Number(next.variables[effect.name] || 0);
                let after = before + effect.amount;

                // Зажимы по максимуму.
                if (effect.name === "mood") {
                    const max = Number(gameData.moodMax ?? 100);
                    after = Math.max(0, Math.min(max, after));
                }
                if (effect.name.startsWith("relationship_")) {
                    after = Math.max(0, Math.min(100, after));
                }
                if (effect.name === "stamina") {
                    const max = Number(next.variables.staminaMax ?? gameData.staminaMax ?? 100);
                    after = Math.max(0, Math.min(max, after));
                }
                if (effect.name === "staminaMax") {
                    const cap = Number(gameData.staminaMax ?? 100);
                    after = Math.max(0, Math.min(cap, after));
                    const cur = Number(next.variables.stamina) || 0;
                    if (cur > after) next.variables.stamina = after;
                }

                next.variables[effect.name] = after;

                // Сообщения о деньгах — в «Историю» и в «Информацию».
                if (effect.name === "money") {
                    const diff = after - before;
                    if (diff > 0) {
                        messages.push({ kind: "infoExtra", text: `Получено: ${diff} ¥` });
                    } else if (diff < 0) {
                        messages.push({ kind: "infoExtra", text: `Потрачено: ${-diff} ¥` });
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

            case "addRandomMoney": {
                const min = Math.max(0, Number(effect.min) || 0);
                const max = Math.max(min, Number(effect.max) || min);
                const step = Math.max(1, Number(effect.step) || 1);

                const steps = Math.floor((max - min) / step);
                const amount = min + Math.floor(Math.random() * (steps + 1)) * step;

                const before = Number(next.variables.money) || 0;
                next.variables.money = before + amount;

                const label = String(effect.label || "Чаевые");
                if (amount > 0) {
                    messages.push({ kind: "infoExtra", text: `${label}: ${amount} ¥.` });
                } else {
                    messages.push({ kind: "infoExtra", text: `${label}: нет.` });
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

    Object.assign(window.Rules, {
        applyNeeds,
        applyEffect,
        applyEffects
    });
})();