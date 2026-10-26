Object.assign(window.GAME_DATA.items, {
    keys: {
        name: "Ключи от квартиры",
        icon: "🔑",
        iconImage: "assets/images/items/keys.png",
        description: "Ключи от квартиры."
    },
    notebook: {
        name: "Блокнот",
        icon: "📓",
        iconImage: "assets/images/items/notebook.png",
        description: (state) => {
            const count = Number(state.variables.classesAttended) || 0;
            if (count === 0) return "Пока чистый.";
            return `Посещено занятий: ${count}.`;
        }
    },
    water: {
        name: "Бутылка воды",
        icon: "💧",
        iconImage: "assets/images/items/water.png",
        description: "−60 жажды.",
        consumable: true,
        use: {
            minutes: 2,
            restoreAfterTime: { thirst: 0 },
            reduceAfterTime: { thirst: 60 },
            text: "Ты открываешь бутылку и делаешь несколько глотков. Жажда отступает."
        }
    },
    bread: {
        name: "Булочка",
        icon: "🥯",
        iconImage: "assets/images/items/bread.png",
        description: "−10 голода.",
        consumable: true,
        use: {
            minutes: 3,
            reduceAfterTime: { hunger: 10 },
            text: "Ты достаёшь булочку и съедаешь её. Голод немного отступает."
        }
    },
    energy_drink: {
        name: "Энергетический напиток",
        icon: "⚡",
        iconImage: "assets/images/items/energy_drink.png",
        description: "−20 усталости, +20 выносливости. Немного поднимает жажду.",
        consumable: true,
        use: {
            minutes: 3,
            restoreAfterTime: { thirst: 0 },
            reduceAfterTime: { fatigue: 20 },
            effects: [
                { type: "changeVariable", name: "stamina", amount: 20 },
                { type: "changeVariable", name: "thirst", amount: 15 }
            ],
            text: "Ты выпиваешь банку энергетика. По телу разливается бодрость, но жажда усиливается."
        }
    },
    // уникальный расходник из автомата на глитч-стрит
    soda: {
        name: "Газировка",
        icon: "🥤",
        iconImage: "assets/images/items/soda.png",
        description: "−10 жажды, +8 настроения.",
        consumable: true,
        use: {
            minutes: 3,
            reduceAfterTime: { thirst: 10 },
            effects: [
                { type: "changeVariable", name: "mood", amount: 8 }
            ],
            text: "Ты открываешь банку газировки. Пузырьки щекочут горло, настроение немного поднимается."
        }
    },
    // пока не используется
    chocolate: {
        name: "Шоколадный батончик",
        icon: "🍫",
        iconImage: "assets/images/items/chocolate.png",
        description: "−10 голода.",
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
        iconImage: "assets/images/items/sandwich.png",
        description: "−25 голода.",
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
        iconImage: "assets/images/items/pizza_slice.png",
        description: "−35 голода, +5 выносливости.",
        consumable: true,
        use: {
            minutes: 10,
            reduceAfterTime: { hunger: 35 },
            effects: [
                { type: "changeVariable", name: "stamina", amount: 5 }
            ],
            text: "Ты съедаешь кусочек пиццы, смакуя каждый кусок."
        }
    },
    mp3_player: {
        name: "MP3-плеер",
        icon: "🎵",
        iconImage: "assets/images/items/mp3_player.png",
        description: (state) => {
            const left = 3 - (Number(state.variables.musicUsesToday) || 0);
            if (state.variables.lastMusicDay !== state.variables.day) {
                return "Любимая музыка в кармане. Можно послушать 3 раза в день.";
            }
            if (left <= 0) return "На сегодня плеер уже отслушан.";
            return `Любимая музыка в кармане. Осталось на сегодня: ${left}.`;
        },
        electronics: true,
        use: {
            minutes: 3,
            dailyLimit: 3,
            dailyCounter: "musicUsesToday",
            dailyDay: "lastMusicDay",
            effects: [
                { type: "changeVariable", name: "mood", amount: 6 },
                { type: "changeVariable", name: "stamina", amount: -1 },
                { type: "changeVariable", name: "fatigue", amount: 2 }
            ],
            randomTexts: (window.GAME_DATA.tracks || []).map(track => ({
                text: "Ты включаешь плеер. Играет ",
                link: { text: track.title, href: track.href },
                after: "."
            }))
        }
    }
});