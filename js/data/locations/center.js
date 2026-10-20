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
                id: "center_to_residential",
                type: "back",
                label: "Пойти в спальный район",
                hint: "Дома, магазин, парк",
                effects: [{ type: "move", to: "residential" }]
            },
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
                id: "center_to_shop",
                label: "Зайти в магазин",
                hint: "Продукты",
                condition: { locationOpen: "shop-center" },
                effects: [{ type: "move", to: "shop-center" }]
            },
            {
                id: "center_to_electronics",
                label: "Зайти в магазин электроники",
                hint: "Техника и гаджеты",
                condition: { locationOpen: "electronics" },
                effects: [{ type: "move", to: "electronics" }]
            },
            {
                id: "center_to_glitch",
                label: "Пойти на Глитч-стрит",
                hint: "Неоновая улица с клубом и раменной",
                effects: [{ type: "move", to: "glitch-street" }]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    center: ["university", "cafe", "electronics", "shop-center", "glitch-street"]
});