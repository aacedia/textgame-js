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
                id: "work_on_order",
                label: "Выполнить заказ",
                hint: "Завершить взятую работу",
                condition: { flag: "hasActiveOrder" },
                skipTime: true,
                effects: [{ type: "completeOrder" }],
                text: "Ты садишься за стол, раскладываешь материалы и работаешь над заказом. Когда всё готово, ты получаешь оплату.",
                image: "assets/images/locations/library-books.jpg"
            },
            {
                id: "read_books",
                label: "Почитать книги",
                hint: "Проходит 30 минут",
                minutes: 30,
                text: "Ты берёшь с полки книгу и неспешно читаешь.",
                image: "assets/images/locations/library-books.jpg"
            },
            {
                id: "library_return_university",
                label: "Вернуться в университет",
                hint: "Назад в главное здание",
                effects: [{ type: "move", to: "university" }]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    library: ["university"]
});