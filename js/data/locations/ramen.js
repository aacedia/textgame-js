Object.assign(window.GAME_DATA.locations, {
    ramen: {
        name: "Раменная", tag: "Горячая лапша",
        hours: { from: 11 * 60, to: 4 * 60 },
        defaultExit: "glitch-street",
        image: "assets/images/locations/ramen.jpg",
        imageAlt: "Небольшая раменная с барной стойкой",
        description: [
            "Маленькая раменная с барной стойкой и запахом бульона. За стойкой — пожилой повар, который ловко орудует половником. На стенах — фотографии довольных посетителей.",
            "Здесь можно поесть горячей лапши или просто выпить чаю."
        ],
        actions: [
            {
                id: "ramen_eat",
                label: "Съесть рамен",
                hint: "80 ¥ · снимает голод и жажду",
                minutes: 30,
                condition: { variableAtLeast: { name: "money", value: 80 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -80 },
                    { type: "changeVariable", name: "mood", amount: 5 }
                ],
                reduceAfterTime: { hunger: 80, thirst: 30 },
                text: "Ты заказываешь рамен. Повар ставит перед тобой дымящуюся миску. Ты ешь не спеша, наслаждаясь вкусом.",
                image: "assets/images/locations/ramen-eat.jpg"
            },
            {
                id: "ramen_tea",
                label: "Выпить чаю",
                hint: "20 ¥ · снимает жажду",
                minutes: 10,
                condition: { variableAtLeast: { name: "money", value: 20 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -20 }
                ],
                restoreAfterTime: { thirst: 0 },
                text: "Ты берёшь чашку зелёного чая и неспешно пьёшь, глядя на улицу через окно.",
                image: "assets/images/locations/ramen-tea.jpg"
            },
            {
                id: "ramen_return",
                type: "back",
                label: "Выйти на улицу",
                hint: "Вернуться на Глитч-стрит",
                effects: [{ type: "move", to: "glitch-street" }]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    ramen: ["glitch-street"]
});