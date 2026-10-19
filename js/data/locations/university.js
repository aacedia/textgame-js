Object.assign(window.GAME_DATA.locations, {
    university: {
        name: "Университет", tag: "Учёба",
        hours: { from: 8 * 60, to: 20 * 60 },
        closedWeekdays: [5, 6],
        defaultExit: "street",
        image: "assets/images/locations/university.jpg",
        description: [
            "Главное здание университета. У входа собрались студенты."
        ],
        actions: [
            {
                id: "return_street",
                label: "Выйти из университета",
                hint: "Вернуться в центр",
                effects: [{ type: "move", to: "center" }]
            },
            {
                id: "look_hall",
                label: "Осмотреть холл",
                hint: "Изучить доску объявлений",
                effects: [{ type: "setFlag", flag: "sawNoticeboard", value: true }],
                text: "На доске объявлений висят расписание и афиша студенческого клуба.",
                image: "assets/images/locations/university-hall.jpg"
            },
            {
                id: "attend_class",
                label: "Посетить занятие",
                hint: "Один раз в день · нужен блокнот",
                minutes: 90,
                condition: {
                    all: [
                        { item: "notebook" },
                        { variableDiffers: { name: "lastClassDay", other: "day" } }
                    ]
                },
                effects: [
                    { type: "setVariableFromVariable", name: "lastClassDay", from: "day" },
                    { type: "changeVariable", name: "classesAttended", amount: 1 }
                ],
                text: "Ты заходишь в аудиторию и проводишь полтора часа на занятии.",
                image: "assets/images/locations/university-classroom.jpg"
            },
            {
                id: "look_orders",
                label: "Искать заказы",
                hint: "Найти студенческую работу на заказ",
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
                        text: "Тебе попадается заказ на реферат. Работы на час — заплатить обещают 100 ₽. Выполнить можно в библиотеке."
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