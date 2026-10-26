Object.assign(window.GAME_DATA.items, {
    keys: {
        name: "Ключи от квартиры",
        icon: "🔑",
        description: "Ключи от квартиры."
    },
    notebook: {
        name: "Блокнот",
        icon: "📓",
        description: (state) => {
            const count = Number(state.variables.classesAttended) || 0;
            if (count === 0) return "Пока чистый.";
            return `Посещено занятий: ${count}.`;
        }
    },
    water: {
        name: "Бутылка воды",
        icon: "💧",
        description: "−100 жажды.",
        consumable: true,
        use: {
            minutes: 2,
            restoreAfterTime: { thirst: 0 },
            text: "Ты открываешь бутылку и делаешь несколько глотков."
        }
    },
    bread: {
        name: "Булочка",
        icon: "🥯",
        description: "−10 голода",
        consumable: true,
        use: {
            minutes: 3,
            reduceAfterTime: { hunger: 10 },
            text: "Ты достаёшь булочку и съедаешь её."
        }
    },
    energy_drink: {
        name: "Энергетический напиток",
        icon: "⚡",
        description: "−25 усталости, +30 выносливости, +10 настроения.",
        consumable: true,
        use: {
            minutes: 3,
            restoreAfterTime: { thirst: 0 },
            reduceAfterTime: { fatigue: 25 },
            effects: [
                { type: "changeVariable", name: "stamina", amount: 30 },
                { type: "changeVariable", name: "mood", amount: 10 }
            ],
            text: "Ты выпиваешь банку энергетика. По телу разливается бодрость."
        }
    },
    chocolate: {
        name: "Шоколадный батончик",
        icon: "🍫",
        description: "−10 голода, +5 настроения.",
        consumable: true,
        use: {
            minutes: 3,
            reduceAfterTime: { hunger: 10 },
            effects: [
                { type: "changeVariable", name: "mood", amount: 5 }
            ],
            text: "Ты разворачиваешь шоколадный батончик и съедаешь его."
        }
    },
    sandwich: {
        name: "Сэндвич",
        icon: "🥪",
        description: "−25 голода, +15 настроения.",
        consumable: true,
        use: {
            minutes: 10,
            reduceAfterTime: { hunger: 25 },
            effects: [{ type: "changeVariable", name: "mood", amount: 15 }],
            text: "Ты съедаешь сэндвич и чувствуешь себя сытым."
        }
    },
    pizza_slice: {
        name: "Кусочек пиццы",
        icon: "🍕",
        description: "−50 голода, +10 выносливости, +20 настроения.",
        consumable: true,
        use: {
            minutes: 10,
            reduceAfterTime: { hunger: 50 },
            effects: [
                { type: "changeVariable", name: "stamina", amount: 10 },
                { type: "changeVariable", name: "mood", amount: 20 }
            ],
            text: "Ты съедаешь кусочек пиццы, смакуя каждый кусок."
        }
    },
    mp3_player: {
        name: "MP3-плеер",
        icon: "🎵",
        description: "Любимая музыка в кармане.",
        electronics: true,
        use: {
            minutes: 3,
            randomTexts: (window.GAME_DATA.tracks || []).map(track => ({
                text: "Ты включаешь плеер. Играет ",
                link: { text: track.title, href: track.href },
                after: "."
            }))
        }
    }
});