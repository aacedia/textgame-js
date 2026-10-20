Object.assign(window.GAME_DATA.locations, {
    park: {
        name: "Парк", tag: "Зелёная зона",
        hours: { from: 6 * 60, to: 23 * 60 },
        defaultExit: "street",
        image: "assets/images/locations/park.jpg",
        imageAlt: "Городской парк с аллеями и деревьями",
        description: [
            "Большой городской парк раскинулся между улицами. Вдоль аллей стоят скамейки, в кронах деревьев шумит ветер, где-то играют дети.",
            "Здесь можно спокойно прогуляться, отдохнуть от суеты и собраться с мыслями."
        ],
        extraDescription: [
            {
                condition: {
                    all: [
                        { timeBetween: { from: 12 * 60, to: 18 * 60 } },
                        { variableDiffers: { name: "lastHimariDay", other: "day" } }
                    ]
                },
                parts: [
                    { text: "На скамейке у фонтана сидит " },
                    { link: { action: "talk_to_himari", text: "Химари" } },
                    { text: " с книгой — кажется, она никуда не спешит." }
                ]
            },
            {
                condition: {
                    all: [
                        { timeBetween: { from: 12 * 60, to: 18 * 60 } },
                        { not: { variableDiffers: { name: "lastHimariDay", other: "day" } } }
                    ]
                },
                text: "На скамейке у фонтана сидит Химари с книгой. Ты уже говорил с ней сегодня."
            }
        ],
        actions: [
            {
                id: "park_return_street",
                type: "back",
                label: "Выйти из парка",
                hint: "Вернуться в район",
                effects: [{ type: "move", to: "residential" }]
            },
            {
                id: "walk_park",
                label: "Прогуляться по парку",
                hint: "Проходит 30 минут · +5 настроения",
                minutes: 30,
                effects: [
                    { type: "changeVariable", name: "mood", amount: 5 }
                ],
                reduceAfterTime: { fatigue: 2, hunger: 4, thirst: 2 },
                text: "Ты неспешно идёшь по аллее, вдыхая свежий воздух и слушая птиц. На душе становится спокойнее.",
                image: "assets/images/locations/park-walk.jpg"
            },
            {
                id: "talk_to_himari",
                type: "link",
                label: "Подойти к Химари",
                hint: "Поговорить",
                minutes: 15,
                condition: {
                    all: [
                        { timeBetween: { from: 12 * 60, to: 18 * 60 } },
                        { variableDiffers: { name: "lastHimariDay", other: "day" } }
                    ]
                },
                effects: [
                    { type: "setVariableFromVariable", name: "lastHimariDay", from: "day" },
                    { type: "changeVariable", name: "mood", amount: 10 }
                ],
                text: "Ты подходишь к Химари, и вы неспешно разговариваете о книгах, учёбе и планах. Она улыбается и говорит, что завтра снова будет здесь.",
                image: "assets/images/characters/himari.png"
            },
            {
                id: "park_look_around",
                label: "Осмотреться",
                hint: "Понаблюдать за людьми",
                effects: [{ type: "setFlag", flag: "lookedAroundPark", value: true }],
                text: "Ты оглядываешь людей, гуляющих по парку.",
                image: "assets/images/locations/park-look.jpg"
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    park: ["residential"]
});