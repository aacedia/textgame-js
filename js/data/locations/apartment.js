Object.assign(window.GAME_DATA.locations, {
    apartment: {
        name: "Квартира", tag: "Безопасное место",
        image: "assets/images/locations/apartment.jpg",
        description: [
            "Небольшая, но уютная квартира. Утренний свет пробивается сквозь занавески, а на столе лежат ключи и телефон.",
            "Сегодня предстоит выбраться в город. Можно выйти на улицу или немного осмотреться перед дорогой."
        ],
        actions: [
            {
                id: "inspect_table",
                label: "Осмотреть стол",
                hint: "Проверить, всё ли на месте",
                effects: [
                    { type: "setFlag", flag: "hasInspectedTable", value: true },
                    { type: "giveItem", item: "keys" }
                ],
                once: true,
                text: "На столе лежат ключи. Ты убираешь их в карман.",
                image: "assets/images/locations/apartment-table.jpg"
            },
            {
                id: "leave_home",
                label: "Выйти на улицу",
                hint: "Отправиться в город",
                condition: { item: "keys" },
                effects: [{ type: "move", to: "street" }]
            },
            {
                id: "rest",
                label: "Немного отдохнуть",
                hint: "Проходит 15 минут · -5 усталости",
                minutes: 15,
                effects: [],
                reduceAfterTime: { fatigue: 5 },
                text: "Ты ненадолго присаживаешься и собираешься с мыслями.",
                image: "assets/images/locations/apartment-rest.jpg"
            },
            {
                id: "sleep_8h",
                label: "Лечь спать",
                hint: "Проходит 8 часов · -100 усталости",
                minutes: 480,
                effects: [],
                reduceBeforeTime: { fatigue: 100 },
                restoreAfterTime: { stamina: 100, health: 100 },
                sleep: true,
                text: "Ты ложишься спать и просыпаешься через восемь часов.",
                image: "assets/images/locations/apartment-sleep.jpg"
            },
            {
                id: "eat_at_home",
                label: "Поесть",
                hint: "Снимает голод · 20 ₽",
                minutes: 30,
                condition: { variableAtLeast: { name: "money", value: 20 } },
                effects: [{ type: "changeVariable", name: "money", amount: -20 }],
                restoreAfterTime: { hunger: 0 },
                text: "Ты готовишь простой ужин и ешь.",
                image: "assets/images/locations/apartment-rest.jpg"
            },
            {
                id: "drink_at_home",
                label: "Попить",
                hint: "Снимает жажду",
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
    apartment: ["street"]
});