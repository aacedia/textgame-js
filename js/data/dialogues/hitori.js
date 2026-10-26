window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.hitori = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Парень в тёмной толстовке с капюшоном поднял голову от ноутбука. На экране мелькают строки кода. — О. Привет. Я Хитори. Ты, кажется, тоже не просто так здесь.",
            choices: [
                {
                    text: "Поздороваться",
                    next: "topics",
                    effects: [{ type: "setVariableFromVariable", name: "lastHitoriDay", from: "day" }]
                },
                { text: "Уйти", close: true }
            ]
        },
        topics: {
            text: "— О чём поговорим? — спрашивает он, не отрывая взгляда от экрана.",
            choices: [
                { text: "О технологиях", next: "tech", condition: { not: { flag: "hitori_tech_done" } } },
                { text: "О культуре безопасности", next: "security", condition: { not: { flag: "hitori_security_done" } } },
                { text: "О долгах и кредитах", next: "debt", condition: { not: { flag: "hitori_debt_done" } } },
                { text: "О корпорациях", next: "corps", condition: { not: { flag: "hitori_corps_done" } } },
                { text: "О видеоиграх", next: "games", condition: { not: { flag: "hitori_games_done" } } },
                { text: "О прогрессе и людях", next: "progress", condition: { not: { flag: "hitori_progress_done" } } },
                { text: "О книге «Атлант расправил плечи»", next: "atlas", condition: { not: { flag: "hitori_atlas_done" } } },
                {
                    text: "Ты единица или ноль?",
                    next: "binary_question",
                    condition: { not: { flag: "hitori_binary_done" } }
                },
                {
                    text: "Про автомат с напитками",
                    next: "vending",
                    iconImage: "assets/images/ui/info.png",
                    condition: {
                        all: [
                            { variableAtLeast: { name: "relationship_hitori", value: 20 } },
                            { not: { flag: "vendingHack" } }
                        ]
                    }
                },
                {
                    text: "Просто поболтать",
                    next: "smalltalk",
                    condition: {
                        all: [
                            { flag: "hitori_tech_done" },
                            { flag: "hitori_security_done" },
                            { flag: "hitori_debt_done" },
                            { flag: "hitori_corps_done" },
                            { flag: "hitori_games_done" },
                            { flag: "hitori_progress_done" },
                            { flag: "hitori_atlas_done" },
                            { flag: "hitori_binary_done" }
                        ]
                    }
                },
                { text: "Попрощаться", close: true }
            ]
        },

        /* ---------- Технологии ---------- */

        tech: {
            text: "— Технологии — это не просто инструмент, — говорит Хитори. — Это среда, в которой мы живём. Кто контролирует среду — контролирует всё. Вопрос в том, понимают ли люди, в какой среде они на самом деле находятся.",
            choices: [
                {
                    text: "Люди видят интерфейс, но не видят инфраструктуру. Это и есть главная иллюзия.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: 8 },
                        { type: "setFlag", flag: "hitori_tech_done", value: true }
                    ],
                    next: "tech_good"
                },
                {
                    text: "Технологии упрощают жизнь, зачем усложнять?",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: -3 },
                        { type: "setFlag", flag: "hitori_tech_done", value: true }
                    ],
                    next: "tech_bad"
                }
            ]
        },
        tech_good: {
            text: "Хитори впервые улыбается. — Вот именно. Ты видишь картину целиком. Это редкость.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        tech_bad: {
            text: "Хитори качает головой. — Удобство — это не аргумент. Удобство — это способ не думать.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Культура безопасности ---------- */

        security: {
            text: "— Культура безопасности — это не про замки и пароли, — говорит он. — Это про то, насколько ты доверяешь системе, которую не можешь проверить. Большинство людей даже не знают, кому они доверяют свои данные.",
            choices: [
                {
                    text: "Доверие без понимания — это не безопасность, а привычка.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: 8 },
                        { type: "setFlag", flag: "hitori_security_done", value: true }
                    ],
                    next: "security_good"
                },
                {
                    text: "Меня нечего скрывать, зачем мне это?",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: -5 },
                        { type: "setFlag", flag: "hitori_security_done", value: true }
                    ],
                    next: "security_bad"
                }
            ]
        },
        security_good: {
            text: "Хитори кивает. — Именно. «Нечего скрывать» — это фраза людей, которые не понимают, как работает власть.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        security_bad: {
            text: "Хитори усмехается. — «Нечего скрывать» — так говорят все, пока не станет поздно.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Долги и кредиты ---------- */

        debt: {
            text: "— Долги — это не про деньги, — говорит Хитори. — Это про контроль. Кредит — это способ привязать человека к системе, чтобы он не мог уйти. Пока ты должен — ты не свободен.",
            choices: [
                {
                    text: "Долг — это инструмент власти. Он делает человека предсказуемым.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: 8 },
                        { type: "setFlag", flag: "hitori_debt_done", value: true }
                    ],
                    next: "debt_good"
                },
                {
                    text: "Кредиты помогают людям жить лучше.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: -5 },
                        { type: "setFlag", flag: "hitori_debt_done", value: true }
                    ],
                    next: "debt_bad"
                }
            ]
        },
        debt_good: {
            text: "Хитори смотрит на тебя внимательно. — Ты понимаешь. Большинство — нет.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        debt_bad: {
            text: "Хитори качает головой. — Так говорят те, кто ещё не попал в ловушку.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Корпорации ---------- */

        corps: {
            text: "— Корпорации не злые, — говорит Хитори. — Они просто работают по своей логике. Проблема в том, что эта логика подчиняет себе всё остальное. Люди думают, что выбирают, а на самом деле выбирают из того, что им предложили.",
            choices: [
                {
                    text: "Корпорация — это система, которая оптимизирует всё под себя. Люди в ней — ресурс.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: 8 },
                        { type: "setFlag", flag: "hitori_corps_done", value: true }
                    ],
                    next: "corps_good"
                },
                {
                    text: "Корпорации дают людям работу и товары. Это нормально.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: -3 },
                        { type: "setFlag", flag: "hitori_corps_done", value: true }
                    ],
                    next: "corps_bad"
                }
            ]
        },
        corps_good: {
            text: "Хитори кивает. — Вот именно. Проблема не в злых людях, а в системе, которая не оставляет выбора.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        corps_bad: {
            text: "Хитори пожимает плечами. — Так говорят те, кто не смотрел на цифры.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Видеоигры ---------- */

        games: {
            text: "— Видеоигры — это не просто развлечение, — говорит Хитори. — Это симуляции. Они учат тебя видеть правила и находить выходы. Хорошая игра — это система, которую можно понять и взломать.",
            choices: [
                {
                    text: "Игры — это модели мира. В них можно безопасно учиться видеть систему.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: 7 },
                        { type: "setFlag", flag: "hitori_games_done", value: true }
                    ],
                    next: "games_good"
                },
                {
                    text: "Игры — просто чтобы убить время.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: -3 },
                        { type: "setFlag", flag: "hitori_games_done", value: true }
                    ],
                    next: "games_bad"
                }
            ]
        },
        games_good: {
            text: "Хитори улыбается. — Именно. Игра — это способ понять, как устроен мир, не платя за ошибки полную цену.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        games_bad: {
            text: "Хитори качает головой. — Всё можно свести к «убить время». Вопрос в том, что ты убиваешь вместе с ним.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Прогресс и люди (Солярис) ---------- */

        progress: {
            text: "— Люди не готовы к прогрессу, — говорит Хитори. — Мы создаём технологии, которые не понимаем. Как в «Солярисе»: мы встречаем нечто, что отражает нас самих, и не можем с этим справиться. Прогресс без понимания — это катастрофа, которую мы сами себе устраиваем.",
            choices: [
                {
                    text: "Мы создаём инструменты, которые нас же и разрушают. Потому что не понимаем себя.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: 10 },
                        { type: "setFlag", flag: "hitori_progress_done", value: true },
                        { type: "changeVariable", name: "mood", amount: 3 }
                    ],
                    next: "progress_good"
                },
                {
                    text: "Прогресс всегда был рискованным. Но мы справлялись.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: 3 },
                        { type: "setFlag", flag: "hitori_progress_done", value: true }
                    ],
                    next: "progress_neutral"
                },
                {
                    text: "Технологии делают нас лучше. Не надо бояться прогресса.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: -5 },
                        { type: "setFlag", flag: "hitori_progress_done", value: true }
                    ],
                    next: "progress_bad"
                }
            ]
        },
        progress_good: {
            text: "Хитори долго молчит. — Ты первый, кто сказал это вслух. Большинство предпочитает не думать.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        progress_neutral: {
            text: "Хитори кивает. — Может быть. Но цена растёт с каждым разом.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        progress_bad: {
            text: "Хитори усмехается. — «Не надо бояться» — так говорят те, кто не смотрел в бездну.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Атлант расправил плечи ---------- */

        atlas: {
            text: "— «Атлант расправил плечи» — это книга о том, что происходит, когда создатели уходят, — говорит Хитори. — Не о том, что они злые или добрые, а о том, что система, которая их не ценит, рушится. Это не про политику, это про механику.",
            choices: [
                {
                    text: "Система, которая не ценит создателей, обречена. Это закон, а не мораль.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: 10 },
                        { type: "setFlag", flag: "hitori_atlas_done", value: true }
                    ],
                    next: "atlas_good"
                },
                {
                    text: "Это слишком радикально. Люди не должны бросать друг друга.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: -3 },
                        { type: "setFlag", flag: "hitori_atlas_done", value: true }
                    ],
                    next: "atlas_bad"
                }
            ]
        },
        atlas_good: {
            text: "Хитори кивает. — Ты понимаешь. Это не про эгоизм, это про причинно-следственные связи.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        atlas_bad: {
            text: "Хитори пожимает плечами. — Это не про «бросать». Это про то, что нельзя бесконечно брать, не давая ничего взамен.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Диалог «единица или ноль» ---------- */

        binary_question: {
            text: "Хитори отрывается от экрана и смотрит прямо на тебя. — Скажи мне вот что. Ты единица или ноль? Задайся этим вопросом. Ты «да» или «нет»? Ты будешь действовать или сидишь сложа руки?",
            choices: [
                {
                    text: "Я единица. Я действую.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: 10 },
                        { type: "setFlag", flag: "hitori_binary_done", value: true }
                    ],
                    next: "binary_yes"
                },
                {
                    text: "Жизнь не двоична. В ней есть оттенки.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: 3 },
                        { type: "setFlag", flag: "hitori_binary_done", value: true }
                    ],
                    next: "binary_no"
                },
                {
                    text: "Ты слишком долго смотрел в монитор. В жизни не всё двоично.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hitori", amount: 5 },
                        { type: "setFlag", flag: "hitori_binary_done", value: true }
                    ],
                    next: "binary_smart"
                }
            ]
        },
        binary_yes: {
            text: "Хитори медленно кивает. — Хорошо. Тогда ты знаешь, что делать. Единица не ждёт разрешения.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        binary_no: {
            text: "Хитори хмурится. — Оттенки — это то, чем оправдывают бездействие. В критический момент ты либо действуешь, либо нет.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        binary_smart: {
            text: "Хитори тихо смеётся. — Неплохо. Может, ты и прав. Но помни: даже в сером мире есть моменты, когда нужно выбрать сторону.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Автомат с напитками ---------- */

        vending: {
            text: "Хитори поднимает взгляд от ноутбука. — Автомат снаружи? Да, я его знаю. Старый, часто ломается: то мотор заест, то лоток не откроется. А то и вовсе — съест деньги и ничего не выдаст. Инженеры приезжают редко, так что он подолгу стоит непочиненный. — Он на секунду задумывается. — Слушай, у меня есть скрипт. Он выдаёт тебя за сервисную службу и запускает проверку мотора. Если сработает — напиток упадёт в лоток. Бесплатно. Пользуйся, пока не починили по-настоящему.",
            choices: [
                {
                    text: "Спасибо, выручил.",
                    effects: [
                        { type: "setFlag", flag: "vendingHack", value: true },
                        { type: "changeVariable", name: "relationship_hitori", amount: 3 }
                    ],
                    next: "vending_given"
                },
                { text: "Не надо, обойдусь", next: "topics" }
            ]
        },
        vending_given: {
            text: "— Только не наглей, — усмехается Хитори. — Раз в день, и то если повезёт. Мотор капризный: иногда просто гудит и ничего не выдаёт. — Он скидывает тебе скрипт на телефон.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Просто поболтать ---------- */

        smalltalk: {
            text: "Вы болтаете о всяких мелочах: о погоде, о новых гаджетах, о том, кто сегодня в сети. Хитори говорит сдержанно, но чувствуется, что ему интересно.",
            choices: [
                {
                    text: "Попрощаться",
                    next: "smalltalk_result",
                    effects: [{ type: "changeVariable", name: "relationship_hitori", amount: 2 }]
                }
            ]
        },
        smalltalk_result: {
            text: "Вы прощаетесь. Хитори кивает и возвращается к ноутбуку.",
            choices: [{ text: "Закрыть", close: true }]
        }
    }
};