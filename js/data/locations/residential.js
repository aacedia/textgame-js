Object.assign(window.GAME_DATA.locations, {
    residential: {
        name: "Спальный район", tag: "Жилой район",
        image: "assets/images/locations/residential.jpg",
        description: [
            "Тихий район. Здесь находятся твой дом, продуктовый магазин и небольшой парк."
        ],
        extraDescription: [
            {
                condition: {
                    all: [
                        { timeBetween: { from: 16 * 60, to: 22 * 60 } },
                        { variableDiffers: { name: "lastYuiDay", other: "day" } }
                    ]
                },
                parts: [
                    { text: "На лавочке возле дома сидит " },
                    { link: { action: "yui_talk", text: "Юи" } },
                    { text: " в наушниках — кажется, она никуда не спешит." }
                ]
            },
            {
                condition: {
                    all: [
                        { timeBetween: { from: 16 * 60, to: 22 * 60 } },
                        { not: { variableDiffers: { name: "lastYuiDay", other: "day" } } }
                    ]
                },
                text: "На лавочке возле дома сидит Юи в наушниках. Ты уже говорил с ней сегодня."
            }
        ],
        actions: [
            {
                id: "residential_to_apartment",
                type: "back",
                label: "Вернуться домой",
                hint: "Вернуться в квартиру",
                effects: [{ type: "move", to: "apartment" }]
            },
            {
                id: "residential_to_shop",
                label: "Зайти в магазин",
                hint: "Продукты и мелочи",
                condition: { locationOpen: "shop" },
                effects: [{ type: "move", to: "shop" }]
            },
            {
                id: "residential_to_park",
                label: "Пойти в парк",
                hint: "Прогуляться по аллее",
                condition: { locationOpen: "park" },
                effects: [{ type: "move", to: "park" }]
            },
            {
                id: "residential_to_center",
                type: "back",
                label: "Пойти в центр города",
                hint: "Кафе, магазины, университет",
                effects: [{ type: "move", to: "center" }]
            },
            {
                id: "yui_talk",
                type: "link",
                label: "Поговорить с Юи",
                hint: "Начать разговор",
                condition: {
                    all: [
                        { timeBetween: { from: 16 * 60, to: 22 * 60 } },
                        { variableDiffers: { name: "lastYuiDay", other: "day" } }
                    ]
                },
                effects: [
                    { type: "setVariableFromVariable", name: "lastYuiDay", from: "day" }
                ],
                dialogue: "yui"
            }
            // {
            //     id: "residential_to_gloomy",
            //     label: "Пойти на мрачную улицу",
            //     hint: "К перекрёстку",
            //     effects: [{ type: "move", to: "gloomy-street" }]
            // }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    residential: ["apartment", "shop", "park", "center"]
});