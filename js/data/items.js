Object.assign(window.GAME_DATA.items, {
    keys: {
        name: "Ключи от квартиры",
        icon: "🔑",
        description: "Обычная связка ключей. Лучше не потерять."
    },
    notebook: {
        name: "Блокнот",
        icon: "📓",
        description: (state) => {
            const count = Number(state.variables.classesAttended) || 0;
            if (count === 0) return "Пока чистый. В нём можно делать заметки.";
            return `Содержит заметки. Посещено занятий: ${count}.`;
        }
    },
    water: {
        name: "Бутылка воды",
        icon: "💧",
        description: "Питьевая вода. Утоляет жажду.",
        consumable: true,
        use: {
            minutes: 2,
            restoreAfterTime: { thirst: 0 },
            text: "Ты открываешь бутылку и делаешь несколько глотков."
        }
    },
    energy_drink: {
        name: "Энергетический напиток",
        icon: "⚡",
        description: "Бодрит: немного снимает усталость и возвращает выносливость.",
        consumable: true,
        use: {
            minutes: 3,
            restoreAfterTime: { thirst: 0 },
            reduceAfterTime: { fatigue: 25 },
            effects: [{ type: "changeVariable", name: "stamina", amount: 30 }],
            text: "Ты выпиваешь банку энергетика. По телу разливается бодрость."
        }
    },
    chocolate: {
        name: "Шоколадный батончик",
        icon: "🍫",
        description: "Быстрый перекус. Немного притупляет голод.",
        consumable: true,
        use: {
            minutes: 3,
            reduceAfterTime: { hunger: 10 },
            text: "Ты разворачиваешь шоколадный батончик и съедаешь его."
        }
    },
    sandwich: {
        name: "Сэндвич",
        icon: "🥪",
        description: "Сытный сэндвич. Утоляет голод.",
        consumable: true,
        use: {
            minutes: 10,
            reduceAfterTime: { hunger: 25 },
            text: "Ты съедаешь сэндвич и чувствуешь себя сытым."
        }
    },
    pizza_slice: {
        name: "Кусочек пиццы",
        icon: "🍕",
        description: "Тёплый кусочек пиццы. Утоляет голод и немного бодрит.",
        consumable: true,
        use: {
            minutes: 10,
            reduceAfterTime: { hunger: 50 },
            effects: [{ type: "changeVariable", name: "stamina", amount: 10 }],
            text: "Ты съедаешь кусочек пиццы, смакуя каждый кусок."
        }
    }
});