Object.assign(window.GAME_DATA.locations, {
    "glitch-street": {
        name: "Глитч-стрит",
        image: "assets/images/locations/glitch-street.jpg",
        imageAlt: "Улица в неоновых огнях, вывески и провода",
        description: [
            "Узкая улица, залитая неоновым светом. Из открытых дверей доносится музыка и запах лапши.",
            "Здесь находятся компьютерный клуб и раменная, а так же рок-бар, где в пятницу, субботу и воскресенье проходят концерты."
        ],
        extraDescription: [
            {
                condition: { flag: "vendingHack" },
                text: "Возле компьютерного клуба стоит автомат с напитками. Благодаря скрипту Хитори можно попробовать что-то из него выщатить."
            },
            {
                condition: { not: { flag: "vendingHack" } },
                text: "Возле компьютерного клуба стоит неисправный автомат с напитками."
            }
        ],
        actions: [
            {
                id: "glitch_to_center",
                type: "back",
                label: "Вернуться в центр",
                hint: "К университетскому району",
                effects: [{ type: "move", to: "center" }]
            },
            {
                id: "glitch_to_computer_club",
                label: "Зайти в компьютерный клуб",
                hint: "Игры и турниры",
                condition: { locationOpen: "computer-club" },
                effects: [{ type: "move", to: "computer-club" }]
            },
            {
                id: "glitch_to_ramen",
                label: "Зайти в раменную",
                hint: "Горячая лапша",
                condition: { locationOpen: "ramen" },
                effects: [{ type: "move", to: "ramen" }]
            },
            {
                id: "glitch_to_rock_bar",
                label: "Зайти в рок-бар",
                hint: "Живая музыка по выходным",
                condition: { locationOpen: "rock-bar" },
                effects: [{ type: "move", to: "rock-bar" }]
            },
            {
                id: "vending_take",
                label: "Забрать напиток из автомата",
                hint: "Раз в день · иногда пусто",
                icon: "🥤",
                iconImage: "assets/images/items/soda.png",
                minutes: 5,
                condition: {
                    all: [
                        { flag: "vendingHack" },
                        { variableDiffers: { name: "lastVendingDay", other: "day" } }
                    ]
                },
                hiddenWhen: { not: { flag: "vendingHack" } },
                effects: [
                    { type: "setVariableFromVariable", name: "lastVendingDay", from: "day" }
                ],
                variants: [
                    {
                        condition: { randomChance: 20 },
                        text: "Ты запускаешь проверку мотора, автомат гудит, щёлкает… и ничего не выдаёт. Похоже, на этот раз пусто."
                    },
                    {
                        effects: [
                            { type: "giveItem", item: "water" }
                        ],
                        text: "Ты запускаешь проверку мотора, и в лоток падает бутылка воды."
                    },
                    {
                        effects: [
                            { type: "giveItem", item: "energy_drink" }
                        ],
                        text: "Ты запускаешь проверку мотора, и в лоток падает банка энергетика."
                    },
                    {
                        effects: [
                            { type: "giveItem", item: "soda" }
                        ],
                        text: "Ты запускаешь проверку мотора, и в лоток падает банка газировки."
                    }
                ]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    "glitch-street": ["center", "computer-club", "ramen", "rock-bar"]
});