window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.himari = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Химари поднимает глаза от книги и улыбается.",
            choices: [
                {
                    text: "Поздороваться",
                    next: "topics",
                    effects: [{ type: "setVariableFromVariable", name: "lastHimariDay", from: "day" }]
                },
                { text: "Уйти", close: true }
            ]
        },
        topics: {
            text: "— Привет. Как дела? — спрашивает она, закрывая книгу.",
            choices: [
                { text: "О книгах", next: "books", condition: { not: { flag: "himari_books_done" } } },
                { text: "О спорте", next: "sport", condition: { not: { flag: "himari_sport_done" } } },
                { text: "Об учёбе", next: "study", condition: { not: { flag: "himari_study_done" } } },
                { text: "Попрощаться", close: true }
            ]
        },

        /* ---------- Книги ---------- */

        books: {
            text: "— Я в последнее время читаю много сетевой литературы, — говорит Химари. — Мне нравится, как интернет меняет книжный мир.",
            choices: [
                {
                    text: "Это будущее литературы: публикация в интернете освобождает от цензуры и бюрократии, позволяет автору преодолеть сковывающее влияние традиций.",
                    effects: [
                        { type: "changeVariable", name: "relationship_himari", amount: 10 },
                        { type: "setFlag", flag: "himari_books_done", value: true },
                        { type: "changeVariable", name: "mood", amount: 5 }
                    ],
                    next: "books_good"
                },
                {
                    text: "Настоящие книги — бумажные. Трудности публикации закаляют автора.",
                    effects: [
                        { type: "changeVariable", name: "relationship_himari", amount: -5 },
                        { type: "setFlag", flag: "himari_books_done", value: true }
                    ],
                    next: "books_bad"
                }
            ]
        },
        books_good: {
            text: "Химари кивает, глаза загораются. — Вот именно! Ты понимаешь.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        books_bad: {
            text: "Химари поджимает губы. — Ну, каждому своё, — говорит она суше, чем раньше.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Спорт ---------- */

        sport: {
            text: "— Я не особо спортивная, — признаётся Химари. — Но иногда хожу в зал, чтобы размяться. А ты?",
            choices: [
                {
                    text: "Спорт — это важно, он даёт силы и ясность мысли.",
                    effects: [
                        { type: "changeVariable", name: "relationship_himari", amount: 5 },
                        { type: "setFlag", flag: "himari_sport_done", value: true }
                    ],
                    next: "sport_good"
                },
                {
                    text: "Не люблю спорт, предпочитаю книги.",
                    effects: [
                        { type: "changeVariable", name: "relationship_himari", amount: 2 },
                        { type: "setFlag", flag: "himari_sport_done", value: true }
                    ],
                    next: "sport_neutral"
                }
            ]
        },
        sport_good: {
            text: "Химари улыбается. — Согласна. Иногда стоит отвлечься от книг.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        sport_neutral: {
            text: "Химари тихо смеётся. — Понимаю. Я тоже больше люблю читать.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Учёба ---------- */

        study: {
            text: "— Учёба идёт своим чередом, — говорит Химари. — Сессия скоро, а я ещё не всё сдала.",
            choices: [
                {
                    text: "Ты справишься. Главное — не затягивать.",
                    effects: [
                        { type: "changeVariable", name: "relationship_himari", amount: 3 },
                        { type: "setFlag", flag: "himari_study_done", value: true }
                    ],
                    next: "study_good"
                },
                {
                    text: "Учёба — это скучно.",
                    effects: [
                        { type: "changeVariable", name: "relationship_himari", amount: -3 },
                        { type: "setFlag", flag: "himari_study_done", value: true }
                    ],
                    next: "study_bad"
                }
            ]
        },
        study_good: {
            text: "Химари благодарно кивает. — Спасибо. Постараюсь.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        study_bad: {
            text: "Химари пожимает плечами. — Ну, кому как.",
            choices: [{ text: "Попрощаться", close: true }]
        }
    }
};