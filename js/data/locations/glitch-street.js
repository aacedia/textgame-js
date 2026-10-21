Object.assign(window.GAME_DATA.locations, {
    "glitch-street": {
        name: "Глитч-стрит", tag: "Неоновая улица",
        image: "assets/images/locations/glitch-street.jpg",
        imageAlt: "Улица в неоновых огнях, вывески и провода",
        description: [
            "Узкая улица, залитая неоновым светом. Вывески мигают, из открытых дверей доносится музыка и запах лапши. На стенах — граффити, у обочин припаркованы скутеры.",
            "Здесь находятся компьютерный клуб и раменная — места, где можно забыть о времени."
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
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    "glitch-street": ["center", "computer-club", "ramen", "rock-bar"]
});