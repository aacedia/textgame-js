Object.assign(window.GAME_DATA.locations, {
    apartment: {
        name: "Квартира", tag: "Безопасное место",
        image: "assets/images/locations/apartment.jpg",
        description: [
            "Небольшая, но уютная квартира."
        ],
        extraDescription: [
            {
                condition: { variableAtLeast: { name: "foodPortions", value: 1 } },
                text: "В шкафу есть продукты. Хватит ещё на {foodPortions} приёмов пищи."
            },
            {
                condition: { variableEquals: { name: "foodPortions", value: 0 } },
                text: "Продукты закончились. Стоит зайти в магазин."
            },
            {
                condition: { flag: "tvAtHome" },
                text: "В углу комнаты стоит новый телевизор — можно скоротать вечер за просмотром."
            }
        ],
        actions: [
            {
                id: "leave_home",
                type: "back",
                label: "Выйти на улицу",
                hint: "Отправиться в город",
                condition: { item: "keys" },
                effects: [{ type: "move", to: "residential" }]
            },
            {
                id: "inspect_table",
                label: "Осмотреть стол",
                hint: "Проверить, всё ли на месте",
                effects: [
                    { type: "setFlag", flag: "hasInspectedTable", value: true },
                    { type: "giveItem", item: "keys" }
                ],
                once: true,
                text: "На столе лежат ключи. Ты убираешь их в карман."
            },
            {
                id: "watch_tv",
                label: "Смотреть телевизор",
                hint: "Проходит 1 час · +35 настроения · +8 усталости",
                iconImage: "assets/images/actions/tv.png",
                minutes: 60,
                condition: {
                    all: [
                        { flag: "tvAtHome" },
                        { variableDiffers: { name: "lastTvDay", other: "day" } }
                    ]
                },
                hiddenWhen: { not: { flag: "tvAtHome" } },
                effects: [
                    { type: "changeVariable", name: "mood", amount: 35 },
                    { type: "changeVariable", name: "fatigue", amount: 8 },
                    { type: "setVariableFromVariable", name: "lastTvDay", from: "day" }
                ],
                text: "Ты устраиваешься перед телевизором и неспешно смотришь передачу. Время летит незаметно.",
                image: "assets/images/locations/apartment-tv.jpg"
            },
            {
                id: "sleep",
                type: "choice",
                label: "Лечь спать",
                hint: "Выбрать, сколько спать",
                icon: "🛏️",
                iconImage: "assets/images/actions/sleep.png",
                image: "assets/images/locations/apartment-sleep.jpg",
                choices: [
                    { label: "1 час", minutes: 60 },
                    { label: "2 часа", minutes: 120 },
                    { label: "4 часа", minutes: 240 },
                    { label: "6 часов", minutes: 360 },
                    { label: "8 часов", minutes: 480 },
                    { label: "10 часов", minutes: 600 },
                    { label: "12 часов", minutes: 720 }
                ]
            },
            {
                id: "rest",
                label: "Немного отдохнуть",
                hint: "Проходит 15 минут · −3 усталости",
                iconImage: "assets/images/actions/rest.png",
                minutes: 15,
                effects: [],
                reduceAfterTime: { fatigue: 3, hunger: 2, thirst: 1 },
                text: "Ты ненадолго присаживаешься и собираешься с мыслями.",
                image: "assets/images/locations/apartment-rest.jpg"
            },
            {
                id: "take_shower",
                label: "Принять душ",
                hint: "Проходит 15 минут · −8 усталости · +8 выносливости · +12 настроения",
                iconImage: "assets/images/actions/shower.png",
                minutes: 15,
                condition: {
                    variableDiffers: { name: "lastShowerDay", other: "day" }
                },
                effects: [
                    { type: "changeVariable", name: "stamina", amount: 8 },
                    { type: "changeVariable", name: "mood", amount: 12 },
                    { type: "setVariableFromVariable", name: "lastShowerDay", from: "day" }
                ],
                reduceAfterTime: { fatigue: 8 },
                text: "Ты встаёшь под душ, и тёплые струи воды смывают усталость. Голова проясняется, настроение улучшается.",
                image: "assets/images/locations/apartment-shower.jpg"
            },
            {
                id: "eat_at_home",
                label: "Поесть",
                hint: "Снимает голод · нужны продукты",
                iconImage: "assets/images/actions/eat.png",
                minutes: 30,
                condition: { variableAtLeast: { name: "foodPortions", value: 1 } },
                effects: [
                    { type: "changeVariable", name: "foodPortions", amount: -1 }
                ],
                reduceAfterTime: { hunger: 60 },
                text: "Ты готовишь простой ужин и ешь. Голод отступает.",
                image: "assets/images/locations/apartment-rest.jpg"
            },
            {
                id: "drink_at_home",
                label: "Попить",
                hint: "Снимает жажду",
                iconImage: "assets/images/actions/drink.png",
                minutes: 5,
                effects: [],
                restoreAfterTime: { thirst: 0 },
                text: "Ты выпиваешь стакан воды.",
                image: "assets/images/locations/apartment-rest.jpg"
            }
        ]
    }
});

Object.assign(window.GAME_DATA.links, {
    apartment: ["residential"]
});