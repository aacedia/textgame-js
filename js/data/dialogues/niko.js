window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.niko = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Нико замечает тебя, вытирает полотенцем лоб после подхода и подходит ближе. — О, привет! Тоже тренируешься?",
            choices: [
                {
                    text: "Поговорить",
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
                { text: "О тренировках и отдыхе", next: "rest", condition: { not: { flag: "niko_rest_done" } } },
                { text: "О травмах", next: "injuries", condition: { not: { flag: "niko_injuries_done" } } },
                { text: "О командной работе", next: "team", condition: { not: { flag: "niko_team_done" } } },
                { text: "О её семье", next: "family", condition: { not: { flag: "niko_family_done" } } },
                {
                    text: "Просто поболтать",
                    next: "smalltalk",
                    condition: {
                        all: [
                            { flag: "niko_sport_done" },
                            { flag: "niko_favorites_done" },
                            { flag: "niko_dream_done" },
                            { flag: "niko_passive_done" },
                            { flag: "niko_rest_done" },
                            { flag: "niko_injuries_done" },
                            { flag: "niko_team_done" },
                            { flag: "niko_family_done" }
                        ]
                    }
                },
                { text: "Попрощаться", close: true }
            ]
        },

        /* ---------- Спорт ---------- */

        sport: {
            text: "— Хочу спросить. — Нико оглядывает тебя с ног до головы. — А ты вообще чем занимаешься? Спорт?",
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
            text: "Нико одобрительно кивает. — Вот это по-нашему! Движение — жизнь. — Она хлопает тебя по плечу.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        sport_neutral: {
            text: "Нико улыбается. — Главное — начать. Я в тебя верю. — Она чуть наклоняет голову. — Если хочешь, могу подсказать пару упражнений для старта.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        sport_bad: {
            text: "Нико морщится. — Диван — это не жизнь. Пассивность до добра не доводит. — Она больше не улыбается.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Любимые виды ---------- */

        favorites: {
            text: "— Хочу рассказать про любимые виды. — Нико оживляется. — Больше всего люблю единоборства и волейбол. Но вообще приветствую любой спорт, кроме шахмат — это же не движение!",
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
            text: "Нико улыбается. — Вот именно! Ты понимаешь. — Она чуть покачивает кулаком в воздухе.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        favorites_neutral: {
            text: "Нико кивает. — Согласна. Движение — главное.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        favorites_bad: {
            text: "Нико закатывает глаза. — Шахматы — это сидение за доской. Какое же это движение? — Она качает головой.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Мечта ---------- */

        dream: {
            text: "— Хочу поделиться. — Нико понижает голос. — Я мечтаю стать профессиональной волейболисткой. Тренируюсь каждый день, но до профессионального уровня ещё далеко. — Она улыбается, но в улыбке есть и усталость.",
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
            text: "Нико загорается. — Спасибо! Ты первый, кто так говорит. Мне это важно. — Она поправляет полотенце на плече.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        dream_neutral: {
            text: "Нико кивает. — Я знаю. Но я готова работать.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        dream_bad: {
            text: "Нико опускает взгляд. — Вот поэтому я и не рассказываю об этом многим… — Она замолкает.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Пассивные люди ---------- */

        passive: {
            text: "— Хочу сказать про пассивность. — Нико хмурится. — Не понимаю людей, которые ведут пассивный образ жизни. Сидят дома, лежат на диване… Это же скучно и вредно. И для тела, и для головы.",
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
            text: "Нико хлопает тебя по плечу. — Вот это правильно! — Она улыбается. — Наконец-то кто-то согласен.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        passive_neutral: {
            text: "Нико пожимает плечами. — Ну, каждому своё, конечно. Но я бы так не смогла.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        passive_bad: {
            text: "Нико хмурится. — Вот из-за такого отношения люди и запускают себя. — Она возвращается к тренировке.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- О тренировках и отдыхе ---------- */

        rest: {
            text: "— Хочу сказать про отдых. — Нико вытирает шею полотенцем. — Раньше я думала, что отдых — это для слабаков. Тренировалась каждый день, без выходных. А потом просто перестала восстанавливаться. Теперь у меня есть день отдыха. И это не слабость, а часть тренировки.",
            choices: [
                {
                    text: "Хорошо, что ты это поняла. Без отдыха тело не растёт.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 7 },
                        { type: "setFlag", flag: "niko_rest_done", value: true }
                    ],
                    next: "rest_good"
                },
                {
                    text: "А как ты поняла, что пора отдохнуть?",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 5 },
                        { type: "setFlag", flag: "niko_rest_done", value: true }
                    ],
                    next: "rest_how"
                },
                {
                    text: "Всё равно странно. Спортсмен должен тренироваться каждый день.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: -3 },
                        { type: "setFlag", flag: "niko_rest_done", value: true }
                    ],
                    next: "rest_bad"
                }
            ]
        },
        rest_good: {
            text: "Нико кивает. — Вот именно. Я это поняла, когда перестала прогрессировать. — Она улыбается. — Сейчас отдых для меня — это тоже тренировка. Только для головы.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        rest_how: {
            text: "Нико задумывается. — Я начала замечать, что не восстанавливаюсь. Привычные веса стали тяжёлыми. Привычные дистанции — долгими. — Она пожимает плечами. — Сначала злилась. А потом поняла, что это сигнал.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        rest_bad: {
            text: "Нико качает головой. — Так можно и перетренироваться. Тогда и вовсе выпадешь надолго. — Она больше не спорит, просто отходит к тренажёру.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- О травмах ---------- */

        injuries: {
            text: "— Хочу рассказать про травмы. — Нико невольно трогает колено. — Однажды потянула связку. Думала, ерунда, само пройдёт. А потом месяц не могла тренироваться. — Она вздыхает. — Вот тогда я поняла, что не всё можно перетерпеть.",
            choices: [
                {
                    text: "Организм иногда говорит важное. Главное — услышать вовремя.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 7 },
                        { type: "setFlag", flag: "niko_injuries_done", value: true }
                    ],
                    next: "injuries_good"
                },
                {
                    text: "А сейчас колено в порядке?",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 4 },
                        { type: "setFlag", flag: "niko_injuries_done", value: true }
                    ],
                    next: "injuries_ask"
                },
                {
                    text: "Может, если бы ты меньше тренировалась, травмы бы не было.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: -5 },
                        { type: "setFlag", flag: "niko_injuries_done", value: true }
                    ],
                    next: "injuries_bad"
                }
            ]
        },
        injuries_good: {
            text: "Нико кивает. — Именно. Я теперь не игнорирую, когда что-то болит. — Она улыбается. — Хотя иногда всё равно тянет доиграть. Приходится себя останавливать.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        injuries_ask: {
            text: "Нико сгибает и разгибает ногу. — В порядке. Восстановилась. — Она делает паузу. — Но с тех пор я стала осторожнее. И разминку не пропускаю.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        injuries_bad: {
            text: "Нико хмурится. — Можно и не тренироваться вовсе. Тогда и травм не будет. Но и жизни тоже. — Она отворачивается.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- О командной работе ---------- */

        team: {
            text: "— Хочу рассказать про команду. — Нико садится на скамейку. — В волейболе важно чувствовать друг друга. Если один игрок выпадает, страдает вся команда. Но и тянуть всё на себе нельзя. Нужно доверять. — Она задумывается. — А доверять сложнее, чем тренироваться.",
            choices: [
                {
                    text: "Да, доверие — это отдельная работа. И не только в спорте.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 7 },
                        { type: "setFlag", flag: "niko_team_done", value: true }
                    ],
                    next: "team_good"
                },
                {
                    text: "А тебе легко доверять другим?",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 5 },
                        { type: "setFlag", flag: "niko_team_done", value: true }
                    ],
                    next: "team_personal"
                },
                {
                    text: "Если хочешь побеждать, надо тянуть всё на себе. Тогда не подведёшь.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: -4 },
                        { type: "setFlag", flag: "niko_team_done", value: true }
                    ],
                    next: "team_bad"
                }
            ]
        },
        team_good: {
            text: "Нико кивает. — Вот именно. — Она улыбается. — В спорте это видно особенно. Но и в жизни, наверное, так же.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        team_personal: {
            text: "Нико задумывается, будто впервые об этом задумалась. — Не всегда. Я люблю контролировать. — Она пожимает плечами. — Но в волейболе я поняла, что одна поле не выиграю. Приходится учиться.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        team_bad: {
            text: "Нико качает головой. — Так не бывает. В команде один не вытянет всё. — Она смотрит на тебя. — И на себе всё тащить — это тоже не сила.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- О её семье ---------- */

        family: {
            text: "— Хочешь узнать про мою семью? — Нико улыбается. — У меня папа — тренер. Он меня и в спорт привёл. Мама сначала была против — боялась, что я слишком много тренируюсь. Но потом смирилась. — Она делает паузу. — Иногда мне кажется, что папа больше всех в меня верит. Даже больше, чем я сама.",
            choices: [
                {
                    text: "Это здорово. Когда есть кто-то, кто верит в тебя.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 7 },
                        { type: "setFlag", flag: "niko_family_done", value: true }
                    ],
                    next: "family_good"
                },
                {
                    text: "А мама до сих пор против?",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: 5 },
                        { type: "setFlag", flag: "niko_family_done", value: true }
                    ],
                    next: "family_mom"
                },
                {
                    text: "Иногда вера других — это тоже давление.",
                    effects: [
                        { type: "changeVariable", name: "relationship_niko", amount: -3 },
                        { type: "setFlag", flag: "niko_family_done", value: true }
                    ],
                    next: "family_bad"
                }
            ]
        },
        family_good: {
            text: "Нико улыбается. — Вот именно. — Она смотрит в сторону тренирующихся. — Папа никогда не давил. Просто был рядом. И это помогало больше, чем любые слова.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        family_mom: {
            text: "Нико задумывается. — Она беспокоится. Это не то же самое, что против. — Она пожимает плечами. — Я сейчас понимаю: она боялась, что я потеряю детство в спортзале. А я нашла его именно там.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        family_bad: {
            text: "Нико задумывается. — Иногда. — Она смотрит на полотенце в руках. — Но я знаю, что он верит не в результат, а в меня. Это разные вещи.",
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