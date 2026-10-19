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
                id: "buy_notebook",
                label: "Купить блокнот",
                hint: "100 ¥",
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
            },
            {
                id: "look_shelves",
                label: "Осмотреть полки",
                hint: "Изучить ассортимент",
                effects: [{ type: "setFlag", flag: "lookedAtShelves", value: true }],
                text: "На полках ты замечаешь воду, снеки, шоколад и готовые сэндвичи.",
                image: "assets/images/locations/shop-shelves.jpg"
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    shop: ["residential"]
});