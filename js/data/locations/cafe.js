Object.assign(window.GAME_DATA.locations, {
    cafe: {
        name: "Кафе", tag: "Уютное место",
        hours: { from: 8 * 60, to: 23 * 60 },
        defaultExit: "center",
        image: "assets/images/locations/cafe.jpg",
        description: [
            "Небольшое кафе неподалёку от перекрёстка. У окна свободный столик, за стойкой скучает бариста.",
            "Здесь можно перекусить, а если повезёт — подработать пару часов за стойкой."
        ],
        extraDescription: [
            {
                condition: {
                    all: [
                        { timeBetween: { from: 8 * 60, to: 14 * 60 } },
                        { variableDiffers: { name: "lastRinDay", other: "day" } }
                    ]
                },
                parts: [
                    { text: "За столиком у окна сидит " },
                    { link: { action: "rin_talk", text: "Рин" } },
                    { text: " с ноутбуком — печатает быстро и нервно." }
                ]
            },
            {
                condition: {
                    all: [
                        { timeBetween: { from: 8 * 60, to: 14 * 60 } },
                        { not: { variableDiffers: { name: "lastRinDay", other: "day" } } }
                    ]
                },
                text: "За столиком у окна сидит Рин с ноутбуком. Ты уже говорил с ней сегодня."
            }
        ],
        actions: [
            {
                id: "cafe_return_street",
                type: "back",
                label: "Выйти из кафе",
                hint: "Вернуться в центр",
                effects: [{ type: "move", to: "center" }]
            },
            {
                id: "drink_at_cafe",
                label: "Выпить кофе",
                hint: "25 ¥ · −8 усталости · +12 выносливости",
                iconImage: "assets/images/actions/coffee.png",
                minutes: 15,
                condition: { variableAtLeast: { name: "money", value: 25 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -25 },
                    { type: "changeVariable", name: "stamina", amount: 12 }
                ],
                reduceAfterTime: { fatigue: 8 },
                restoreAfterTime: { thirst: 0 },
                text: "Ты берёшь чашку кофе и устраиваешься у окна.",
                image: "assets/images/locations/cafe-coffee.jpg"
            },
            {
                id: "eat_at_cafe",
                label: "Поесть в кафе",
                hint: "70 ¥ · снимает голод",
                iconImage: "assets/images/actions/eat.png",
                minutes: 40,
                condition: { variableAtLeast: { name: "money", value: 70 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -70 }
                ],
                reduceAfterTime: { hunger: 60, thirst: 30 },
                text: "Ты заказываешь горячий обед и не спеша ешь.",
                image: "assets/images/locations/cafe-food.jpg"
            },
            {
                id: "work_shift",
                label: "Подработать",
                hint: "3 часа · +150 ¥ и чаевые · −30 выносливости",
                iconImage: "assets/images/actions/money.png",
                minutes: 180,
                condition: {
                    all: [
                        { variableDiffers: { name: "lastShiftDay", other: "day" } },
                        { variableAtLeast: { name: "stamina", value: 30 } }
                    ]
                },
                effects: [
                    { type: "changeVariable", name: "money", amount: 150 },
                    { type: "changeVariable", name: "stamina", amount: -30 },
                    { type: "changeVariable", name: "fatigue", amount: 20 },
                    { type: "changeVariable", name: "hunger", amount: 15 },
                    { type: "changeVariable", name: "thirst", amount: 15 },
                    { type: "setVariableFromVariable", name: "lastShiftDay", from: "day" },
                    { type: "addRandomMoney", min: 0, max: 120, step: 10, label: "Чаевые" }
                ],
                text: "Ты отрабатываешь смену за стойкой: принимаешь заказы, вытираешь столы, улыбаешься гостям. В конце получаешь оплату и чаевые.",
                image: "assets/images/locations/cafe-work.jpg"
            },
            {
                id: "rin_talk",
                type: "link",
                label: "Поговорить с Рин",
                hint: "Начать разговор",
                condition: {
                    all: [
                        { timeBetween: { from: 8 * 60, to: 14 * 60 } },
                        { variableDiffers: { name: "lastRinDay", other: "day" } }
                    ]
                },
                effects: [
                    { type: "setVariableFromVariable", name: "lastRinDay", from: "day" }
                ],
                dialogue: "rin"
            },
            {
                id: "look_around_cafe",
                label: "Осмотреться",
                hint: "Понаблюдать за гостями",
                iconImage: "assets/images/actions/look.png",
                effects: [{ type: "setFlag", flag: "lookedAroundCafe", value: true }],
                text: "За соседним столиком пара обсуждает планы на вечер, у окна студент листает конспекты.",
                image: "assets/images/locations/cafe-inside.jpg"
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    cafe: ["center"]
});