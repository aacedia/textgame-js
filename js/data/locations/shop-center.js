Object.assign(window.GAME_DATA.locations, {
    "shop-center": {
        name: "Магазин", tag: "Покупки",
        hours: { from: 8 * 60, to: 22 * 60 },
        defaultExit: "center",
        image: "assets/images/locations/shop-center.jpg",
        description: [
            "Магазин в центре. Полки сверкают чистотой."
        ],
        actions: [
            {
                id: "return_street",
                label: "Выйти на улицу",
                hint: "Вернуться в центр",
                effects: [{ type: "move", to: "center" }]
            },
            {
                id: "buy_water",
                label: "Купить бутылку воды",
                hint: "15 ¥",
                minutes: 1,
                condition: { variableAtLeast: { name: "money", value: 15 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -15 },
                    { type: "giveItem", item: "water" }
                ],
                text: "Ты берёшь с полки бутылку воды и кладёшь её в сумку."
            },
            {
                id: "buy_energy_drink",
                label: "Купить энергетик",
                hint: "40 ¥",
                minutes: 1,
                condition: { variableAtLeast: { name: "money", value: 40 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -40 },
                    { type: "giveItem", item: "energy_drink" }
                ],
                text: "Ты берёшь банку энергетика и убираешь её в сумку."
            },
            {
                id: "buy_sandwich",
                label: "Купить сэндвич",
                hint: "60 ¥",
                minutes: 1,
                condition: { variableAtLeast: { name: "money", value: 60 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -60 },
                    { type: "giveItem", item: "sandwich" }
                ],
                text: "Ты берёшь сэндвич и убираешь его в сумку."
            },
            {
                id: "buy_pizza_slice",
                label: "Купить кусочек пиццы",
                hint: "80 ¥",
                minutes: 1,
                condition: { variableAtLeast: { name: "money", value: 80 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -80 },
                    { type: "giveItem", item: "pizza_slice" }
                ],
                text: "Ты берёшь кусочек пиццы и убираешь его в сумку."
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    "shop-center": ["center"]
});