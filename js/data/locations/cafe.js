Object.assign(window.GAME_DATA.locations, {
    cafe: {
        name: "Кафе", tag: "Уютное место",
        hours: { from: 8 * 60, to: 23 * 60 },
        defaultExit: "street",
        image: "assets/images/locations/cafe.jpg",
        description: [
            "Небольшое кафе неподалёку от перекрёстка. У окна свободный столик, за стойкой скучает бариста.",
            "Здесь можно перекусить, а если повезёт — подработать пару часов за стойкой."
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
                hint: "20 ¥ · -10 усталости · +20 выносливости · +10 настроения",
                minutes: 15,
                condition: { variableAtLeast: { name: "money", value: 20 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -20 },
                    { type: "changeVariable", name: "stamina", amount: 20 },
                    { type: "changeVariable", name: "mood", amount: 10 }
                ],
                reduceAfterTime: { fatigue: 10 },
                restoreAfterTime: { thirst: 0 },
                text: "Ты берёшь чашку кофе и устраиваешься у окна.",
                image: "assets/images/locations/cafe-coffee.jpg"
            },
            {
                id: "eat_at_cafe",
                label: "Поесть в кафе",
                hint: "50 ¥ · снимает голод · +25 настроения",
                minutes: 40,
                condition: { variableAtLeast: { name: "money", value: 50 } },
                effects: [
                    { type: "changeVariable", name: "money", amount: -50 },
                    { type: "changeVariable", name: "mood", amount: 25 }
                ],
                reduceAfterTime: { hunger: 80 },
                text: "Ты заказываешь горячий обед и не спеша ешь.",
                image: "assets/images/locations/cafe-food.jpg"
            },
            {
                id: "work_shift",
                label: "Подработать",
                hint: "3 часа · +100 ¥ и чаевые · −30 выносливости",
                minutes: 180,
                condition: {
                    all: [
                        { variableDiffers: { name: "lastShiftDay", other: "day" } },
                        { variableAtLeast: { name: "stamina", value: 30 } }
                    ]
                },
                effects: [
                    { type: "changeVariable", name: "money", amount: 100 },
                    { type: "changeVariable", name: "stamina", amount: -30 },
                    { type: "setVariableFromVariable", name: "lastShiftDay", from: "day" },
                    { type: "addRandomMoney", min: 0, max: 400, step: 1, label: "Чаевые" }
                ],
                text: "Ты отрабатываешь смену за стойкой: принимаешь заказы, вытираешь столы, улыбаешься гостям. В конце получаешь оплату и чаевые.",
                image: "assets/images/locations/cafe-work.jpg"
            },
            {
                id: "look_around_cafe",
                label: "Осмотреться",
                hint: "Понаблюдать за гостями",
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