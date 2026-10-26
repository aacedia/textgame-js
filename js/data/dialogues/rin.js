window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.rin = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Девушка с чуть хрипловатым голосом поднимает глаза от экрана ноутбука. Под глазами тени, пальцы чуть дрожат, но смотрит она уверенно. — Привет. Я Рин. Читаю и пишу сетевую литературу. Если ты не против — я буду вслух считать твой рейтинг.",
            choices: [
                {
                    text: "Поздороваться",
                    next: "topics",
                    effects: [{ type: "setVariableFromVariable", name: "lastRinDay", from: "day" }]
                },
                { text: "Уйти", close: true }
            ]
        },
        topics: {
            text: "— О чём поговорим? — спрашивает она, не отрываясь от клавиатуры.",
            choices: [
                { text: "О сетевой литературе", next: "webnovels", condition: { not: { flag: "rin_webnovels_done" } } },
                { text: "Об издательствах", next: "publishers", condition: { not: { flag: "rin_publishers_done" } } },
                { text: "О курении", next: "smoking", condition: { not: { flag: "rin_smoking_done" } } },
                { text: "О фанфиках", next: "fanfics", condition: { not: { flag: "rin_fanfics_done" } } },
                { text: "О моддинге игр", next: "modding", condition: { not: { flag: "rin_modding_done" } } },
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

        /* ---------- Сетевая литература ---------- */

        webnovels: {
            text: "— Я пишу в сети, — говорит Рин. — Доход — донаты. На жизнь не хватает, но зато никто не говорит мне, что глава слишком длинная, а мрачность — «неформат». Издательства штампуют булыжники и игнорируют бриллианты. Я решила, что мой бриллиант будет в сети.",
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
            text: "Рин усмехается, но в глазах что-то теплеет. — Плюс десять. Ты понимаешь. Большинство советует «найти нормальную работу».",
            choices: [{ text: "Попрощаться", close: true }]
        },
        webnovels_bad: {
            text: "Рин морщится. — Минус пять. Компромисс — это когда ты режешь себя, чтобы влезть в чужой формат. Я лучше буду голодать, но писать то, что хочу.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Издательства ---------- */

        publishers: {
            text: "— Издательства, — Рин произносит это почти с отвращением. — Они не ищут хорошее. Они ищут продаваемое. Мрачное, длинное, неудобное — не пройдёт цензуру, не влезет в бюджет. А потом они удивляются, почему люди читают в сети.",
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
            text: "Рин достаёт сигарету, крутит её в пальцах, потом убирает обратно. — Хочу бросить. Правда хочу. Но воли не хватает. Говорят, это привычка. Мне кажется, это просто способ чем-то занять руки, пока думаешь.",
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
        smoking_bad: {
            text: "Рин поджимает губы. — Минус три. «Просто возьми и брось». Как будто я не пробовала. — Она снова достаёт сигарету и на этот раз закуривает.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Фанфики ---------- */

        fanfics: {
            text: "— Фанфики — это отдельный разговор, — говорит Рин. — С одной стороны, там горы мусора. С другой — талантливые авторы раскрывают произведения под новыми углами, соединяют миры, меняют роли персонажей. Так произведение живёт вечно.",
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
            text: "— Я играю только в те игры, которые можно модить, — говорит Рин. — Игра — это не то, что проходишь пару раз. Это мир, в котором живёшь и который можешь менять вместе с другими людьми. Моддинг — это соавторство.",
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

        /* ---------- Просто поболтать ---------- */

        smalltalk: {
            text: "Вы говорите ни о чём: о погоде, о том, кто сегодня в сети, о книге, которую она дочитывает. Рин отвечает коротко, но не уходит.",
            choices: [
                {
                    text: "Попрощаться",
                    next: "smalltalk_result",
                    effects: [{ type: "changeVariable", name: "relationship_rin", amount: 2 }]
                }
            ]
        },
        smalltalk_result: {
            text: "Вы прощаетесь. Рин кивает и снова утыкается в экран. — Плюс два. Пока.",
            choices: [{ text: "Закрыть", close: true }]
        }
    }
};