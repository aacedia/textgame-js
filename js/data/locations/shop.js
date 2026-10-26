Object.assign(window.GAME_DATA.locations, {
    shop: {
        name: "Магазин", tag: "Покупки",
        hours: { from: 8 * 60, to: 22 * 60 },
        defaultExit: "residential",
        image: "assets/images/locations/shop.jpg",
        description: [
            "Небольшой магазин у дома. На полках стоят напитки, снеки и самые разные мелочи. За кассой скучает продавец."
        ],
        actions: [
            {
                id: "return_street",
                type: "back",
                label: "Выйти на улицу",
                hint: "Вернуться в район",
                effects: [{ type: "move", to: "residential" }]
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
                hint: "100 ¥ · +5 порций продуктов для готовки дома",
                minutes: 1,
                condition: { variableAtLeast: { name: "money", value: 100 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -100 },
                    { type: "changeVariable", name: "foodPortions", amount: 5 }
                ],
                text: "Ты покупаешь продукты: крупы, овощи, что-то к чаю. Хватит на несколько дней."
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
                id: "buy_chocolate",
                label: "Купить булочку",
                hint: "10 ¥",
                minutes: 1,
                condition: { variableAtLeast: { name: "money", value: 10 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -10 },
                    { type: "giveItem", item: "bread" }
                ],
                text: "Ты берёшь булочку и убираешь её в сумку."
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    shop: ["residential"]
});