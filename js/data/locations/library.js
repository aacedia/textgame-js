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
        extraDescription: [
            {
                condition: {
                    all: [
                        { timeBetween: { from: 10 * 60, to: 20 * 60 } },
                        { variableDiffers: { name: "lastRitsuDay", other: "day" } }
                    ]
                },
                parts: [
                    { text: "За дальним столом у окна сидит " },
                    { link: { action: "ritsu_talk", text: "Рицу" } },
                    { text: " с блокнотом — кажется, он пишет." }
                ]
            },
            {
                condition: { variableEquals: { name: "orderType", value: "easy" } },
                text: "У тебя висит обычный заказ на реферат — можно сесть за работу."
            },
            {
                condition: { variableEquals: { name: "orderType", value: "hard" } },
                text: "У тебя срочный заказ на курсовую. Работы на 2 часа, и лучше не откладывать."
            },
            {
                condition: { variableEquals: { name: "orderType", value: "creative" } },
                text: "У тебя заказ от студенческого клуба — подобрать музыку для вечеринки."
            }
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
                id: "work_easy",
                label: "Написать реферат",
                hint: "1 час · +60 ¥ · −10 выносливости",
                iconImage: "assets/images/actions/money.png",
                minutes: 60,
                hiddenWhen: { not: { variableEquals: { name: "orderType", value: "easy" } } },
                condition: { variableAtLeast: { name: "stamina", value: 10 } },
                effects: [
                    { type: "changeVariable", name: "stamina", amount: -10 },
                    { type: "changeVariable", name: "money", amount: 60 },
                    { type: "setVariable", name: "orderType", value: null }
                ],
                text: "Ты садишься за стол, раскладываешь материалы и работаешь над рефератом. Когда всё готово, ты получаешь оплату."
            },
            {
                id: "work_hard",
                label: "Сверстать курсовую",
                hint: "2 часа · +200 ¥ · −40 выносливости · риск для здоровья",
                iconImage: "assets/images/actions/money.png",
                minutes: 120,
                hiddenWhen: { not: { variableEquals: { name: "orderType", value: "hard" } } },
                condition: { variableAtLeast: { name: "stamina", value: 40 } },
                effects: [
                    { type: "changeVariable", name: "stamina", amount: -40 },
                    { type: "changeVariable", name: "money", amount: 200 },
                    { type: "setVariable", name: "orderType", value: null }
                ],
                reduceAfterTime: { fatigue: 15 },
                variants: [
                    {
                        condition: { variableAtLeast: { name: "fatigue", value: 60 } },
                        effects: [
                            { type: "changeVariable", name: "health", amount: -10 }
                        ],
                        text: "Ты садишься за курсовую, но глаза слипаются. К концу второго часа ты едва держишься — работа готова, но здоровье подводит. Заказчик платит, ты получаешь 200 ¥, но чувствуешь себя разбитым."
                    },
                    {
                        text: "Ты садишься за курсовую. Два часа напряжённой работы — и всё готово. Заказчик доволен, ты получаешь 200 ¥."
                    }
                ]
            },
            {
                id: "work_creative",
                label: "Подобрать музыку",
                hint: "1 час · +100 ¥ · −10 выносливости · +5 настроения",
                iconImage: "assets/images/actions/money.png",
                minutes: 60,
                hiddenWhen: { not: { variableEquals: { name: "orderType", value: "creative" } } },
                condition: { variableAtLeast: { name: "stamina", value: 10 } },
                effects: [
                    { type: "changeVariable", name: "stamina", amount: -10 },
                    { type: "changeVariable", name: "money", amount: 100 },
                    { type: "changeVariable", name: "mood", amount: 5 },
                    { type: "setVariable", name: "orderType", value: null }
                ],
                text: "Ты листаешь треки, подбираешь подходящие под настроение вечеринки, собираешь плейлист. Работа в радость — клуб платит 100 ¥ и обещает позвать на вечеринку."
            },
            {
                id: "ritsu_talk",
                type: "link",
                label: "Поговорить с Рицу",
                hint: "Начать разговор",
                condition: {
                    all: [
                        { timeBetween: { from: 10 * 60, to: 20 * 60 } },
                        { variableDiffers: { name: "lastRitsuDay", other: "day" } }
                    ]
                },
                effects: [
                    { type: "setVariableFromVariable", name: "lastRitsuDay", from: "day" }
                ],
                dialogue: "ritsu"
            },
            {
                id: "read_books",
                label: "Почитать книги",
                hint: "30 минут · +12 настроения · −2 выносливости · +3 усталости",
                minutes: 30,
                text: "Ты берёшь с полки книгу и неспешно читаешь.",
                image: "assets/images/locations/library-books.jpg",
                effects: [
                    { type: "changeVariable", name: "mood", amount: 12 },
                    { type: "changeVariable", name: "stamina", amount: -2 },
                    { type: "changeVariable", name: "fatigue", amount: 3 }
                ]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    library: ["university"]
});