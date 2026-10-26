Object.assign(window.GAME_DATA.locations, {
    university: {
        name: "Университет", tag: "Учёба",
        hours: { from: 8 * 60, to: 20 * 60 },
        closedWeekdays: [5, 6],
        defaultExit: "center",
        image: "assets/images/locations/university.jpg",
        description: [
            "Главное здание университета. У входа собрались студенты."
        ],
        extraDescription: [
            {
                condition: {
                    all: [
                        { timeBetween: { from: 8 * 60, to: 14 * 60 } },
                        { variableDiffers: { name: "lastHinakoDay", other: "day" } }
                    ]
                },
                parts: [
                    { text: "В холле за столом сидит " },
                    { link: { action: "hinako_talk", text: "Хинако" } },
                    { text: " с учебником — она всегда приходит заранее." }
                ]
            },
            {
                condition: {
                    all: [
                        { timeBetween: { from: 8 * 60, to: 14 * 60 } },
                        { not: { variableDiffers: { name: "lastHinakoDay", other: "day" } } }
                    ]
                },
                text: "В холле за столом сидит Хинако с книгой. Ты уже говорил с ней сегодня."
            },
            {
                condition: { timeBetween: { from: 8 * 60, to: 18 * 60 } },
                parts: [
                    { text: "В конце коридора — дверь с табличкой «Офис администрации». Можно зайти: " },
                    { link: { action: "go_office", text: "офис администрации" } },
                    { text: "." }
                ]
            }
        ],
        actions: [
            {
                id: "return_street",
                type: "back",
                label: "Выйти из университета",
                hint: "Вернуться в центр",
                effects: [{ type: "move", to: "center" }]
            },
            {
                id: "hinako_talk",
                type: "link",
                label: "Поговорить с Хинако",
                hint: "Начать разговор",
                condition: {
                    all: [
                        { timeBetween: { from: 8 * 60, to: 14 * 60 } },
                        { variableDiffers: { name: "lastHinakoDay", other: "day" } }
                    ]
                },
                effects: [
                    { type: "setVariableFromVariable", name: "lastHinakoDay", from: "day" }
                ],
                dialogue: "hinako"
            },
            {
                id: "go_office",
                type: "link",
                label: "Офис администрации",
                hint: "Стипендия и документы",
                condition: { timeBetween: { from: 8 * 60, to: 18 * 60 } },
                dialogue: "secretary"
            },
            {
                id: "look_hall",
                label: "Осмотреть холл",
                hint: "Изучить доску объявлений",
                iconImage: "assets/images/actions/look.png",
                effects: [{ type: "setFlag", flag: "sawNoticeboard", value: true }],
                text: "На доске объявлений висят расписание и афиша студенческого клуба.",
                image: "assets/images/locations/university-hall.jpg"
            },
            {
                id: "attend_class",
                label: "Посетить занятие",
                hint: "Один раз в день · нужен блокнот",
                iconImage: "assets/images/items/notebook.png",
                minutes: 90,
                condition: {
                    all: [
                        { item: "notebook" },
                        { variableDiffers: { name: "lastClassDay", other: "day" } }
                    ]
                },
                effects: [
                    { type: "setVariableFromVariable", name: "lastClassDay", from: "day" },
                    { type: "changeVariable", name: "classesAttended", amount: 1 },
                    { type: "changeVariable", name: "pendingStipend", amount: 200 }
                ],
                text: "Ты заходишь в аудиторию и проводишь полтора часа на занятии.",
                image: "assets/images/locations/university-classroom.jpg"
            },
            {
                id: "look_orders",
                label: "Искать заказы",
                hint: "Найти студенческую работу на заказ",
                iconImage: "assets/images/actions/money.png",
                minutes: 30,
                condition: {
                    all: [
                        { variableDiffers: { name: "lastOrderDay", other: "day" } },
                        { not: { flag: "hasActiveOrder" } }
                    ]
                },
                effects: [
                    { type: "setVariableFromVariable", name: "lastOrderDay", from: "day" }
                ],
                variants: [
                    {
                        text: "Ты обходишь доски объявлений, но ничего подходящего не находишь."
                    },
                    {
                        effects: [
                            { type: "setFlag", flag: "hasActiveOrder", value: true }
                        ],
                        text: "Тебе попадается заказ на реферат. Работы на час — заплатить обещают 300 ¥. Выполнить можно в библиотеке."
                    }
                ]
            },
            {
                id: "go_library",
                label: "Пойти в библиотеку",
                hint: "Тишина, книги и заказы",
                condition: { locationOpen: "library" },
                effects: [{ type: "move", to: "library" }]
            },
            {
                id: "go_gym",
                label: "Пойти в спортзал",
                hint: "Размяться и стать выносливее",
                condition: { locationOpen: "gym" },
                effects: [{ type: "move", to: "gym" }]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    university: ["center", "library", "gym"]
});