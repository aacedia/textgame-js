window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.hinako = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Хинако сидит в холле с книгой и конспектами. Увидев тебя, она отрывается от чтения и вежливо кивает.",
            choices: [
                { text: "Поздороваться", next: "topics" },
                { text: "Уйти", close: true }
            ]
        },
        topics: {
            text: "— Привет. Ты тоже ждёшь начала занятий? — спрашивает она.",
            choices: [
                { text: "Об учёбе", next: "study", condition: { not: { flag: "hinako_study_done" } } },
                { text: "О книгах по управлению", next: "books", condition: { not: { flag: "hinako_books_done" } } },
                { text: "О её мечте", next: "dream", condition: { not: { flag: "hinako_dream_done" } } },
                { text: "О лени и безделье", next: "lazy", condition: { not: { flag: "hinako_lazy_done" } } },
                { text: "Попрощаться", close: true }
            ]
        },

        /* ---------- Учёба ---------- */

        study: {
            text: "— Я считаю, что учёба — это не просто следование правилам, — говорит Хинако. — Важно понимать, зачем они. А университет — отличный способ испытать себя и начать строить будущее.",
            choices: [
                {
                    text: "Согласен. Понимать правила важнее, чем просто им следовать. Это и есть настоящая учёба.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 7 },
                        { type: "setFlag", flag: "hinako_study_done", value: true }
                    ],
                    next: "study_good"
                },
                {
                    text: "Учёба — это вызов. Рад, что ты так к этому относишься.",
                    effects: [
                        { type: "changeVariable", name: "relationship_hinako", amount: 4 },
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
            text: "Хинако улыбается. — Приятно встретить человека, который думает так же.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        study_neutral: {
            text: "Хинако кивает. — Именно. Учёба — это проверка себя.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        study_bad: {
            text: "Хинако хмурится. — Вот из-за такого подхода люди и не раскрывают свой потенциал.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },

        /* ---------- Книги ---------- */

        books: {
            text: "— Читаю много книг по управлению персоналом, — говорит Хинако. — Из последнего — «Государь» Макиавелли. Многие считают её циничной, а мне кажется, это честная книга о реальной политике.",
            choices: [
                {
                    text: "«Государь» — это книга о реальности, а не о жестокости. Понимать, как устроена власть, — важно.",
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
            text: "Хинако оживляется. — Вот именно! Ты понимаешь. Об этом мало кто задумывается.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        books_neutral: {
            text: "Хинако согласно кивает. — Да, и этому стоит учиться.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        books_bad: {
            text: "Хинако поджимает губы. — Это стереотип. Книга гораздо глубже, чем кажется.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },

        /* ---------- Мечта ---------- */

        dream: {
            text: "Хинако немного смущается. — Вообще-то… я хочу однажды стать директором компании. Но пока об этом мало кому говорю — кажется, это слишком смело.",
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
            text: "Хинако загорается. — Спасибо. Ты первый, кто сказал это всерьёз. Мне это важно.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        dream_neutral: {
            text: "Хинако улыбается. — Спасибо. Постараюсь не сдаваться.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        dream_bad: {
            text: "Хинако опускает взгляд. — Вот поэтому я и стесняюсь об этом говорить…",
            choices: [{ text: "Продолжить", next: "topics" }]
        },

        /* ---------- Лень ---------- */

        lazy: {
            text: "— Не понимаю людей, которые ленятся, — говорит Хинако. — Если у тебя есть способности, но ты их не реализуешь — это же преступление перед собой.",
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
            text: "Хинако кивает. — Именно. Лучше попробовать и ошибиться, чем не попробовать вовсе.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        lazy_neutral: {
            text: "Хинако задумывается. — Пожалуй, в этом что-то есть. Но меру знать надо.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        lazy_bad: {
            text: "Хинако хмурится. — Вот из-за такого отношения люди и застревают на месте.",
            choices: [{ text: "Продолжить", next: "topics" }]
        }
    }
};