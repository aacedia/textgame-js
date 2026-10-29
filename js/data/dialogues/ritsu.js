window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.ritsu = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Парень у окна поднимает глаза от блокнота. — А. Привет. Я Рицу.",
            choices: [
                {
                    text: "Поговорить",
                    next: "topics",
                    effects: [{ type: "setVariableFromVariable", name: "lastRitsuDay", from: "day" }]
                },
                { text: "Уйти", close: true }
            ]
        },

        topics: {
            text: "— О чём поговорим? — спрашивает он, не выпуская блокнот из рук.",
            choices: [
                {
                    text: "Спросить, о чём он пишет",
                    next: "about_writing",
                    condition: { not: { flag: "ritsu_about_writing" } }
                },
                {
                    text: "Взять почитать книгу",
                    next: "ask_book",
                    iconImage: "assets/images/ui/info.png",
                    condition: {
                        all: [
                            { not: { flag: "ritsuBooksAgreed" } },
                            { variableAtLeast: { name: "relationship_ritsu", value: 20 } }
                        ]
                    }
                },
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
                {
                    text: "Попросить почитать стихи",
                    next: "read_poem",
                    condition: { not: { flag: "ritsu_poem_read" } }
                },
                {
                    text: "Спросить, почему он всегда один",
                    next: "alone",
                    condition: { not: { flag: "ritsu_alone_done" } }
                },
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

        /* ---------- О чём он пишет ---------- */

        about_writing: {
            text: "Рицу на секунду задумывается, потом закрывает блокнот, но не убирает его. — О честных чувствах, скрывающихся за теми, которые обычно принято показывать.",
            choices: [
                {
                    text: "С честными людьми легче. Сразу видно, что у них на уме.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 5 },
                        { type: "setFlag", flag: "ritsu_about_writing", value: true }
                    ],
                    next: "about_writing_good"
                },
                {
                    text: "Если человек закрыт, непонятно, что его на самом деле беспокоит.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: -3 },
                        { type: "setFlag", flag: "ritsu_about_writing", value: true }
                    ],
                    next: "about_writing_bad"
                }
            ]
        },
        about_writing_good: {
            text: "Рицу кивает. — Удобное не задевает. А не задевает — значит, и не живёт. — Он снова открывает блокнот. — Ладно. Спасибо. Редко кто спрашивает.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        about_writing_bad: {
            text: "Рицу не спорит. — Может быть. — Он откидывается на спинку стула. — Но если открыться, начнут лезть с советами. Я пока не готов к этому.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Взять книгу ---------- */

        ask_book: {
            text: "— Хочешь почитать что-нибудь из моего? — Рицу кивает на блокнот, потом на полку. — Бери. Только возвращай в целости. У меня мало вещей, которые я берегу.",
            choices: [
                {
                    text: "Спасибо. Возьму.",
                    effects: [{ type: "setFlag", flag: "ritsuBooksAgreed", value: true }],
                    next: "ask_book_yes"
                },
                {
                    text: "Как-нибудь в другой раз",
                    next: "ask_book_later"
                }
            ]
        },
        ask_book_yes: {
            text: "Рицу кивает. — Тогда заходи в библиотеку, когда будет время. Что-нибудь подберём.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        ask_book_later: {
            text: "Рицу пожимает плечами. — Как хочешь. Если передумаешь — я тут.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Дадзай ---------- */

        dazai: {
            text: "— Хочу рассказать о книге «Исповедь неполноценного человека» Осаму Дадзая. — Рицу говорит тише. — Я считаю, что в ней он не оправдывается, но без преувеличения показывает, как человек отпадает от себя. Гораздо лучше напускной бравады.",
            choices: [
                {
                    text: "Согласен. Иногда лучше показать, как всё плохо, чем делать вид.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 8 },
                        { type: "setFlag", flag: "ritsu_dazai_done", value: true }
                    ],
                    next: "dazai_good"
                },
                {
                    text: "Не знаю. Мне кажется, в такой честности мало тепла.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: -3 },
                        { type: "setFlag", flag: "ritsu_dazai_done", value: true }
                    ],
                    next: "dazai_bad"
                },
                {
                    text: "Ты говоришь о нём так, будто знал его лично.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 5 },
                        { type: "setFlag", flag: "ritsu_dazai_done", value: true }
                    ],
                    next: "dazai_personal"
                }
            ]
        },
        dazai_good: {
            text: "Рицу кивает, почти незаметно. — Ты понимаешь. Людям обычно хочется, чтобы им сказали, что всё хорошо. Дадзай так не делает. — Он проводит пальцем по корешку блокнота. — Иногда единственное, что можно сделать для человека, — не врать ему.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        dazai_bad: {
            text: "Рицу пожимает плечами. — Наверное. Но иногда честнее показать, как всё плохо, чем делать вид. — Он замолкает, и в тишине чувствуется что-то большее, чем обида.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        dazai_personal: {
            text: "Рицу усмехается, но без веселья. — Нет. Просто он писал о том, что я узнаю. Когда читаешь такое, кажется, что тебя уже кто-то понял. Даже если он умер сто лет назад.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Мартин Иден ---------- */

        martin: {
            text: "— Хочу рассказать о «Мартине Идене» Джека Лондона. — Рицу задумывается на секунду. — Эта книга про то, как человек добивается всего, а потом обнаруживает, что это ничего не значит. И дело не в слабости. Просто цель была не та.",
            choices: [
                {
                    text: "Он поднялся наверх и увидел, что там пусто. Честнее не бывает.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 8 },
                        { type: "setFlag", flag: "ritsu_martin_done", value: true }
                    ],
                    next: "martin_good"
                },
                {
                    text: "А ты сам — куда хочешь подняться?",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 5 },
                        { type: "setFlag", flag: "ritsu_martin_done", value: true }
                    ],
                    next: "martin_personal"
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
            text: "Рицу смотрит на тебя внимательно. — Вот именно. Дело не в слабости. Просто можно дойти до конца и не найти там смысла. — Он делает паузу. — И тогда единственное, что остаётся, — вернуться к тому, с чего начал. Если есть куда.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        martin_personal: {
            text: "Рицу долго молчит. — Я не хочу подниматься. Я хочу понять, что наверху, не карабкаясь туда. — Он криво улыбается. — Книги позволяют. Люди — нет.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        martin_bad: {
            text: "Рицу качает головой. — Иногда борьба — просто способ не смотреть правде в глаза. — Он не повышает голос, но в нём слышится усталость.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Пустота ---------- */

        emptiness: {
            text: "— Расскажу, как я это чувствую. — Рицу смотрит в сторону. — Пустоту я не чувствую как боль. Скорее как фон. Как шум в комнате, к которому привык и уже не замечаешь. Только иногда он становится громче. Тогда я пишу. Не чтобы заглушить, а чтобы описать.",
            choices: [
                {
                    text: "Пустота — не отсутствие чувств. Скорее то, что остаётся, когда всё лишнее убрать.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 10 },
                        { type: "setFlag", flag: "ritsu_empty_done", value: true },
                        { type: "changeVariable", name: "mood", amount: 2 }
                    ],
                    next: "empty_good"
                },
                {
                    text: "А что ты чувствуешь, когда шум становится громче?",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 6 },
                        { type: "setFlag", flag: "ritsu_empty_done", value: true }
                    ],
                    next: "empty_deep"
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
            text: "Рицу долго молчит. — Спасибо, что сказал это без желания меня исправить. — В его голосе нет благодарности напоказ, только тихое облегчение.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        empty_deep: {
            text: "Рицу задумывается, будто впервые формулирует это для себя. — Как будто стоишь в пустой комнате и слышишь собственное дыхание. Слишком громко. — Он смотрит на тебя. — Обычно в этот момент включают музыку. Я записываю.",
            choices: [
                {
                    text: "Записывать — тоже способ не убегать. Просто другой.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 7 },
                        { type: "changeVariable", name: "mood", amount: 2 }
                    ],
                    next: "empty_deep_good"
                },
                { text: "Попрощаться", close: true }
            ]
        },
        empty_deep_good: {
            text: "Рицу кивает, медленно, как будто это что-то меняет. — Да. Наверное. — И впервые за разговор он не отводит взгляда.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        empty_bad: {
            text: "Рицу тихо усмехается. — Да. Наверное. — И больше ничего не говорит. Молчание повисает, и в нём слышно, как он закрывает тему.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Стихи ---------- */

        poems: {
            text: "— Расскажу, что пишу. — Рицу кладёт ладонь на блокнот. — О том, что вижу. Не о чувствах, которые принято показывать. О том, что остаётся, когда их убираешь. Стихи не обязаны кричать. Иногда они просто стоят рядом.",
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
                    text: "А тебе не страшно, что никто не услышит?",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 5 },
                        { type: "setFlag", flag: "ritsu_poems_done", value: true }
                    ],
                    next: "poems_deep"
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
            text: "Рицу чуть улыбается — впервые за разговор. — Вот. Ты понял. Тишина тоже может быть громкой. — Он смотрит на блокнот. — Может, поэтому я и пишу. Чтобы кто-то однажды услышал.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        poems_deep: {
            text: "Рицу задумывается. — Страшно. Но ещё страшнее — писать громко и не сказать ничего. — Он пожимает плечами. — Я выбираю тишину. Она честнее.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        poems_bad: {
            text: "Рицу пожимает плечами. — Может быть. Но я пишу не для того, чтобы трогать. Я пишу, чтобы не забыть. — Он закрывает блокнот, и в этом жесте чувствуется граница.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Яркие эмоции ---------- */

        emotions: {
            text: "— Скажу, что думаю про эмоции. — Рицу смотрит в окно. — Не люблю, когда слишком ярко. Радость, злость, восторг — всё это быстро сгорает. А потом остаётся пепел. Я предпочитаю ровный свет. В нём видно больше.",
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
                    text: "Но без вспышек ведь и не запоминается ничего.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 3 },
                        { type: "setFlag", flag: "ritsu_emotions_done", value: true }
                    ],
                    next: "emotions_neutral"
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
            text: "Рицу кивает. — Именно. Яркое — это вспышка. А жить приходится в темноте между вспышками. — Он делает паузу. — Вот там и появляются настоящие вещи.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        emotions_neutral: {
            text: "Рицу задумывается. — Может быть. Но я не хочу жить от вспышки до вспышки. — Он пожимает плечами. — Как будто ждёшь праздника, чтобы почувствовать, что живёшь.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        emotions_bad: {
            text: "Рицу пожимает плечами. — Скучная — для кого. Мне в ней спокойно. — Он не спорит. Он просто закрывает тему.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Марк Аврелий и стоицизм ---------- */

        stoicism: {
            text: "— Хочу рассказать про Марка Аврелия. — Рицу задумывается. — Меня он не утешает. Он учит: боль не твоя, твоё только отношение. Но так можно перестать чувствовать вообще. «Безразличие» к внешнему — не сила. Скорее онемение.",
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
                    text: "А что бы ты оставил, если бы мог выбрать?",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 5 },
                        { type: "setFlag", flag: "ritsu_stoicism_done", value: true }
                    ],
                    next: "stoicism_deep"
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
            text: "Рицу кивает. — Вот. Я не против тишины. Я против того, чтобы называть онемение мудростью. Марк Аврелий писал «К самому себе» ночью, в палатке, среди чумы. Может, ему просто нужно было во что-то верить. — Он смотрит на тебя. — Я тоже пишу ночью. Но не верю, что это кого-то спасёт.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        stoicism_deep: {
            text: "Рицу молчит дольше обычного. — Не знаю. Может, ничего. — Он смотрит в блокнот. — А может, вот это. — Он не показывает страницу, но по лицу видно, что это не пустые слова.",
            choices: [
                {
                    text: "Тогда это уже не ничего.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 6 },
                        { type: "changeVariable", name: "mood", amount: 2 }
                    ],
                    next: "stoicism_deep_good"
                },
                { text: "Попрощаться", close: true }
            ]
        },
        stoicism_deep_good: {
            text: "Рицу чуть улыбается — почти незаметно. — Может быть. — И в этом «может быть» больше тепла, чем в иных длинных речах.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        stoicism_bad: {
            text: "Рицу пожимает плечами. — Дисциплина. Да. Как у солдата. Только солдат не пишет стихи. — Он больше не спорит: для него разговор закончен.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Лиготти ---------- */

        ligotti: {
            text: "— Хочу рассказать про «Заговор против рода человеческого» Томаса Лиготти. — Рицу говорит медленно. — Он пишет, что мы заперты в сознании, которое не может не страдать. И что вся культура — заговор, чтобы делать вид, будто это не так. Оптимизм как способ не смотреть.",
            choices: [
                {
                    text: "Он не говорит, что жить не стоит. Он говорит, что делать вид, будто всё хорошо, — ложь.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 8 },
                        { type: "setFlag", flag: "ritsu_ligotti_done", value: true }
                    ],
                    next: "ligotti_good"
                },
                {
                    text: "А ты сам — оптимист или просто устал притворяться?",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 6 },
                        { type: "setFlag", flag: "ritsu_ligotti_done", value: true }
                    ],
                    next: "ligotti_deep"
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
            text: "Рицу кивает. — Вот. Он не проповедует отчаяние. Просто отказывается врать. Мне это ближе, чем любая терапия. — Он делает паузу. — Терапия хочет, чтобы ты стал удобным. Лиготти — чтобы ты перестал врать себе.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        ligotti_deep: {
            text: "Рицу усмехается, но без веселья. — Устал притворяться. — Он смотрит на блокнот. — А ты? Ты ведь тоже сюда не просто так зашёл.",
            choices: [
                {
                    text: "Может, и я устал. Но пока не готов это признать.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 6 },
                        { type: "changeVariable", name: "mood", amount: 2 }
                    ],
                    next: "ligotti_deep_good"
                },
                { text: "Попрощаться", close: true }
            ]
        },
        ligotti_deep_good: {
            text: "Рицу кивает. — Честно. — Он снова открывает блокнот. — Заходи ещё. Здесь не так шумно, как кажется.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        ligotti_bad: {
            text: "Рицу пожимает плечами. — Находят. Или убеждают себя, что нашли. Разница не всегда видна. — Он не спорит, просто отводит взгляд.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Почему он всегда один ---------- */

        alone: {
            text: "Рицу не удивляется вопросу, будто ждал его. — Расскажу, как есть. Я не один. Я просто не ищу компании. — Он задумывается. — Люди устают от тех, кто не улыбается. А я не умею улыбаться, когда не хочется. Так проще нам обоим.",
            choices: [
                {
                    text: "Улыбка — не обязательство. Можно молчать и быть рядом.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 8 },
                        { type: "setFlag", flag: "ritsu_alone_done", value: true }
                    ],
                    next: "alone_good"
                },
                {
                    text: "Неужели никто не пытался подойти ближе?",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 4 },
                        { type: "setFlag", flag: "ritsu_alone_done", value: true }
                    ],
                    next: "alone_deep"
                },
                {
                    text: "Может, проблема в тебе, а не в людях?",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: -5 },
                        { type: "setFlag", flag: "ritsu_alone_done", value: true }
                    ],
                    next: "alone_bad"
                }
            ]
        },
        alone_good: {
            text: "Рицу долго смотрит на тебя. — Хорошо сказано. Без жалости. — Он чуть отводит взгляд. — Обычно либо жалеют, либо уходят. Ты остался.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        alone_deep: {
            text: "Рицу пожимает плечами. — Пытались. Но у них были ожидания. Что я стану веселее. Что буду чаще выходить. — Он смотрит в блокнот. — А я не могу обещать то, чего не знаю. Поэтому проще, когда не пытаются.",
            choices: [
                {
                    text: "Может, стоит дать кому-то шанс без ожиданий.",
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 6 },
                        { type: "changeVariable", name: "mood", amount: 2 }
                    ],
                    next: "alone_deep_good"
                },
                { text: "Попрощаться", close: true }
            ]
        },
        alone_deep_good: {
            text: "Рицу молчит, потом кивает. — Может. — И в этом коротком «может» слышно, что он не закрыл дверь.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        alone_bad: {
            text: "Рицу кивает, будто ожидал этого. — Возможно. — Он больше ничего не говорит. В этот момент он очень далеко, хотя сидит рядом.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Чтение стихов ---------- */

        read_poem: {
            text: "— Прочитаю Кобаяси Исса. — Рицу открывает блокнот и читает ровным голосом:\n\n«Мир росы —\nмир росы.\nИ всё же, и всё же…»\n\nОн закрывает блокнот. — Он написал это после смерти дочери. Буддийская истина говорит: не привязывайся, всё мимолётно. А он добавляет «и всё же». В этом всё.",
            choices: [
                {
                    text: "Попрощаться",
                    close: true,
                    effects: [
                        { type: "changeVariable", name: "relationship_ritsu", amount: 3 },
                        { type: "setFlag", flag: "ritsu_poem_read", value: true }
                    ]
                }
            ]
        },

        /* ---------- Просто поболтать ---------- */

        smalltalk: {
            text: "Вы говорите ни о чём: о погоде, о том, кто сегодня в библиотеке, о книге, которую он дочитывает. Рицу отвечает коротко, но не уходит. Иногда он замолкает на полуслове, и в этой паузе нет неловкости — только тишина, в которой можно дышать.",
            choices: [
                {
                    text: "Попрощаться",
                    close: true,
                    effects: [{ type: "changeVariable", name: "relationship_ritsu", amount: 2 }]
                }
            ]
        }
    }
};