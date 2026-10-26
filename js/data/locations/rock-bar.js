Object.assign(window.GAME_DATA.locations, {
    "rock-bar": {
        name: "Рок-бар", tag: "Живая музыка",
        hours: { from: 18 * 60, to: 6 * 60 },
        closedWeekdays: [0, 1, 2, 3, 4],
        defaultExit: "glitch-street",
        image: "assets/images/locations/rock-bar.jpg",
        imageAlt: "Тёмный бар со сценой и неоновой вывеской",
        description: [
            "Полутёмный бар на Глитч-стрит. На сцене — усилители и барабанная установка, у стойки — пара посетителей. По выходным здесь играют рок-концерты.",
            "Вход на концерт — 150 ¥. Выступают NEON REQUIEM, IRON LOTUS, PAPER TIGERS и LUNAR DRIFT."
        ],
        actions: [
            {
                id: "rock_bar_return",
                type: "back",
                label: "Выйти на улицу",
                hint: "Вернуться на Глитч-стрит",
                effects: [{ type: "move", to: "glitch-street" }]
            },
            {
                id: "rock_concert",
                label: "Пойти на концерт",
                hint: "150 ¥ · 2 часа · +30 настроения",
                iconImage: "assets/images/actions/rock.png",
                minutes: 120,
                condition: { variableAtLeast: { name: "money", value: 150 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -150 },
                    { type: "changeVariable", name: "mood", amount: 30 },
                    { type: "changeVariable", name: "stamina", amount: -10 },
                    { type: "changeVariable", name: "hunger", amount: 5 },
                    { type: "changeVariable", name: "thirst", amount: 10 }
                ],
                variants: [
                    {
                        effects: [{ type: "setFlag", flag: "seen_neon_requiem", value: true }],
                        text: "На сцене — NEON REQUIEM. Плотный синтетический рок с ревущими гитарами и холодным вокалом. Толпа качается в такт, свет режет темноту.",
                        image: "assets/images/locations/rock-bar-neon.jpg"
                    },
                    {
                        effects: [{ type: "setFlag", flag: "seen_iron_lotus", value: true }],
                        text: "Играет IRON LOTUS. Тяжёлый, медленный грув, низкий строй, длинные соляки. Бар дрожит от баса. Под конец группа выкладывается так, что уши закладывает ещё минуту после финала.",
                        image: "assets/images/locations/rock-bar-iron.jpg"
                    },
                    {
                        effects: [{ type: "setFlag", flag: "seen_paper_tigers", value: true }],
                        text: "На сцене — PAPER TIGERS. Быстрый панк: короткие песни, крик, прыжки. Публика слэмит у сцены, кто-то теряет кепку. Заряд агрессии и веселья на весь вечер.",
                        image: "assets/images/locations/rock-bar-paper.jpg"
                    },
                    {
                        effects: [{ type: "setFlag", flag: "seen_lunar_drift", value: true }],
                        text: "Играет LUNAR DRIFT. Мрачный пост-рок с длинными инструментальными частями. Свет приглушён, зал стоит, затаив дыхание. Музыка уносит куда-то далеко — настроение поднимается само собой.",
                        image: "assets/images/locations/rock-bar-lunar.jpg"
                    }
                ]
            },
            {
                id: "rock_bar_look_around",
                label: "Осмотреться",
                hint: "Понаблюдать за публикой",
                iconImage: "assets/images/actions/look.png",
                effects: [{ type: "setFlag", flag: "lookedAroundRockBar", value: true }],
                text: "У стойки пара обсуждает вчерашний концерт, у сцены техник проверяет кабели. На стене — афиши прошедших групп.",
                image: "assets/images/locations/rock-bar-inside.jpg"
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    "rock-bar": ["glitch-street"]
});