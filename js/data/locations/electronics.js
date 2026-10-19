Object.assign(window.GAME_DATA.locations, {
    electronics: {
        name: "Магазин электроники", tag: "Техника",
        hours: { from: 10 * 60, to: 20 * 60 },
        defaultExit: "street",
        image: "assets/images/locations/electronics.jpg",
        imageAlt: "Витрины магазина электроники",
        description: [
            "Просторный магазин электроники: витрины с телефонами, ноутбуками и аксессуарами. Консультант что-то печатает за стойкой.",
            "Здесь можно присмотреть технику на любой вкус — если хватает денег."
        ],
        actions: [
            {
                id: "electronics_return_street",
                label: "Выйти из магазина",
                hint: "Вернуться в центр",
                effects: [{ type: "move", to: "center" }]
            },
            {
                id: "work_electronics",
                label: "Подработать продавцом",
                hint: "3 часа · +300 ₽ · −50 выносливости · возможны чаевые до 400₽",
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
                    { type: "addRandomMoney", min: 0, max: 400 }
                ],
                text: "Ты отрабатываешь смену продавцом-консультантом: помогаешь покупателям с выбором техники, отвечаешь на вопросы. В конце смены получаешь оплату.",
                image: "assets/images/locations/electronics-work.jpg"
            },
            {
                id: "buy_laptop",
                label: "Купить ноутбук",
                hint: "50000 ₽",
                minutes: 5,
                hiddenWhen: { item: "laptop" },
                condition: { variableAtLeast: { name: "money", value: 50000 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -50000 },
                    { type: "giveItem", item: "laptop" }
                ],
                text: "Ты покупаешь ноутбук. Теперь можно работать и учиться где угодно."
            },
            {
                id: "buy_console",
                label: "Купить портативную консоль",
                hint: "25000 ₽",
                minutes: 5,
                hiddenWhen: { item: "handheld_console" },
                condition: { variableAtLeast: { name: "money", value: 25000 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -25000 },
                    { type: "giveItem", item: "handheld_console" }
                ],
                text: "Ты покупаешь портативную консоль. В дороге будет чем заняться."
            },
            {
                id: "buy_smartphone",
                label: "Купить смартфон",
                hint: "30000 ₽",
                minutes: 5,
                hiddenWhen: { item: "smartphone" },
                condition: { variableAtLeast: { name: "money", value: 30000 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -30000 },
                    { type: "giveItem", item: "smartphone" }
                ],
                text: "Ты покупаешь смартфон. Теперь всегда на связи."
            },
            {
                id: "buy_headphones",
                label: "Купить беспроводные наушники",
                hint: "8000 ₽",
                minutes: 5,
                hiddenWhen: { item: "wireless_headphones" },
                condition: { variableAtLeast: { name: "money", value: 8000 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -8000 },
                    { type: "giveItem", item: "wireless_headphones" }
                ],
                text: "Ты покупаешь беспроводные наушники. Звук чистый, провода не мешают."
            },
            {
                id: "buy_tv",
                label: "Купить телевизор",
                hint: "40000 ₽ · доставка домой",
                minutes: 5,
                hiddenWhen: { flag: "tvAtHome" },
                condition: { variableAtLeast: { name: "money", value: 40000 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -40000 },
                    { type: "setFlag", flag: "tvAtHome", value: true }
                ],
                text: "Ты покупаешь телевизор с доставкой."
            },
            {
                id: "look_electronics",
                label: "Осмотреть витрины",
                hint: "Изучить ассортимент",
                effects: [{ type: "setFlag", flag: "lookedAtElectronics", value: true }],
                text: "На витринах — смартфоны, ноутбуки, наушники и большие телевизоры. Глаза разбегаются."
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    electronics: ["center"]
});