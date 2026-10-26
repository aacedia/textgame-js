Object.assign(window.GAME_DATA.locations, {
    gym: {
        name: "Спортзал", tag: "Тренировки",
        hours: { from: 8 * 60, to: 20 * 60 },
        closedWeekdays: [5, 6],
        defaultExit: "center",
        image: "assets/images/locations/gym.jpg",
        imageAlt: "Университетский спортзал с тренажёрами",
        description: [
            "Просторный зал с тренажёрами, штангами и беговыми дорожками. В углу — маты для растяжки, у стены — зеркала.",
            "Здесь можно как следует размяться и стать выносливее."
        ],
        extraDescription: [
            {
                condition: {
                    all: [
                        { timeBetween: { from: 13 * 60, to: 21 * 60 } },
                        { variableDiffers: { name: "lastNikoDay", other: "day" } }
                    ]
                },
                parts: [
                    { text: "У шведской стенки разминается " },
                    { link: { action: "niko_talk", text: "Нико" } },
                    { text: " — спортивная девушка с полотенцем на плече." }
                ]
            },
            {
                condition: {
                    all: [
                        { timeBetween: { from: 13 * 60, to: 21 * 60 } },
                        { not: { variableDiffers: { name: "lastNikoDay", other: "day" } } }
                    ]
                },
                text: "У шведской стенки разминается Нико. Ты уже говорил с ней сегодня."
            }
        ],
        actions: [
            {
                id: "gym_return_university",
                type: "back",
                label: "Вернуться в университет",
                hint: "Назад в главное здание",
                effects: [{ type: "move", to: "university" }]
            },
            {
                id: "niko_talk",
                type: "link",
                label: "Поговорить с Нико",
                hint: "Начать разговор",
                condition: {
                    all: [
                        { timeBetween: { from: 13 * 60, to: 21 * 60 } },
                        { variableDiffers: { name: "lastNikoDay", other: "day" } }
                    ]
                },
                effects: [
                    { type: "setVariableFromVariable", name: "lastNikoDay", from: "day" }
                ],
                dialogue: "niko"
            },
            {
                id: "train_at_gym",
                label: "Тренироваться",
                hint: "1 час · +5 к максимуму выносливости · −20 выносливости",
                iconImage: "assets/images/actions/training.png",
                minutes: 60,
                condition: {
                    all: [
                        { variableDiffers: { name: "lastTrainDay", other: "day" } },
                        { variableAtLeast: { name: "stamina", value: 20 } },
                        { not: { variableAtLeast: { name: "staminaMax", value: 100 } } }
                    ]
                },
                effects: [
                    { type: "changeVariable", name: "staminaMax", amount: 5 },
                    { type: "changeVariable", name: "stamina", amount: -20 },
                    { type: "changeVariable", name: "hunger", amount: 15 },
                    { type: "changeVariable", name: "thirst", amount: 10 },
                    { type: "changeVariable", name: "fatigue", amount: 10 },
                    { type: "changeVariable", name: "mood", amount: 5 },
                    { type: "setVariableFromVariable", name: "lastTrainDay", from: "day" }
                ],
                text: "Ты тренируешься: отжимания, приседания, работа с гантелями, растяжка. К концу часа чувствуешь приятную усталость и прилив сил.",
                image: "assets/images/locations/gym-workout.jpg"
            },
            {
                id: "play_volleyball",
                label: "Играть в волейбол",
                hint: "Проходит 1 час · +10 настроения",
                minutes: 60,
                effects: [
                    { type: "changeVariable", name: "mood", amount: 10 },
                    { type: "changeVariable", name: "hunger", amount: 3 },
                    { type: "changeVariable", name: "thirst", amount: 5 }
                ],
                text: "Ты присоединяешься к игре в волейбол. Мяч летает над сеткой, азарт захватывает, и час проходит незаметно. После игры чувствуешь приятную усталость и подъём настроения.",
                image: "assets/images/locations/gym-volleyball.jpg"
            },
            {
                id: "gym_look_around",
                label: "Осмотреться",
                hint: "Понаблюдать за тренирующимися",
                iconImage: "assets/images/actions/look.png",
                effects: [{ type: "setFlag", flag: "lookedAroundGym", value: true }],
                text: "Пара студентов качают руки, кто-то бежит на дорожке, в углу девушка тянется на мате. Атмосфера рабочая."
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    gym: ["university"]
});