Object.assign(window.GAME_DATA.locations, {
    electronics: {
        name: "Магазин электроники", tag: "Техника",
        hours: { from: 10 * 60, to: 20 * 60 },
        defaultExit: "center",
        image: "assets/images/locations/electronics.jpg",
        imageAlt: "Витрины магазина электроники",
        description: [
            "Просторный магазин электроники: витрины с телефонами, ноутбуками и аксессуарами. Консультант что-то печатает за стойкой.",
            "Здесь можно присмотреть технику на любой вкус — если хватает денег."
        ],
        actions: [
            {
                id: "electronics_return_street",
                type: "back",
                label: "Выйти из магазина",
                hint: "Вернуться в центр",
                effects: [{ type: "move", to: "center" }]
            },
            {
                id: "look_electronics",
                label: "Осмотреть витрины",
                hint: "Изучить ассортимент",
                effects: [{ type: "setFlag", flag: "lookedAtElectronics", value: true }],
                text: "На витринах — смартфоны, ноутбуки, наушники и большие телевизоры. Глаза разбегаются."
            },
            {
                id: "work_electronics",
                label: "Подработать продавцом",
                hint: "3 часа · +300 ¥ и премия · −50 выносливости",
                minutes: 180,
                condition: {
                    all: [
                        { variableDiffers: { name: "lastElectronicsShiftDay", other: "day" } },
                        { variableAtLeast: { name: "stamina", value: 50 } }
                    ]
                },
                effects: [
                    { type: "changeVariable", name: "money", amount: 300 },
                    { type: "changeVariable", name: "stamina", amount: -50 },
                    { type: "setVariableFromVariable", name: "lastElectronicsShiftDay", from: "day" },
                    { type: "addRandomMoney", min: 0, max: 400, step: 100, label: "Премия" }
                ],
                text: "Ты отрабатываешь смену продавцом-консультантом: помогаешь покупателям с выбором техники. За каждую удачную продажу дорогой техники — премия. В конце смены получаешь оплату.",
                image: "assets/images/locations/electronics-work.jpg"
            },
            {
                id: "buy_mp3",
                label: "Купить MP3-плеер",
                hint: "3000 ¥",
                minutes: 5,
                hiddenWhen: { item: "mp3_player" },
                condition: { variableAtLeast: { name: "money", value: 3000 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -3000 },
                    { type: "giveItem", item: "mp3_player" }
                ],
                text: "Ты покупаешь MP3-плеер. Теперь любимая музыка всегда с тобой."
            },
            {
                id: "buy_tv",
                label: "Купить телевизор",
                hint: "5000 ¥ · доставка домой",
                minutes: 5,
                hiddenWhen: { flag: "tvAtHome" },
                condition: { variableAtLeast: { name: "money", value: 5000 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -5000 },
                    { type: "setFlag", flag: "tvAtHome", value: true }
                ],
                text: "Ты покупаешь телевизор с доставкой."
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    electronics: ["center"]
});