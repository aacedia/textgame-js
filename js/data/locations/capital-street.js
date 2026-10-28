Object.assign(window.GAME_DATA.locations, {
    "capital-street": {
        name: "Капитал-стрит",
        tag: "Корпоративный район",
        image: "assets/images/locations/capital-street.jpg",
        imageAlt: "Стеклянные башни корпораций, неоновые вывески и строгая охрана",
        description: [
            "Проспект из стекла и стали. Мимо, не глядя по сторонам, спешат люди в дорогих костюмах с бледными лицами."
        ],
        actions: [
            {
                id: "capital_to_center",
                type: "back",
                label: "Вернуться в центр",
                hint: "К университету и кафе",
                effects: [{ type: "move", to: "center" }]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    "capital-street": ["center"]
});
