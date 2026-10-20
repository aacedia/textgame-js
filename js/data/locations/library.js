Object.assign(window.GAME_DATA.locations, {
    library: {
        name: "Библиотека", tag: "Тишина и книги",
        hours: { from: 8 * 60, to: 20 * 60 },
        closedWeekdays: [5, 6],
        defaultExit: "university",
        image: "assets/images/locations/library.jpg",
        description: [
            "Просторный читальный зал университетской библиотеки. Вдоль стен — стеллажи с книгами, за столами тихо скрипят ручки.",
            "Здесь хорошо работается: никто не отвлекает, а нужные материалы всегда под рукой."
        ],
        actions: [
            {
                id: "library_return_university",
                type: "back",
                label: "Вернуться в университет",
                hint: "Назад в главное здание",
                effects: [{ type: "move", to: "university" }]
            },
            {
                id: "work_on_order",
                label: "Выполнить заказ",
                hint: "1 час · +100 ¥ · −10 выносливости",
                minutes: 60,
                condition: {
                    all: [
                        { flag: "hasActiveOrder" },
                        { variableAtLeast: { name: "stamina", value: 10 } }
                    ]
                },
                effects: [
                    { type: "changeVariable", name: "stamina", amount: -10 },
                    { type: "changeVariable", name: "money", amount: 100 },
                    { type: "setFlag", flag: "hasActiveOrder", value: false }
                ],
                text: "Ты садишься за стол, раскладываешь материалы и работаешь над заказом. Когда всё готово, ты получаешь оплату."
            },
            {
                id: "read_books",
                label: "Почитать книги",
                hint: "Проходит 30 минут · +5 настроения",
                minutes: 30,
                text: "Ты берёшь с полки книгу и неспешно читаешь.",
                image: "assets/images/locations/library-books.jpg",
                effects: [{ type: "changeVariable", name: "mood", amount: 5 },]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    library: ["university"]
});