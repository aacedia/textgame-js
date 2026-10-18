Object.assign(window.GAME_DATA.locations, {
    street: {
        name: "Улица", tag: "Город",
        image: "assets/images/locations/street.jpg",
        description: [
            "На улице уже шумно: проезжают автобусы, прохожие спешат по своим делам, а на перекрёстке мигает зелёный сигнал.",
            "Отсюда можно добраться до университета, зайти в магазин или в кафе на углу."
        ],
        actions: [
            {
                id: "go_university",
                label: "Пойти в университет",
                hint: "Занятия и знакомые лица",
                condition: { locationOpen: "university" },
                effects: [{ type: "move", to: "university" }]
            },
            {
                id: "go_shop",
                label: "Зайти в магазин",
                hint: "Посмотреть товары",
                condition: { locationOpen: "shop" },
                effects: [{ type: "move", to: "shop" }]
            },
            {
                id: "go_cafe",
                label: "Зайти в кафе",
                hint: "Перекусить и подработать",
                condition: { locationOpen: "cafe" },
                effects: [{ type: "move", to: "cafe" }]
            },
            {
                id: "go_home",
                label: "Вернуться домой",
                hint: "Назад в квартиру",
                effects: [{ type: "move", to: "apartment" }]
            },
            {
                id: "look_around",
                label: "Осмотреться",
                hint: "Случайное событие",
                effects: [{ type: "setFlag", flag: "lookedAroundStreet", value: true }],
                variants: [
                    {
                        text: "Мимо проезжает автобус и останавливается на перекрёстке.",
                        image: "assets/images/locations/street-scene-bus.jpg"
                    },
                    {
                        text: "На тротуар садится голубь, клюёт крошки и улетает.",
                        image: "assets/images/locations/street-scene-pigeon.jpg"
                    },
                    {
                        text: "Мимо проходит студентка с рюкзаком и кивает тебе.",
                        image: "assets/images/locations/street-scene-student.jpg"
                    },
                    {
                        condition: { not: { flag: "foundCoin" } },
                        effects: [
                            { type: "setFlag", flag: "foundCoin", value: true },
                            { type: "changeVariable", name: "money", amount: 100 }
                        ],
                        text: "На тротуаре что-то блестит. Ты наклоняешься и находишь монетку в 100 ₽. Вряд ли снова так повезёт.",
                        image: "assets/images/locations/street-scene-coin.jpg"
                    }
                ]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    street: ["apartment", "university", "shop", "cafe"]
});