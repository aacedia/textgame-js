window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.hinako = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Хинако сидит за первым столом у окна, разложив конспекты и книги. Увидев тебя, она поправляет очки и вежливо кивает.",
            choices: [
                {
                    text: "Поговорить",
                    next: "topics",
                    effects: [{ type: "setVariableFromVariable", name: "lastHinakoDay", from: "day" }]
                },
                { text: "Уйти", close: true }
            ]
        },
        topics: {
            text: "— Привет. Ты тоже пришёл заниматься? — спрашивает она, придерживая страницу пальцем.",
            choices: [
                {
                    text: "Попросить её заниматься с тобой",
                    next: "ask_study",
                    iconImage: "assets/images/ui/info.png",
                    condition: {
                        all: [
                            { not: { flag: "hinakoStudyAgreed" } },
                            { variableAtLeast: { name: "relationship_hinako", value: 20 } }
                        ]
                    }
                },
                { text: "Об учёбе", next: "study", condition: { not: { flag: "hinako_study_done" } } },
                { text: "О книгах по управлению", next: "books", condition: { not: { flag: "hinako_books_done" } } },
                { text: "О её мечте", next: "dream", condition: { not: { flag: "hinako_dream_done" } } },
                { text: "О лени и безделье", next: "lazy", condition: { not: { flag: "hinako_lazy_done" } } },
                { text: "Про очки", next: "glasses", condition: { not: { flag: "hinako_glasses_done" } } },
                { text: "О чужих ошибках", next: "mistakes", condition: { not: { flag: "hinako_mistakes_done" } } },
                {
                    text: "О том, каким должен быть руководитель",
                    next: "leader",
                    condition: { not: { flag: "hinako_leader_done" } }
                },
                {
                    text: "Как поговорить с тем, кто мало работает",
                    next: "lazy_employee",
                    condition: { not: { flag: "hinako_lazy_employee_done" } }
                },
                {
                    text: "Что делать с теми, кто опаздывает",
                    next: "late_employee",
                    condition: { not: { flag: "hinako_late_employee_done" } }
                },
                {
                    text: "О работе и отдыхе",
                    next: "rest",
                    condition: { not: { flag: "hinako_rest_done" } }
                },
                {
                    text: "Просто поболтать",
                    next: "smalltalk",
                    condition: {
                        all: [
                            { flag: "hinako_study_done" },
                            { flag: "hinako_books_done" },
                            { flag: "hinako_dream_done" },
                            { flag: "hinako_lazy_done" },
                            { flag: "hinako_glasses_done" },
                            { flag: "hinako_mistakes_done" },
                            { flag: "hinako_leader_done" },
                            { flag: "hinako_lazy_employee_done" },
                            { flag: "hinako_late_employee_done" },
                            { flag: "hinako_rest_done" }
                        ]
                    }
                },
                { text: "Попрощаться", close: true }
            ]
        },

        /* ---------- Совместные занятия ---------- */

        ask_study: {
            text: "— Хорошо, давай будем иногда готовиться к занятиям вместе.",
            choices: [
                {
                    text: "Спасибо. Буду приходить.",
                    effects: [{ type: "setFlag", flag: "hinakoStudyAgreed", value: true }],
                    next: "ask_study_yes"
                },
                {
                    text: "Ладно, как-нибудь в другой раз",
                    next: "ask_study_later"
                }
            ]
        },
        ask_study_yes: {
            text: "Хинако кивает и снова берётся за конспект. — Тогда до встречи.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        ask_study_later: {
            text: "Хинако пожимает плечами. — Как хочешь. Если передумаешь — я в библиотеке.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Учёба ---------- */

        study: {
            text: "— Хочу сказать про учёбу. — Хинако закрывает конспект, но палец оставляет между страниц. — Мне кажется, дело не в том, чтобы просто следовать правилам. Важно понимать, зачем они. Иначе всё превращается в зубрёжку. Университет как раз даёт возможность проверить себя и понять, чего ты стоишь.",
            choices: [
                {
                    text: "Согласен. Понимать правила важнее, чем просто им следовать.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 7 },
                        { type: "setFlag", flag: "hinako_study_done", value: true }
                    ],
                    next: "study_good"
                },
                {
                    text: "Но ведь на первом курсе всё равно приходится зубрить.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 3 },
                        { type: "setFlag", flag: "hinako_study_done", value: true }
                    ],
                    next: "study_neutral"
                },
                {
                    text: "Правила есть правила. Не надо выпендриваться, просто делай, что говорят.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: -5 },
                        { type: "setFlag", flag: "hinako_study_done", value: true }
                    ],
                    next: "study_bad"
                }
            ]
        },
        study_good: {
            text: "Хинако улыбается. — Приятно, когда кто-то думает так же. — Она откидывается на спинку стула. — А то обычно отвечают, что просто надо сдать и забыть.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        study_neutral: {
            text: "Хинако задумывается. — Приходится. Но если только зубрить, потом всё равно выветрится. — Она пожимает плечами. — Может, я и забегаю вперёд.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        study_bad: {
            text: "Хинако хмурится. — Вот из-за такого подхода потом никто не понимает, что делает. — Она возвращается к конспекту, давая понять, что разговор закончен.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Книги ---------- */

        books: {
            text: "— Хочу рассказать про книгу. — Хинако достаёт из стопки потрёпанный томик. — «Государь» Макиавелли. Из последнего, что я читала по управлению. Многие считают её циничной, а мне кажется, она просто честно описывает, как устроена власть.",
            choices: [
                {
                    text: "«Государь» — это про реальность, а не про жестокость. Понимать, как устроена власть, полезно.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 7 },
                        { type: "setFlag", flag: "hinako_books_done", value: true }
                    ],
                    next: "books_good"
                },
                {
                    text: "Интересный выбор. Управление — это действительно искусство.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 4 },
                        { type: "setFlag", flag: "hinako_books_done", value: true }
                    ],
                    next: "books_neutral"
                },
                {
                    text: "Макиавелли — это же про злодеев. Зачем такое читать?",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: -5 },
                        { type: "setFlag", flag: "hinako_books_done", value: true }
                    ],
                    next: "books_bad"
                }
            ]
        },
        books_good: {
            text: "Хинако оживляется. — Вот именно. Об этом мало кто задумывается. — Она кладёт книгу обратно в стопку. — Приятно, когда есть с кем обсудить.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        books_neutral: {
            text: "Хинако согласно кивает. — Да, и этому стоит учиться. — Она делает пометку в конспекте.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        books_bad: {
            text: "Хинако поджимает губы. — Это стереотип. Книга гораздо глубже, чем кажется. — Она больше не поднимает тему.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Мечта ---------- */

        dream: {
            text: "— Хочу поделиться. — Хинако немного смущается и понижает голос. — Вообще-то я хочу однажды стать директором компании. Понимаю, что звучит смело. Но я много читаю про управление и стараюсь разбираться в том, как это работает. Пока не говорю об этом многим.",
            choices: [
                {
                    text: "Это достойная цель. У тебя есть трудолюбие и знания — ты справишься.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 10 },
                        { type: "setFlag", flag: "hinako_dream_done", value: true },
                        { type: "changeVariable", name: "mood", amount: 5 }
                    ],
                    next: "dream_good"
                },
                {
                    text: "Смело — не значит плохо. Пробуй.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 4 },
                        { type: "setFlag", flag: "hinako_dream_done", value: true }
                    ],
                    next: "dream_neutral"
                },
                {
                    text: "Директор — не женское дело. Вряд ли у тебя получится.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: -10 },
                        { type: "setFlag", flag: "hinako_dream_done", value: true }
                    ],
                    next: "dream_bad"
                }
            ]
        },
        dream_good: {
            text: "Хинако загорается. — Спасибо. Ты первый, кто сказал это всерьёз. Мне это важно. — Она снова смотрит в конспект, но уже с другим выражением.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        dream_neutral: {
            text: "Хинако улыбается. — Спасибо. Постараюсь не сдаваться.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        dream_bad: {
            text: "Хинако опускает взгляд. — Вот поэтому я и стесняюсь об этом говорить… — Она замолкает и возвращается к книге.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Лень ---------- */

        lazy: {
            text: "— Хочу сказать про лень. — Хинако откладывает ручку. — Мне кажется, если у тебя есть способности, но ты их не используешь, это плохо кончается. Не обязательно сразу, но потом обязательно станет жалко. Я видела таких людей.",
            choices: [
                {
                    text: "Согласен. Не реализовать свой потенциал — хуже, чем потерпеть неудачу.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 7 },
                        { type: "setFlag", flag: "hinako_lazy_done", value: true }
                    ],
                    next: "lazy_good"
                },
                {
                    text: "Иногда полезно и отдохнуть, чтобы потом работать лучше.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 2 },
                        { type: "setFlag", flag: "hinako_lazy_done", value: true }
                    ],
                    next: "lazy_neutral"
                },
                {
                    text: "Да ладно, можно и полениться. Все так делают.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: -5 },
                        { type: "setFlag", flag: "hinako_lazy_done", value: true }
                    ],
                    next: "lazy_bad"
                }
            ]
        },
        lazy_good: {
            text: "Хинако кивает. — Именно. Лучше попробовать и ошибиться, чем не попробовать вовсе. — Она снова берёт ручку.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        lazy_neutral: {
            text: "Хинако задумывается. — Пожалуй, в этом что-то есть. Но меру знать надо.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        lazy_bad: {
            text: "Хинако хмурится. — Вот из-за такого отношения люди и застревают на месте. — Она возвращается к конспекту.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Про очки ---------- */

        glasses: {
            text: "— Про очки? — Хинако поправляет их на переносице, будто только сейчас вспомнила, что они есть. — Да, ношу с восьмого класса. Сначала стеснялась, потом привыкла. Без них всё расплывается, так что теперь это просто часть меня. Иногда даже забываю, что они на мне.",
            choices: [
                {
                    text: "Тебе идёт. Они добавляют образу серьёзности.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 5 },
                        { type: "setFlag", flag: "hinako_glasses_done", value: true }
                    ],
                    next: "glasses_good"
                },
                {
                    text: "А не мешает, когда читаешь?",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 3 },
                        { type: "setFlag", flag: "hinako_glasses_done", value: true }
                    ],
                    next: "glasses_neutral"
                },
                {
                    text: "Может, линзы? С ними было бы удобнее.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 1 },
                        { type: "setFlag", flag: "hinako_glasses_done", value: true }
                    ],
                    next: "glasses_lenses"
                }
            ]
        },
        glasses_good: {
            text: "Хинако чуть смущается, но улыбается. — Спасибо. Редко кто говорит это без шутки про ботаника.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        glasses_neutral: {
            text: "Хинако качает головой. — Не мешает. Даже наоборот — немного отгораживает от лишнего. — Она снова утыкается в конспект.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        glasses_lenses: {
            text: "Хинако задумывается. — Пробовала. Не то. В очках я лучше вижу, кто передо мной. — Она улыбается. — Звучит странно, но это правда.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- О чужих ошибках ---------- */

        mistakes: {
            text: "— Хочу рассказать, как я это вижу. — Хинако крутит ручку в пальцах. — Когда кто-то рядом ошибается, я всегда думаю: а что я могла сделать, чтобы этого не случилось? Может, не объяснила, не предупредила, не помогла вовремя. — Она делает паузу. — А когда ошибаюсь я сама, то тут всё просто. Это только моя вина, и никто больше ни при чём.",
            choices: [
                {
                    text: "Странно. За чужие ошибки ты себя винишь, а за свои — только себя.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 5 },
                        { type: "setFlag", flag: "hinako_mistakes_done", value: true }
                    ],
                    next: "mistakes_deep"
                },
                {
                    text: "Ты слишком много на себя берёшь. Люди ошибаются сами, без чьей-то помощи.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 7 },
                        { type: "setFlag", flag: "hinako_mistakes_done", value: true }
                    ],
                    next: "mistakes_good"
                },
                {
                    text: "Значит, ты просто ответственная. Это не так уж и плохо.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: -2 },
                        { type: "setFlag", flag: "hinako_mistakes_done", value: true }
                    ],
                    next: "mistakes_bad"
                }
            ]
        },
        mistakes_deep: {
            text: "Хинако задумывается. — Звучит странно, да. Но если кто-то ошибся рядом, значит, я могла помочь. А если я сама — виновата только я, потому что недосмотрела. — Она смотрит на ручку. — Логика вроде есть, а тепла в ней нет.",
            choices: [
                {
                    text: "Тепла и не нужно. Важно, что за этой логикой никто, кроме тебя, не стоит.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 6 },
                        { type: "changeVariable", name: "mood", amount: 2 }
                    ],
                    next: "mistakes_deep_cold"
                },
                {
                    text: "Может, и есть. Только ты сама её от себя прячешь.",
                    effects: [{ type: "changeVariable", name: "relationship_hinako", amount: 4 }],
                    next: "mistakes_deep_warm"
                },
                {
                    text: "А если бы кто-то винил тебя за его ошибки — ты бы что сказала?",
                    effects: [{ type: "changeVariable", name: "relationship_hinako", amount: 5 }],
                    next: "mistakes_deep_mirror"
                }
            ]
        },
        mistakes_deep_cold: {
            text: "Хинако кивает медленно. — Да. Наверное, ты прав. — Она впервые за разговор смотрит в окно, а не в конспект.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        mistakes_deep_warm: {
            text: "Хинако задумывается. — Прячу? — Она поправляет очки. — Может быть. Просто так проще — не жалеть себя лишний раз. — Она пожимает плечами. — Хотя ты, кажется, прав.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        mistakes_deep_mirror: {
            text: "Хинако долго молчит. — Сказала бы, что это глупо. — Она смотрит на тебя. — Что человек не отвечает за чужие ошибки. — Она делает паузу. — А потом поняла бы, что говорю это не себе.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        mistakes_good: {
            text: "Хинако долго молчит. — Может быть. — Она поправляет очки. — Мне просто кажется, что если я вижу, как кто-то ошибается, и молчу, то это тоже моя ошибка. Но, наверное, не всё можно предусмотреть.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        mistakes_bad: {
            text: "Хинако пожимает плечами. — Может, и так. Но иногда это чувствуется не как ответственность, а как груз. — Она возвращается к конспекту.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Каким должен быть руководитель ---------- */

        leader: {
            text: "— Хочу сказать, каким я вижу руководителя. — Хинако откладывает ручку. — Мне кажется, хороший руководитель не тот, кто всё решает сам, а тот, кто объясняет, зачем мы что-то делаем. Иначе люди просто выполняют приказы и не понимают смысла. А ещё он должен уметь признавать, что чего-то не знает. Это же не слабость.",
            choices: [
                {
                    text: "Согласен. Люди работают лучше, когда понимают, зачем это нужно.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 7 },
                        { type: "setFlag", flag: "hinako_leader_done", value: true }
                    ],
                    next: "leader_good"
                },
                {
                    text: "А если объяснять долго, работа встанет. Иногда проще приказать.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: -3 },
                        { type: "setFlag", flag: "hinako_leader_done", value: true }
                    ],
                    next: "leader_bad"
                },
                {
                    text: "А ты сама смогла бы так? Не всё решать, а объяснять?",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 4 },
                        { type: "setFlag", flag: "hinako_leader_done", value: true }
                    ],
                    next: "leader_personal"
                }
            ]
        },
        leader_good: {
            text: "Хинако кивает. — Вот именно. Когда понимаешь смысл, работу делаешь не из-под палки. — Она делает пометку в блокноте.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        leader_bad: {
            text: "Хинако хмурится. — Иногда проще. Но потом люди перестают думать сами. — Она возвращается к конспекту.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        leader_personal: {
            text: "Хинако задумывается. — Стараюсь. Иногда получается. — Она поправляет очки. — А иногда я просто объясняю всё слишком подробно и понимаю, что люди уже устали слушать.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Как поговорить с тем, кто мало работает ---------- */

        lazy_employee: {
            text: "— Хочу обсудить одну рабочую ситуацию. — Хинако задумывается. — Если сотрудник мало работает, как с ним поговорить? С одной стороны, надо спросить, в чём дело, может, у него что-то случилось. С другой — нельзя делать вид, что всё в порядке. Но и давить не хочется.",
            choices: [
                {
                    text: "Сначала выслушать. Может, причина не в лени, а в чём-то другом.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 7 },
                        { type: "setFlag", flag: "hinako_lazy_employee_done", value: true }
                    ],
                    next: "lazy_employee_good"
                },
                {
                    text: "Сразу сказать прямо: работа не выполняется, это проблема.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 4 },
                        { type: "setFlag", flag: "hinako_lazy_employee_done", value: true }
                    ],
                    next: "lazy_employee_direct"
                },
                {
                    text: "Ничего не говорить. Может, само наладится.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: -4 },
                        { type: "setFlag", flag: "hinako_lazy_employee_done", value: true }
                    ],
                    next: "lazy_employee_bad"
                }
            ]
        },
        lazy_employee_good: {
            text: "Хинако кивает. — Вот и я так думаю. Сначала надо понять, почему. — Она делает паузу. — Правда, у меня внутри всё равно звучит голос, что я могла бы заметить это раньше.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        lazy_employee_direct: {
            text: "Хинако соглашается. — Да, прямота тоже нужна. Только не с порога, а когда уже поговорили. — Она записывает что-то в блокнот.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        lazy_employee_bad: {
            text: "Хинако качает головой. — Само не наладится. Если не поговорить, всё так и останется. — Она выглядит расстроенной.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Что делать с теми, кто опаздывает ---------- */

        late_employee: {
            text: "— Ещё одна ситуация. — Хинако постукивает ручкой по столу. — Сотрудник постоянно опаздывает. Не на пять минут, а на полчаса. Один раз можно понять, а когда это система… Я не знаю, как правильно. Наказать — жёстко. Не замечать — нечестно по отношению к остальным.",
            choices: [
                {
                    text: "Поговорить и узнать причину. Может, у него что-то с дорогой или дома.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 6 },
                        { type: "setFlag", flag: "hinako_late_employee_done", value: true }
                    ],
                    next: "late_employee_good"
                },
                {
                    text: "Сначала предупредить, потом уже применять меры. Без предупреждения нечестно.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 7 },
                        { type: "setFlag", flag: "hinako_late_employee_done", value: true }
                    ],
                    next: "late_employee_warn"
                },
                {
                    text: "Сразу наказать. Иначе остальные начнут опаздывать тоже.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: -4 },
                        { type: "setFlag", flag: "hinako_late_employee_done", value: true }
                    ],
                    next: "late_employee_bad"
                }
            ]
        },
        late_employee_good: {
            text: "Хинако задумывается. — Да, наверное. Причина важнее, чем само опоздание. — Она поправляет очки. — Хотя если причина не в дороге, а в нём самом, тогда разговор будет другим.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        late_employee_warn: {
            text: "Хинако кивает. — Вот это мне нравится. Человек должен знать, что его замечают. И что у него есть шанс исправиться. — Она делает пометку.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        late_employee_bad: {
            text: "Хинако хмурится. — Жёстко. Может, и эффективно, но люди запомнят не правило, а обиду. — Она откладывает ручку.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- О работе и отдыхе ---------- */

        rest: {
            text: "— Хочу сказать про отдых. — Хинако убирает конспект в сторону. — Раньше я думала, что отдых — это потерянное время. А потом поняла, что без него и работа не идёт. Голова просто перестаёт соображать. Теперь у меня есть час в день, когда я ничего не делаю. Просто читаю что-то не по учёбе или гуляю.",
            choices: [
                {
                    text: "Хорошо, что ты это поняла. Отдых — тоже часть работы.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 7 },
                        { type: "setFlag", flag: "hinako_rest_done", value: true }
                    ],
                    next: "rest_good"
                },
                {
                    text: "Час в день — это немного. Может, стоит выделять больше?",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 3 },
                        { type: "setFlag", flag: "hinako_rest_done", value: true }
                    ],
                    next: "rest_more"
                },
                {
                    text: "А я думал, ты из тех, кто работает без перерыва.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 2 },
                        { type: "setFlag", flag: "hinako_rest_done", value: true }
                    ],
                    next: "rest_surprise"
                }
            ]
        },
        rest_good: {
            text: "Хинако улыбается. — Вот именно. Раньше я думала, что это слабость. Теперь понимаю, что это тоже дисциплина. — Она поправляет очки.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        rest_more: {
            text: "Хинако задумывается. — Может, и стоит. Но пока мне хватает. Главное — не чувствовать себя виноватой за этот час. — Она пожимает плечами.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        rest_surprise: {
            text: "Хинако усмехается. — Я тоже так думала. А потом поняла, что так можно и перегореть. — Она смотрит на конспект. — Книги по управлению меня и этому научили.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Просто поболтать ---------- */

        smalltalk: {
            text: "Вы неспешно беседуете о том о сём: о расписании, о книгах, о планах на семестр. Хинако держится спокойно и доброжелательно.",
            choices: [
                {
                    text: "Попрощаться",
                    next: "smalltalk_result",
                    effects: [{ type: "changeVariable", name: "relationship_hinako", amount: 2 }]
                }
            ]
        },
        smalltalk_result: {
            text: "Вы прощаетесь. Хинако кивает и возвращается к книге.",
            choices: [{ text: "Закрыть", close: true }]
        }
    }
};