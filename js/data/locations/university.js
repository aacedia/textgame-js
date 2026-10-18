Object.assign(window.GAME_DATA.locations, {
    university: {
        name: "Университет", tag: "Учёба",
        hours: { from: 8 * 60, to: 20 * 60 },
        closedWeekdays: [5, 6],
        defaultExit: "street",
        image: "assets/images/locations/university.jpg",
        description: [
            "Перед тобой главное здание университета. У входа собрались студенты, а из открытых окон доносится гул голосов.",
            "До начала занятий ещё есть время. Можно осмотреть холл или вернуться на улицу."
        ],
        actions: [
            {
                id: "return_street",
                label: "Выйти на улицу",
                hint: "Вернуться к перекрёстку",
                effects: [{ type: "move", to: "street" }]
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
                        { not: { flag: "hasActiveOrder" } },
                        { variableDiffers: { name: "lastOrderDay", other: "day" } }
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
                            { type: "setFlag", flag: "hasActiveOrder", value: true },
                            { type: "setFlag", flag: "orderSize", value: 1 },
                            { type: "setFlag", flag: "orderReward", value: 100 },
                            { type: "setFlag", flag: "orderName", value: "Небольшой реферат" }
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
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    university: ["street", "library"]
});