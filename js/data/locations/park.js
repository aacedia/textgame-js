Object.assign(window.GAME_DATA.locations, {
    park: {
        name: "Парк",
        hours: { from: 6 * 60, to: 23 * 60 },
        defaultExit: "residential",
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
                        { timeBetween: { from: 14 * 60, to: 18 * 60 } },
                        { variableDiffers: { name: "lastRinDay", other: "day" } }
                    ]
                },
                parts: [
                    { text: "На скамейке у фонтана сидит " },
                    { link: { action: "rin_talk", text: "Рин" } },
                    { text: " с ноутбуком — кажется, она снова что-то пишет." }
                ]
            },
            {
                condition: {
                    all: [
                        { timeBetween: { from: 14 * 60, to: 18 * 60 } },
                        { not: { variableDiffers: { name: "lastRinDay", other: "day" } } }
                    ]
                },
                text: "На скамейке у фонтана сидит Рин с ноутбуком. Ты уже говорил с ней сегодня."
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
                hint: "30 минут · +15 настроения · −3 выносливости · +5 усталости",
                iconImage: "assets/images/actions/walk.png",
                minutes: 30,
                effects: [
                    { type: "changeVariable", name: "mood", amount: 15 },
                    { type: "changeVariable", name: "stamina", amount: -3 },
                    { type: "changeVariable", name: "fatigue", amount: 5 }
                ],
                text: "Ты неспешно идёшь по аллее, вдыхая свежий воздух и слушая птиц. На душе становится спокойнее.",
                image: "assets/images/locations/park-walk.jpg"
            },
            {
                id: "roller_skating",
                label: "Покататься на роликах",
                hint: "200 ¥ · 2 часа · +5 к максимуму здоровья",
                iconImage: "assets/images/actions/training.png",
                minutes: 120,
                condition: {
                    all: [
                        { variableAtLeast: { name: "money", value: 200 } },
                        { variableDiffers: { name: "lastSkatingDay", other: "day" } },
                        { not: { variableAtLeast: { name: "healthMax", value: 100 } } }
                    ]
                },
                hiddenWhen: { variableAtLeast: { name: "healthMax", value: 100 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -200 },
                    { type: "changeVariable", name: "healthMax", amount: 5 },
                    { type: "setVariableFromVariable", name: "lastSkatingDay", from: "day" },
                    { type: "changeVariable", name: "fatigue", amount: 10 },
                    { type: "changeVariable", name: "hunger", amount: 10 },
                    { type: "changeVariable", name: "thirst", amount: 10 },
                    { type: "changeVariable", name: "mood", amount: 10 }
                ],
                text: "Ты берёшь напрокат ролики и два часа катаешься по аллеям парка. Ветер в лицо, скорость, азарт — тело становится крепче.",
                image: "assets/images/locations/park-walk.jpg"
            },
            {
                id: "rin_talk",
                type: "link",
                label: "Поговорить с Рин",
                hint: "Начать разговор",
                condition: {
                    all: [
                        { timeBetween: { from: 14 * 60, to: 18 * 60 } },
                        { variableDiffers: { name: "lastRinDay", other: "day" } }
                    ]
                },
                effects: [
                    { type: "setVariableFromVariable", name: "lastRinDay", from: "day" }
                ],
                dialogue: "rin"
            },
            {
                id: "park_look_around",
                label: "Осмотреться",
                hint: "Понаблюдать за людьми",
                iconImage: "assets/images/actions/look.png",
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