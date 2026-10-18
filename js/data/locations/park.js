Object.assign(window.GAME_DATA.locations, {
    park: {
        name: "Парк", tag: "Зелёная зона",
        hours: { from: 6 * 60, to: 23 * 60 },
        defaultExit: "street",
        image: "assets/images/locations/park.jpg",
        imageAlt: "Городской парк с аллеями и деревьями",
        description: [
            "Большой городской парк раскинулся между улицами. Вдоль аллей стоят скамейки, в кронах деревьев шумит ветер, где-то играют дети.",
            "Здесь можно спокойно прогуляться, отдохнуть от суеты и собраться с мыслями."
        ],
        actions: [
            {
                id: "walk_park",
                label: "Прогуляться по парку",
                hint: "Проходит 30 минут",
                minutes: 30,
                effects: [],
                reduceAfterTime: { fatigue: 2, hunger: 4, thirst: 2 },
                text: "Ты неспешно идёшь по аллее, вдыхая свежий воздух и слушая птиц. На душе становится спокойнее.",
                image: "assets/images/locations/park-walk.jpg"
            },
            {
                id: "park_look_around",
                label: "Осмотреться",
                hint: "Понаблюдать за людьми",
                effects: [{ type: "setFlag", flag: "lookedAroundPark", value: true }],
                text: "Ты оглядываешь людей, гуляющих по парку.",
                image: "assets/images/locations/park-look.jpg"
            },
            {
                id: "park_return_street",
                label: "Выйти на улицу",
                hint: "Вернуться к перекрёстку",
                effects: [{ type: "move", to: "street" }]
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    park: ["street"]
});