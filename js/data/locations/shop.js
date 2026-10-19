Object.assign(window.GAME_DATA.locations, {
    shop: {
        name: "Магазин", tag: "Покупки",
        hours: { from: 8 * 60, to: 22 * 60 },
        defaultExit: "street",
        image: "assets/images/locations/shop.jpg",
        description: [
            "Небольшой магазин у перекрёстка. На полках стоят напитки, снеки и самые разные мелочи. За кассой скучает продавец."
        ],
        actions: [
            {
                id: "return_street",
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
                label: "Купить продукты",
                hint: "100 ¥ · +5 порций еды",
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
                label: "Купить шоколадный батончик",
                hint: "25 ¥",
                minutes: 1,
                condition: { variableAtLeast: { name: "money", value: 25 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -25 },
                    { type: "giveItem", item: "chocolate" }
                ],
                text: "Ты берёшь шоколадный батончик и убираешь его в сумку."
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    shop: ["residential"]
});