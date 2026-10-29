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
                condition: { timeBetween: { from: 8 * 60, to: 18 * 60 } },
                parts: [
                    { text: "В конце коридора — дверь с табличкой «Офис администрации». Можно зайти: " },
                    { link: { action: "go_office", text: "офис администрации" } },
                    { text: "." }
                ]
            },
            {
                condition: {
                    all: [
                        { variableEquals: { name: "orderType", value: "easy" } },
                        { not: { locationOpen: "library" } }
                    ]
                },
                text: "У тебя висит обычный заказ, а библиотека уже закрыта. Придётся ждать до завтра."
            },
            {
                condition: {
                    all: [
                        { variableEquals: { name: "orderType", value: "hard" } },
                        { not: { locationOpen: "library" } }
                    ]
                },
                text: "Срочный заказ горит, а библиотека закрыта. Заказчик будет недоволен."
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
                    { type: "gradeClass" }
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
                        { variableEquals: { name: "orderType", value: null } }
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
                            { type: "setVariable", name: "orderType", value: "easy" }
                        ],
                        text: "Тебе попадается обычный заказ: реферат на 1 час работы. Заплатят 60 ¥. Выполнить можно в библиотеке."
                    },
                    {
                        condition: { variableAtLeast: { name: "stamina", value: 40 } },
                        effects: [
                            { type: "setVariable", name: "orderType", value: "hard" }
                        ],
                        text: "Срочный заказ: нужно сверстать курсовую к утру. Работы на 2 часа, но платят 200 ¥. Если не хватит сил — придётся доплатить здоровьем. Выполнить можно в библиотеке."
                    },
                    {
                        condition: { item: "mp3_player" },
                        effects: [
                            { type: "setVariable", name: "orderType", value: "creative" }
                        ],
                        text: "Необычный заказ: студенческий клуб ищет того, кто подберёт музыку для вечеринки. У тебя как раз есть плеер — работы на 1 час, платят 100 ¥. Выполнить можно в библиотеке."
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