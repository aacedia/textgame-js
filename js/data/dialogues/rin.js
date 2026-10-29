window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.rin = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Девушка с чуть хрипловатым голосом поднимает глаза от экрана ноутбука. Под глазами тени, пальцы чуть дрожат, но смотрит она уверенно. — Привет. Я Рин. Пишу сетевую литературу. Если не против — я буду вслух считать твой рейтинг.",
            choices: [
                {
                    text: "Поговорить",
                    next: "topics",
                    effects: [{ type: "setVariableFromVariable", name: "lastRinDay", from: "day" }]
                },
                { text: "Уйти", close: true }
            ]
        },
        topics: {
            text: "— О чём поговорим? — спрашивает она, не отрываясь от клавиатуры.",
            choices: [
                {
                    text: "Спросить, что она пишет",
                    next: "about_writing",
                    condition: { not: { flag: "rin_about_writing" } }
                },
                { text: "О сетевой литературе", next: "webnovels", condition: { not: { flag: "rin_webnovels_done" } } },
                { text: "Об издательствах", next: "publishers", condition: { not: { flag: "rin_publishers_done" } } },
                { text: "О курении", next: "smoking", condition: { not: { flag: "rin_smoking_done" } } },
                { text: "О фанфиках", next: "fanfics", condition: { not: { flag: "rin_fanfics_done" } } },
                { text: "О моддинге игр", next: "modding", condition: { not: { flag: "rin_modding_done" } } },
                { text: "О критике", next: "criticism", condition: { not: { flag: "rin_criticism_done" } } },
                { text: "О донатах", next: "donations", condition: { not: { flag: "rin_donations_done" } } },
                { text: "О её читателях", next: "readers", condition: { not: { flag: "rin_readers_done" } } },
                { text: "О её сне", next: "sleep", condition: { not: { flag: "rin_sleep_done" } } },
                {
                    text: "Просто поболтать",
                    next: "smalltalk",
                    condition: {
                        all: [
                            { flag: "rin_webnovels_done" },
                            { flag: "rin_publishers_done" },
                            { flag: "rin_smoking_done" },
                            { flag: "rin_fanfics_done" },
                            { flag: "rin_modding_done" }
                        ]
                    }
                },
                { text: "Попрощаться", close: true }
            ]
        },

        /* ---------- О чём она пишет ---------- */

        about_writing: {
            text: "— Пишу длинную историю. — Рин на секунду отрывается от экрана. — Про людей со способностями, но не про супергероев в плащах. Скорее про то, как способности ломают человека, а не делают его лучше. И про систему, которая делит всех на «своих» и «опасных».",
            choices: [
                {
                    text: "То есть способности у тебя — не подарок, а проблема?",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 5 },
                        { type: "setFlag", flag: "rin_about_writing", value: true }
                    ],
                    next: "about_writing_good"
                },
                {
                    text: "А что именно за система?",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 3 },
                        { type: "setFlag", flag: "rin_about_writing", value: true }
                    ],
                    next: "about_writing_deep"
                },
                {
                    text: "Про способности сейчас пишут все. Чем твоё отличается?",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: -3 },
                        { type: "setFlag", flag: "rin_about_writing", value: true }
                    ],
                    next: "about_writing_bad"
                }
            ]
        },
        about_writing_good: {
            text: "Рин усмехается. — Плюс пять. Ты понимаешь. — Она снова смотрит в экран. — Большинство хочет, чтобы им рассказали, что герои спасают мир. А я пишу о том, как они не спасают даже себя.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        about_writing_deep: {
            text: "Рин задумывается. — Система, в которой есть правильные и неправильные. И люди, которые пытаются выжить на границе. — Она пожимает плечами. — Звучит как антиутопия. Но я пишу не про будущее, а про настоящее. Просто с другого угла.",
            choices: [
                {
                    text: "За такими историями обычно стоит что-то личное. Не только сюжет.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 6 },
                        { type: "changeVariable", name: "mood", amount: 2 }
                    ],
                    next: "about_writing_deep_good"
                },
                { text: "Попрощаться", close: true }
            ]
        },
        about_writing_deep_good: {
            text: "Рин кивает. — Стоит. — Она больше ничего не добавляет, но в её молчании нет отстранённости.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        about_writing_bad: {
            text: "Рин пожимает плечами. — Тем, что я не пишу про силу как про конфету. — Она возвращается к клавиатуре. — У меня способности — это скорее болезнь, чем подарок.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Сетевая литература ---------- */

        webnovels: {
            text: "— Хочу рассказать про сетевую литературу. — Рин откидывается на спинку стула. — Я пишу в сети, доход — донаты. На жизнь не хватает, но зато никто не говорит, что глава слишком длинная или что мрачность — неформат. Издательства штампуют булыжники и игнорируют бриллианты. Мой бриллиант будет в сети.",
            choices: [
                {
                    text: "Сеть даёт свободу, которой нет у издательств. Пиши так, как хочешь ты.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 10 },
                        { type: "setFlag", flag: "rin_webnovels_done", value: true }
                    ],
                    next: "webnovels_good"
                },
                {
                    text: "Донаты — это нестабильно. Может, стоит пойти на компромисс с издательством?",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: -5 },
                        { type: "setFlag", flag: "rin_webnovels_done", value: true }
                    ],
                    next: "webnovels_bad"
                }
            ]
        },
        webnovels_good: {
            text: "Рин усмехается, но в глазах что-то теплеет. — Плюс десять. Ты понимаешь. Большинство советует найти нормальную работу.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        webnovels_bad: {
            text: "Рин морщится. — Минус пять. Компромисс — это когда ты режешь себя, чтобы влезть в чужой формат. Я лучше буду голодать, но писать то, что хочу.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Издательства ---------- */

        publishers: {
            text: "— Хочу сказать про издательства. — Рин произносит это почти с отвращением. — Они не ищут хорошее. Они ищут продаваемое. Мрачное, длинное, неудобное — не пройдёт цензуру, не влезет в бюджет. А потом они удивляются, почему люди читают в сети.",
            choices: [
                {
                    text: "Они боятся риска. Сеть рисковать не боится — и потому там живёт литература.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 10 },
                        { type: "setFlag", flag: "rin_publishers_done", value: true }
                    ],
                    next: "publishers_good"
                },
                {
                    text: "Без издательств литература бы не выжила. Нужны деньги, редактура, продвижение.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: -5 },
                        { type: "setFlag", flag: "rin_publishers_done", value: true }
                    ],
                    next: "publishers_bad"
                }
            ]
        },
        publishers_good: {
            text: "Рин кивает. — Плюс десять. Именно. Они продают безопасное. А безопасное — это мёртвое.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        publishers_bad: {
            text: "Рин качает головой. — Минус пять. Редактура — это хорошо. Но когда редактор говорит «уберите мрачное», это уже не редактура, а цензура.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Курение ---------- */

        smoking: {
            text: "— Хочу сказать про курение. — Рин достаёт сигарету, крутит её в пальцах, потом убирает обратно. — Хочу бросить. Правда хочу. Но воли не хватает. Говорят, это привычка. Мне кажется, это просто способ чем-то занять руки, пока думаешь.",
            choices: [
                {
                    text: "Ты уже сделала первый шаг — призналась себе. Остальное приложится.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 7 },
                        { type: "setFlag", flag: "rin_smoking_done", value: true }
                    ],
                    next: "smoking_good"
                },
                {
                    text: "А что, если попробовать заменить сигарету чем-то другим?",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 5 },
                        { type: "setFlag", flag: "rin_smoking_done", value: true }
                    ],
                    next: "smoking_idea"
                },
                {
                    text: "Просто возьми и брось. Сила воли — это выбор.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: -3 },
                        { type: "setFlag", flag: "rin_smoking_done", value: true }
                    ],
                    next: "smoking_bad"
                }
            ]
        },
        smoking_good: {
            text: "Рин тихо смеётся, чуть хрипло. — Плюс семь. Спасибо. Может, и правда приложится.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        smoking_idea: {
            text: "Рин задумывается. — Чем-то другим. — Она смотрит на блокнот. — Может, писать в такие моменты. Или грызть что-нибудь. — Она пожимает плечами. — Надо попробовать.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        smoking_bad: {
            text: "Рин поджимает губы. — Минус три. «Просто возьми и брось». Как будто я не пробовала. — Она снова достаёт сигарету и на этот раз закуривает.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Фанфики ---------- */

        fanfics: {
            text: "— Хочу рассказать про фанфики. — Рин оживляется. — Это отдельный разговор. С одной стороны, там горы мусора. С другой — талантливые авторы раскрывают произведения под новыми углами, соединяют миры, меняют роли персонажей. Так произведение живёт вечно.",
            choices: [
                {
                    text: "Фанфик — это способ продолжить разговор с книгой. Даже плохой фанфик — это чей-то разговор.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 10 },
                        { type: "setFlag", flag: "rin_fanfics_done", value: true }
                    ],
                    next: "fanfics_good"
                },
                {
                    text: "Фанфики — это вторично. Настоящее искусство — только оригинальное.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: -5 },
                        { type: "setFlag", flag: "rin_fanfics_done", value: true }
                    ],
                    next: "fanfics_bad"
                }
            ]
        },
        fanfics_good: {
            text: "Рин кивает. — Плюс десять. Именно. Оригинал — это точка. Фанфик — это линия, которая из неё выходит. И линий может быть бесконечно много.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        fanfics_bad: {
            text: "Рин пожимает плечами. — Минус пять. Шекспир тоже брал сюжеты у других. Вторичность — это не про фанфики. Это про тех, кто не умеет рассказать по-своему.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Моддинг ---------- */

        modding: {
            text: "— Хочу рассказать про моддинг. — Рин улыбается. — Я играю только в те игры, которые можно модить. Игра — это не то, что проходишь пару раз. Это мир, в котором живёшь и который можешь менять вместе с другими людьми. Моддинг — это соавторство.",
            choices: [
                {
                    text: "Моддинг превращает игру из продукта в сообщество. Это честнее, чем «пройти и забыть».",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 10 },
                        { type: "setFlag", flag: "rin_modding_done", value: true }
                    ],
                    next: "modding_good"
                },
                {
                    text: "Моды — это самодеятельность. Настоящая игра должна быть законченной.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: -5 },
                        { type: "setFlag", flag: "rin_modding_done", value: true }
                    ],
                    next: "modding_bad"
                }
            ]
        },
        modding_good: {
            text: "Рин оживляется. — Плюс десять. Вот. Игра без модов — это книга, которую нельзя переписать. А я хочу переписывать.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        modding_bad: {
            text: "Рин морщится. — Минус пять. Законченная игра — это музей. А я хочу жить, а не ходить по музею.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- О критике ---------- */

        criticism: {
            text: "— Хочу сказать про критику. — Рин откидывается на спинку. — Я не против, когда ругают. Я против, когда ругают и не говорят, как сделать лучше. Потому что «мне не понравилось» — это не мнение. Это погода.",
            choices: [
                {
                    text: "Критика без аргументов — просто шум. Но и автору стоит уметь слушать.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 7 },
                        { type: "setFlag", flag: "rin_criticism_done", value: true }
                    ],
                    next: "criticism_good"
                },
                {
                    text: "А если тебе прямо скажут, что текст плохой, ты не обидишься?",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 4 },
                        { type: "setFlag", flag: "rin_criticism_done", value: true }
                    ],
                    next: "criticism_personal"
                },
                {
                    text: "Может, критики просто не хотят тратить время на объяснения.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: -3 },
                        { type: "setFlag", flag: "rin_criticism_done", value: true }
                    ],
                    next: "criticism_bad"
                }
            ]
        },
        criticism_good: {
            text: "Рин кивает. — Именно. И автор должен уметь отличить шум от замечаний. — Она чуть улыбается. — Я этому учусь. Медленно.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        criticism_personal: {
            text: "Рин задумывается. — Обижусь. — Она пожимает плечами. — Потом подумаю. Потом, может, исправлю. Но сначала обижусь. Это нормально.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        criticism_bad: {
            text: "Рин хмурится. — Тогда это не критика, а лень. — Она снова смотрит в экран. — Мне такое не нужно.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- О донатах ---------- */

        donations: {
            text: "— Хочу рассказать про донаты. — Рин чуть морщится. — Это странная штука. С одной стороны — ты зависишь от читателей. С другой — они же тебя и держат. Когда кто-то платит, чтобы ты написал следующую главу, — это и поддержка, и давление. Я пока не научилась относиться к этому спокойно.",
            choices: [
                {
                    text: "Донат — это не заказ. Это «продолжай». Разница большая.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 7 },
                        { type: "setFlag", flag: "rin_donations_done", value: true }
                    ],
                    next: "donations_good"
                },
                {
                    text: "А если донатов не будет? Ты бросишь писать?",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 4 },
                        { type: "setFlag", flag: "rin_donations_done", value: true }
                    ],
                    next: "donations_personal"
                },
                {
                    text: "Тогда найди работу и пиши в свободное время. Надёжнее.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: -4 },
                        { type: "setFlag", flag: "rin_donations_done", value: true }
                    ],
                    next: "donations_bad"
                }
            ]
        },
        donations_good: {
            text: "Рин задумывается. — Продолжай. — Она кивает. — Мне нравится эта формулировка. Надо будет запомнить.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        donations_personal: {
            text: "Рин отвечает не сразу. — Не брошу. — Она пожимает плечами. — Но станет тяжелее. И мрачнее. Хотя куда уж.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        donations_bad: {
            text: "Рин морщится. — Именно поэтому я и пишу в сети. Чтобы не было «свободного времени». — Она больше не поднимает тему.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- О её читателях ---------- */

        readers: {
            text: "— Хочу рассказать про читателей. — Рин улыбается, но устало. — У меня есть несколько постоянных. Одна девушка пишет длинные комментарии после каждой главы. Парень с ником вроде «void_11» присылает донаты без сообщений. Есть кто-то, кто читает молча и никогда не появляется. Я думаю и о нём тоже.",
            choices: [
                {
                    text: "Молчаливые читатели — тоже читатели. Просто они не пишут.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 7 },
                        { type: "setFlag", flag: "rin_readers_done", value: true }
                    ],
                    next: "readers_good"
                },
                {
                    text: "Тебе важно, что о тебе думают?",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 4 },
                        { type: "setFlag", flag: "rin_readers_done", value: true }
                    ],
                    next: "readers_personal"
                },
                {
                    text: "Комментарии — это же не главное. Главное — текст.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: -2 },
                        { type: "setFlag", flag: "rin_readers_done", value: true }
                    ],
                    next: "readers_bad"
                }
            ]
        },
        readers_good: {
            text: "Рин кивает. — Вот. Молчаливые — тоже. — Она смотрит в экран. — Иногда я пишу именно для них. Для тех, кто не напишет, но вернётся.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        readers_personal: {
            text: "Рин задумывается. — Важно. — Она пожимает плечами. — Я не пишу в стол. Я пишу, чтобы кто-то прочитал. Если бы было всё равно, я бы просто вела дневник.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        readers_bad: {
            text: "Рин пожимает плечами. — Главное — текст. Но текст без читателя — это просто файл. — Она снова утыкается в экран.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- О её сне ---------- */

        sleep: {
            text: "— Хочешь знать про мой сон? — Рин зевает, прикрывая рот ладонью. — Я почти не сплю. Пишу ночью, потому что днём слишком шумно. Утром отсыпаюсь. Иногда мне кажется, что я живу в другом часовом поясе, чем весь город.",
            choices: [
                {
                    text: "А днём не пробовала писать? Может, было бы проще.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 4 },
                        { type: "setFlag", flag: "rin_sleep_done", value: true }
                    ],
                    next: "sleep_day"
                },
                {
                    text: "Ночью тише. Понимаю. Но так можно и здоровье посадить.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: 7 },
                        { type: "setFlag", flag: "rin_sleep_done", value: true }
                    ],
                    next: "sleep_health"
                },
                {
                    text: "Тогда понятно, почему у тебя такой вид.",
                    effects: [
                        { type: "changeVariable", name: "relationship_rin", amount: -3 },
                        { type: "setFlag", flag: "rin_sleep_done", value: true }
                    ],
                    next: "sleep_bad"
                }
            ]
        },
        sleep_day: {
            text: "Рин качает головой. — Пробовала. Не идёт. — Она пожимает плечами. — Днём слишком много людей. Даже в комнате одной слишком шумно. Ночью тише — и снаружи, и внутри.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        sleep_health: {
            text: "Рин вздыхает. — Знаю. — Она смотрит в блокнот. — Но пока не могу иначе. Может, когда-нибудь.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        sleep_bad: {
            text: "Рин поджимает губы. — Спасибо, я знаю, как выгляжу. — Она возвращается к экрану.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Просто поболтать ---------- */

        smalltalk: {
            text: "Вы говорите ни о чём: о погоде, о том, кто сегодня в сети, о книге, которую она дочитывает.",
            choices: [
                {
                    text: "Попрощаться",
                    close: true,
                    effects: [{ type: "changeVariable", name: "relationship_rin", amount: 2 }]
                }
            ]
        }
    }
};