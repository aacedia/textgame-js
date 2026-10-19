Object.assign(window.GAME_DATA.locations, {
    center: {
        name: "Центр", tag: "Деловой район",
        image: "assets/images/locations/center.jpg",
        imageAlt: "Центр города: высотки, магазины, кафе",
        description: [
            "Деловая часть города. Высотки, витрины магазинов, спешащие прохожие. В воздухе пахнет кофе и бензином.",
            "Здесь находятся университет, кафе и магазин электроники."
        ],
        actions: [
            {
                id: "center_to_university",
                label: "Пойти в университет",
                hint: "Занятия и знакомые лица",
                condition: { locationOpen: "university" },
                effects: [{ type: "move", to: "university" }]
            },
            {
                id: "center_to_cafe",
                label: "Зайти в кафе",
                hint: "Перекусить и подработать",
                condition: { locationOpen: "cafe" },
                effects: [{ type: "move", to: "cafe" }]
            },
            {
                id: "center_to_electronics",
                label: "Зайти в магазин электроники",
                hint: "Техника и гаджеты",
                condition: { locationOpen: "electronics" },
                effects: [{ type: "move", to: "electronics" }]
            },
            {
                id: "center_to_gloomy",
                label: "Пойти на мрачную улицу",
                hint: "К перекрёстку",
                effects: [{ type: "move", to: "gloomy-street" }]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    center: ["university", "cafe", "electronics", "gloomy-street"]
});