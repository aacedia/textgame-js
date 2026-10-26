Object.assign(window.GAME_DATA.locations, {
    "capital-street": {
        name: "Капитал-стрит", tag: "Корпоративный район",
        image: "assets/images/locations/capital-street.jpg",
        imageAlt: "Стеклянные башни корпораций, вывески и охрана",
        description: [
            "Проспект из стекла и стали. Небоскрёбы корпораций уходят в небо, у входов — рамки металлодетекторов и охрана. Прохожие в костюмах идут не оглядываясь.",
            "Здесь решается, кто будет жить хорошо, а кто — в долг."
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