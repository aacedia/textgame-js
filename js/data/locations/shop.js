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
                id: "buy_notebook",
                label: "Купить блокнот",
                hint: "100 ₽",
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
                id: "buy_snack",
                label: "Купить перекус",
                hint: "30 ₽ · снимает голод",
                minutes: 5,
                condition: { variableAtLeast: { name: "money", value: 30 } },
                effects: [{ type: "changeVariable", name: "money", amount: -30 }],
                restoreAfterTime: { hunger: 0 },
                text: "Ты покупаешь булочку и быстро перекусываешь.",
                image: "assets/images/locations/shop-shelves.jpg"
            },
            {
                id: "buy_water",
                label: "Купить воду",
                hint: "15 ₽ · снимает жажду",
                minutes: 2,
                condition: { variableAtLeast: { name: "money", value: 15 } },
                effects: [{ type: "changeVariable", name: "money", amount: -15 }],
                restoreAfterTime: { thirst: 0 },
                text: "Ты покупаешь бутылку воды и пьёшь.",
                image: "assets/images/locations/shop-shelves.jpg"
            },
            {
                id: "look_shelves",
                label: "Осмотреть полки",
                hint: "Изучить ассортимент",
                effects: [{ type: "setFlag", flag: "lookedAtShelves", value: true }],
                text: "На полках ты замечаешь воду, яблоки и блокноты.",
                image: "assets/images/locations/shop-shelves.jpg"
            },
            {
                id: "return_street",
                label: "Выйти на улицу",
                hint: "Вернуться к перекрёстку",
                effects: [{ type: "move", to: "street" }]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    shop: ["street"]
});