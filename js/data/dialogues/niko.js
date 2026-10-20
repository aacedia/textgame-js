window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.niko = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Нико замечает тебя, вытирает полотенцем лоб после подхода и подходит ближе. — О, привет! Тоже тренируешься?",
            choices: [
                {
                    text: "Поздороваться",
                    next: "topics",
                    effects: [{ type: "setVariableFromVariable", name: "lastNikoDay", from: "day" }]
                },
                {
                    text: "Ты в отличной форме — сразу видно, что не пропускаешь тренировки.",
                    condition: { variableAtLeast: { name: "staminaMax", value: 60 } },
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 3 },
                        { type: "setVariableFromVariable", name: "lastNikoDay", from: "day" }
                    ],
                    next: "compliment"
                },
                { text: "Уйти", close: true }
            ]
        },
        compliment: {
            text: "Нико довольно улыбается и слегка приосанивается. — Спасибо! Приятно, когда замечают. А ты сам, вижу, тоже в форме.",
            choices: [
                { text: "Продолжить", next: "topics" }
            ]
        },
        topics: {
            text: "Нико убирает полотенце на плечо и улыбается. — Ну что, о чём поговорим?",
            choices: [
                { text: "О спорте", next: "sport", condition: { not: { flag: "niko_sport_done" } } },
                { text: "О любимых видах спорта", next: "favorites", condition: { not: { flag: "niko_favorites_done" } } },
                { text: "О её мечте", next: "dream", condition: { not: { flag: "niko_dream_done" } } },
                { text: "О пассивных людях", next: "passive", condition: { not: { flag: "niko_passive_done" } } },
                {
                    text: "Просто поболтать",
                    next: "smalltalk",
                    condition: {
                        all: [
                            { flag: "niko_sport_done" },
                            { flag: "niko_favorites_done" },
                            { flag: "niko_dream_done" },
                            { flag: "niko_passive_done" }
                        ]
                    }
                },
                { text: "Попрощаться", close: true }
            ]
        },

        /* ---------- Спорт ---------- */

        sport: {
            text: "— А ты вообще чем занимаешься? — спрашивает Нико, оглядывая тебя с ног до головы. — Спорт?",
            choices: [
                {
                    text: "Да, тоже тренируюсь. Спорт для меня — часть жизни.",
                    condition: { variableAtLeast: { name: "staminaMax", value: 60 } },
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 7 },
                        { type: "setFlag", flag: "niko_sport_done", value: true }
                    ],
                    next: "sport_good"
                },
                {
                    text: "Не особо спортивный, но хочу начать.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 2 },
                        { type: "setFlag", flag: "niko_sport_done", value: true }
                    ],
                    next: "sport_neutral"
                },
                {
                    text: "Спорт — не для меня. Предпочитаю лежать на диване.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: -7 },
                        { type: "setFlag", flag: "niko_sport_done", value: true }
                    ],
                    next: "sport_bad"
                }
            ]
        },
        sport_good: {
            text: "Нико одобрительно кивает. — Вот это по-нашему! Движение — жизнь.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        sport_neutral: {
            text: "Нико улыбается. — Главное — начать. Я в тебя верю.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        sport_bad: {
            text: "Нико морщится. — Диван — это не жизнь. Пассивность до добра не доводит.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Любимые виды ---------- */

        favorites: {
            text: "— Больше всего люблю единоборства и волейбол, — говорит Нико. — Но вообще приветствую любой спорт, кроме шахмат — это же не движение!",
            choices: [
                {
                    text: "Единоборства закаляют дух, а волейбол — командный вид. Отличный выбор.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 7 },
                        { type: "setFlag", flag: "niko_favorites_done", value: true }
                    ],
                    next: "favorites_good"
                },
                {
                    text: "Люблю разное, главное — движение.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 3 },
                        { type: "setFlag", flag: "niko_favorites_done", value: true }
                    ],
                    next: "favorites_neutral"
                },
                {
                    text: "Шахматы — тоже спорт, между прочим.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: -5 },
                        { type: "setFlag", flag: "niko_favorites_done", value: true }
                    ],
                    next: "favorites_bad"
                }
            ]
        },
        favorites_good: {
            text: "Нико улыбается. — Вот именно! Ты понимаешь.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        favorites_neutral: {
            text: "Нико кивает. — Согласна. Движение — главное.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        favorites_bad: {
            text: "Нико закатывает глаза. — Шахматы — это сидение за доской. Какое же это движение?",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Мечта ---------- */

        dream: {
            text: "— Вообще, — понижает голос Нико, — я мечтаю стать профессиональной волейболисткой. Тренируюсь каждый день, но до профессионального уровня ещё далеко.",
            choices: [
                {
                    text: "Это достойная цель. У тебя есть силы и упорство — ты справишься.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 10 },
                        { type: "setFlag", flag: "niko_dream_done", value: true },
                        { type: "changeVariable", name: "mood", amount: 5 }
                    ],
                    next: "dream_good"
                },
                {
                    text: "Профессиональный спорт — это тяжело, но возможно.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 4 },
                        { type: "setFlag", flag: "niko_dream_done", value: true }
                    ],
                    next: "dream_neutral"
                },
                {
                    text: "Вряд ли у тебя получится, это же надо тренироваться каждый день.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: -10 },
                        { type: "setFlag", flag: "niko_dream_done", value: true }
                    ],
                    next: "dream_bad"
                }
            ]
        },
        dream_good: {
            text: "Нико загорается. — Спасибо! Ты первый, кто так говорит. Мне это важно.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        dream_neutral: {
            text: "Нико кивает. — Я знаю. Но я готова работать.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        dream_bad: {
            text: "Нико опускает взгляд. — Вот поэтому я и не рассказываю об этом многим…",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Пассивные люди ---------- */

        passive: {
            text: "— Не понимаю людей, которые ведут пассивный образ жизни, — говорит Нико. — Сидят дома, лежат на диване… Это же скучно и вредно.",
            choices: [
                {
                    text: "Согласен. Движение — жизнь, а пассивность убивает.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 7 },
                        { type: "setFlag", flag: "niko_passive_done", value: true }
                    ],
                    next: "passive_good"
                },
                {
                    text: "Каждому своё. Некоторые любят тишину и покой.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 2 },
                        { type: "setFlag", flag: "niko_passive_done", value: true }
                    ],
                    next: "passive_neutral"
                },
                {
                    text: "Да ладно, можно и полежать. Все так делают.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: -5 },
                        { type: "setFlag", flag: "niko_passive_done", value: true }
                    ],
                    next: "passive_bad"
                }
            ]
        },
        passive_good: {
            text: "Нико хлопает тебя по плечу. — Вот это правильно!",
            choices: [{ text: "Попрощаться", close: true }]
        },
        passive_neutral: {
            text: "Нико пожимает плечами. — Ну, каждому своё, конечно. Но я бы так не смогла.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        passive_bad: {
            text: "Нико хмурится. — Вот из-за такого отношения люди и запускают себя.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Просто поболтать ---------- */

        smalltalk: {
            text: "Вы болтаете о тренировках, о том, кто сегодня в зале, о планах на неделю. Нико оживлённо жестикулирует и смеётся.",
            choices: [
                {
                    text: "Попрощаться",
                    next: "smalltalk_result",
                    effects: [{ type: "changeVariable", name: "relationship_niko", amount: 2 }]
                }
            ]
        },
        smalltalk_result: {
            text: "Вы прощаетесь. Нико хлопает тебя по плечу и возвращается к тренировке.",
            choices: [{ text: "Закрыть", close: true }]
        }
    }
};