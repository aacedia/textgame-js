window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.ritsu = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Парень у окна с потрёпанным блокнотом поднимает глаза. Взгляд у него ровный, будто он давно ничему не удивляется. — А. Привет. Я Рицу.",
            choices: [
                {
                    text: "Поздороваться",
                    next: "topics",
                    effects: [{ type: "setVariableFromVariable", name: "lastRitsuDay", from: "day" }]
                },
                { text: "Уйти", close: true }
            ]
        },
        topics: {
            text: "— О чём поговорим? — спрашивает он, не выпуская блокнот из рук.",
            choices: [
                { text: "О Дадзае", next: "dazai", condition: { not: { flag: "ritsu_dazai_done" } } },
                { text: "О «Мартине Идене»", next: "martin", condition: { not: { flag: "ritsu_martin_done" } } },
                { text: "О пустоте", next: "emptiness", condition: { not: { flag: "ritsu_empty_done" } } },
                { text: "О стихах", next: "poems", condition: { not: { flag: "ritsu_poems_done" } } },
                { text: "О ярких эмоциях", next: "emotions", condition: { not: { flag: "ritsu_emotions_done" } } },
                {
                    text: "О Марке Аврелии и стоицизме",
                    next: "stoicism",
                    condition: { not: { flag: "ritsu_stoicism_done" } }
                },
                {
                    text: "О «Заговоре против рода человеческого»",
                    next: "ligotti",
                    condition: { not: { flag: "ritsu_ligotti_done" } }
                },
                { text: "Попросить почитать стихи", next: "read_poem" },
                {
                    text: "Просто поболтать",
                    next: "smalltalk",
                    condition: {
                        all: [
                            { flag: "ritsu_dazai_done" },
                            { flag: "ritsu_martin_done" },
                            { flag: "ritsu_empty_done" },
                            { flag: "ritsu_poems_done" },
                            { flag: "ritsu_emotions_done" },
                            { flag: "ritsu_stoicism_done" },
                            { flag: "ritsu_ligotti_done" }
                        ]
                    }
                },
                { text: "Попрощаться", close: true }
            ]
        },

        /* ---------- Дадзай ---------- */

        dazai: {
            text: "— Дадзай… — Рицу говорит тише. — «Исповедь неполноценного человека». Он не оправдывается. Он просто показывает, как человек отпадает от себя. Это честнее любой бодрости.",
            choices: [
                {
                    text: "Дадзай не романтизирует боль. Он её фиксирует. Это и есть литература.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 8 },
                        { type: "setFlag", flag: "ritsu_dazai_done", value: true }
                    ],
                    next: "dazai_good"
                },
                {
                    text: "Это же просто депрессивная проза. Зачем её читать?",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: -4 },
                        { type: "setFlag", flag: "ritsu_dazai_done", value: true }
                    ],
                    next: "dazai_bad"
                }
            ]
        },
        dazai_good: {
            text: "Рицу кивает, почти незаметно. — Ты понимаешь. Большинство хочет, чтобы им сказали, что всё хорошо. Дадзай так не делает.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        dazai_bad: {
            text: "Рицу пожимает плечами. — Наверное. Но иногда честнее показать, как всё плохо, чем делать вид.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Мартин Иден ---------- */

        martin: {
            text: "— «Мартин Иден» — это книга о том, как человек добивается всего, а потом обнаруживает, что это ничего не значит. Не потому что он слаб, а потому что цель была не та.",
            choices: [
                {
                    text: "Он поднялся наверх и увидел, что там пусто. Это самое честное, что бывает.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 8 },
                        { type: "setFlag", flag: "ritsu_martin_done", value: true }
                    ],
                    next: "martin_good"
                },
                {
                    text: "Он просто сдался. Надо было бороться дальше.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: -4 },
                        { type: "setFlag", flag: "ritsu_martin_done", value: true }
                    ],
                    next: "martin_bad"
                }
            ]
        },
        martin_good: {
            text: "Рицу смотрит на тебя внимательно. — Вот именно. Это не про слабость. Это про то, что можно дойти до конца и не найти там смысла.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        martin_bad: {
            text: "Рицу качает головой. — Иногда борьба — это просто способ не смотреть правде в глаза.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Пустота ---------- */

        emptiness: {
            text: "— Я не чувствую пустоту как боль, — говорит он. — Скорее как фон. Как шум в комнате, к которому привык и уже не замечаешь. Только иногда он становится громче.",
            choices: [
                {
                    text: "Пустота — это не отсутствие чувств. Это то, что остаётся, когда всё лишнее убрать.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 10 },
                        { type: "setFlag", flag: "ritsu_empty_done", value: true },
                        { type: "changeVariable", name: "mood", amount: 2 }
                    ],
                    next: "empty_good"
                },
                {
                    text: "Просто найди хобби. Пустота от безделья.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: -5 },
                        { type: "setFlag", flag: "ritsu_empty_done", value: true }
                    ],
                    next: "empty_bad"
                }
            ]
        },
        empty_good: {
            text: "Рицу долго молчит. — Ты первый, кто сказал это без желания меня исправить. Спасибо.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        empty_bad: {
            text: "Рицу тихо усмехается. — Да. Наверное. — И больше ничего не говорит.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Стихи ---------- */

        poems: {
            text: "— Я пишу о том, что вижу, — говорит он. — Не о чувствах, которые принято показывать. О том, что остаётся, когда их убираешь.",
            choices: [
                {
                    text: "Стихи без ярких эмоций иногда говорят больше, чем крик.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 7 },
                        { type: "setFlag", flag: "ritsu_poems_done", value: true }
                    ],
                    next: "poems_good"
                },
                {
                    text: "Стихи должны трогать. Без эмоций это просто текст.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: -3 },
                        { type: "setFlag", flag: "ritsu_poems_done", value: true }
                    ],
                    next: "poems_bad"
                }
            ]
        },
        poems_good: {
            text: "Рицу чуть улыбается — впервые за разговор. — Вот. Ты понял. Тишина тоже может быть громкой.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        poems_bad: {
            text: "Рицу пожимает плечами. — Может быть. Но я пишу не для того, чтобы трогать. Я пишу, чтобы не забыть.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Яркие эмоции ---------- */

        emotions: {
            text: "— Не люблю, когда слишком ярко, — признаётся Рицу. — Радость, злость, восторг — всё это быстро сгорает. А потом остаётся пепел. Я предпочитаю ровный свет.",
            choices: [
                {
                    text: "Ровный свет честнее. Он не обманывает обещанием, что так будет всегда.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 7 },
                        { type: "setFlag", flag: "ritsu_emotions_done", value: true }
                    ],
                    next: "emotions_good"
                },
                {
                    text: "Без ярких эмоций жизнь скучная.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: -3 },
                        { type: "setFlag", flag: "ritsu_emotions_done", value: true }
                    ],
                    next: "emotions_bad"
                }
            ]
        },
        emotions_good: {
            text: "Рицу кивает. — Именно. Яркое — это вспышка. А жить приходится в темноте между вспышками.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        emotions_bad: {
            text: "Рицу пожимает плечами. — Скучная — для кого. Мне в ней спокойно.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Марк Аврелий и стоицизм ---------- */

        stoicism: {
            text: "— Марк Аврелий меня не утешает, — говорит Рицу. — Он учит: боль не твоя, твоё только отношение. Но это же способ перестать чувствовать вообще. «Безразличие» к внешнему — это не сила. Это онемение.",
            choices: [
                {
                    text: "Стоик не убирает боль. Он убирает страх перед ней. Но ты прав: там, где нет страха, часто нет и жизни.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 8 },
                        { type: "setFlag", flag: "ritsu_stoicism_done", value: true }
                    ],
                    next: "stoicism_good"
                },
                {
                    text: "Стоицизм — это дисциплина. Не всем дано понять, что чувства — не хозяева.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: -4 },
                        { type: "setFlag", flag: "ritsu_stoicism_done", value: true }
                    ],
                    next: "stoicism_bad"
                }
            ]
        },
        stoicism_good: {
            text: "Рицу кивает. — Вот. Я не против тишины. Я против того, чтобы называть онемение мудростью. Марк Аврелий писал «К самому себе» ночью, в палатке, среди чумы. Может, ему просто нужно было во что-то верить.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        stoicism_bad: {
            text: "Рицу пожимает плечами. — Дисциплина. Да. Как у солдата. Только солдат не пишет стихи.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Лиготти ---------- */

        ligotti: {
            text: "— Лиготти пишет, что мы заперты в сознании, которое не может не страдать, — говорит Рицу. — И что вся культура — это заговор, чтобы делать вид, будто это не так. Оптимизм как способ не смотреть.",
            choices: [
                {
                    text: "Он не говорит, что жить не стоит. Он говорит, что делать вид, будто всё хорошо, — это ложь.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 8 },
                        { type: "setFlag", flag: "ritsu_ligotti_done", value: true }
                    ],
                    next: "ligotti_good"
                },
                {
                    text: "Это слишком мрачно. Люди находят смысл, и это не заговор.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: -4 },
                        { type: "setFlag", flag: "ritsu_ligotti_done", value: true }
                    ],
                    next: "ligotti_bad"
                }
            ]
        },
        ligotti_good: {
            text: "Рицу кивает. — Вот. Он не проповедует отчаяние. Он просто отказывается врать. Мне это ближе, чем любая терапия.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        ligotti_bad: {
            text: "Рицу пожимает плечами. — Находят. Или убеждают себя, что нашли. Разница не всегда видна.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Чтение стихов ---------- */

        read_poem: {
            text: "Рицу открывает блокнот, находит страницу и читает ровным голосом.",
            choices: [
                {
                    text: "Попросить почитать",
                    next: "poem_jp",
                    condition: { not: { flag: "ritsu_poem_read" } },
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 3 },
                        { type: "setFlag", flag: "ritsu_poem_read", value: true }
                    ]
                },
                { text: "Попрощаться", close: true }
            ]
        },
        poem_jp: {
            text: "— Это Кобаяси Исса. — Рицу читает:\n\n«Мир росы —\nмир росы.\nИ всё же, и всё же…»\n\nОн закрывает блокнот. — Он написал это после смерти дочери. Буддийская истина говорит: не привязывайся, всё мимолётно. А он добавляет «и всё же». В этом всё.",
            choices: [
                { text: "Попрощаться", close: true }
            ]
        },

        /* ---------- Просто поболтать ---------- */

        smalltalk: {
            text: "Вы говорите ни о чём: о погоде, о том, кто сегодня в библиотеке, о книге, которую он дочитывает. Рицу отвечает коротко, но не уходит.",
            choices: [
                {
                    text: "Попрощаться",
                    next: "smalltalk_result",
                    effects: [{ type: "changeVariable", name: "relationship_ritsu", amount: 2 }]
                }
            ]
        },
        smalltalk_result: {
            text: "Вы прощаетесь. Рицу кивает и снова открывает блокнот.",
            choices: [{ text: "Закрыть", close: true }]
        }
    }
};