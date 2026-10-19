Object.assign(window.GAME_DATA.locations, {
    "gloomy-street": {
        name: "Мрачная улица", tag: "Переулок",
        image: "assets/images/locations/gloomy-street.jpg",
        imageAlt: "Мрачная улица между домами",
        description: [
            "Узкая улица между старыми домами. Фонари горят тускло, стены облуплены, редкие прохожие спешат мимо."
        ],
        actions: [
            {
                id: "gloomy_to_residential",
                label: "Пойти в спальный район",
                hint: "Дома, магазин, парк",
                effects: [{ type: "move", to: "residential" }]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    "gloomy-street": ["residential"]
});