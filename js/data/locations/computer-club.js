Object.assign(window.GAME_DATA.locations, {
    "computer-club": {
        name: "Компьютерный клуб", tag: "Игровая зона",
        hours: { from: 18 * 60, to: 6 * 60 },
        defaultExit: "glitch-street",
        image: "assets/images/locations/computer-club.jpg",
        imageAlt: "Компьютерный клуб: ряды мониторов и неон",
        description: [
            "Тёмный зал с рядами мониторов. За стойкой дремлет администратор, из колонок доносится электронная музыка.",
            "Можно поиграть час за 100 ¥."
        ],
        extraDescription: [
            {
                condition: {
                    all: [
                        { timeBetween: { from: 18 * 60, to: 6 * 60 } },
                        { variableDiffers: { name: "lastHitoriDay", other: "day" } }
                    ]
                },
                parts: [
                    { text: "В дальнем углу за ноутбуком сидит " },
                    { link: { action: "hitori_talk", text: "Хитори" } },
                    { text: " — парень в тёмной толстовке с капюшоном, экран подсвечивает его лицо." }
                ]
            },
            {
                condition: {
                    all: [
                        { timeBetween: { from: 18 * 60, to: 6 * 60 } },
                        { not: { variableDiffers: { name: "lastHitoriDay", other: "day" } } }
                    ]
                },
                text: "В дальнем углу за ноутбуком сидит Хитори. Ты уже говорил с ним сегодня."
            }
        ],
        actions: [
            {
                id: "hitori_talk",
                type: "link",
                label: "Поговорить с Хитори",
                hint: "Начать разговор",
                condition: {
                    all: [
                        { timeBetween: { from: 18 * 60, to: 6 * 60 } },
                        { variableDiffers: { name: "lastHitoriDay", other: "day" } }
                    ]
                },
                effects: [
                    { type: "setVariableFromVariable", name: "lastHitoriDay", from: "day" }
                ],
                dialogue: "hitori"
            },
            {
                id: "computer_club_play",
                label: "Поиграть час",
                hint: "100 ¥ · +15 настроения",
                minutes: 60,
                condition: { variableAtLeast: { name: "money", value: 100 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -100 },
                    { type: "changeVariable", name: "mood", amount: 15 }
                ],
                text: "Ты берёшь наушники, садишься за свободный компьютер и погружаешься в игру. Час пролетает незаметно."
            },
            {
                id: "computer_club_return",
                type: "back",
                label: "Выйти на улицу",
                hint: "Вернуться на Глитч-стрит",
                effects: [{ type: "move", to: "glitch-street" }]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    "computer-club": ["glitch-street"]
});