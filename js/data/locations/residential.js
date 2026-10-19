Object.assign(window.GAME_DATA.locations, {
    residential: {
        name: "Спальный район", tag: "Жилой район",
        image: "assets/images/locations/residential.jpg",
        description: [
            "Тихий район. Здесь находятся твой дом, продуктовый магазин и небольшой парк."
        ],
        actions: [
            {
                id: "residential_to_apartment",
                label: "Зайти домой",
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
                label: "Пойти в центр",
                hint: "Кафе, магазины, университет",
                effects: [{ type: "move", to: "center" }]
            },
            {
                id: "residential_to_gloomy",
                label: "Пойти на мрачную улицу",
                hint: "К перекрёстку",
                effects: [{ type: "move", to: "gloomy-street" }]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    residential: ["apartment", "shop", "park", "center", "gloomy-street"]
});