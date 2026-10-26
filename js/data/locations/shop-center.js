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
                type: "back",
                label: "Выйти на улицу",
                hint: "Вернуться в центр",
                effects: [{ type: "move", to: "center" }]
            },
            {
                id: "buy_notebook",
                label: "Купить блокнот",
                hint: "100 ¥ · Нужен для занятий",
                hiddenWhen: { item: "notebook" },
                condition: { variableAtLeast: { name: "money", value: 100 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -100 },
                    { type: "giveItem", item: "notebook" }
                ],
                text: "Ты покупаешь блокнот и убираешь его в сумку.",
                image: "assets/images/items/notebook.jpg"
            },
            {
                id: "buy_food",
                label: "Купить продукты домой",
                hint: "150 ¥ · +5 порций продуктов для готовки дома",
                iconImage: "assets/images/actions/grocery.png",
                minutes: 1,
                condition: { variableAtLeast: { name: "money", value: 150 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -150 },
                    { type: "changeVariable", name: "foodPortions", amount: 5 }
                ],
                text: "Ты покупаешь продукты: крупы, овощи, что-то к чаю. Хватит на несколько дней."
            },
            {
                id: "buy_water",
                label: "Купить бутылку воды",
                hint: "25 ¥",
                minutes: 1,
                condition: { variableAtLeast: { name: "money", value: 25 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -25 },
                    { type: "giveItem", item: "water" }
                ],
                text: "Ты берёшь с полки бутылку воды и кладёшь её в сумку."
            },
            {
                id: "buy_energy_drink",
                label: "Купить энергетик",
                hint: "60 ¥",
                minutes: 1,
                condition: { variableAtLeast: { name: "money", value: 60 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -60 },
                    { type: "giveItem", item: "energy_drink" }
                ],
                text: "Ты берёшь банку энергетика и убираешь её в сумку."
            },
            {
                id: "buy_sandwich",
                label: "Купить сэндвич",
                hint: "80 ¥",
                minutes: 1,
                condition: { variableAtLeast: { name: "money", value: 80 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -80 },
                    { type: "giveItem", item: "sandwich" }
                ],
                text: "Ты берёшь сэндвич и убираешь его в сумку."
            },
            {
                id: "buy_pizza_slice",
                label: "Купить кусочек пиццы",
                hint: "100 ¥",
                minutes: 1,
                condition: { variableAtLeast: { name: "money", value: 100 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -100 },
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