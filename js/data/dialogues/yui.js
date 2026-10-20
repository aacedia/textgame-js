window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.yui = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Юи сидит на лавочке в наушниках, пританцовывая в такт музыке. Заметив тебя, она вынимает один наушник и улыбается.",
            choices: [
                { text: "Поздороваться", next: "topics" },
                { text: "Уйти", close: true }
            ]
        },
        topics: {
            text: "— Привет, сосед. Как дела? — спрашивает она.",
            choices: [
                { text: "Об учёбе", next: "study", condition: { not: { flag: "yui_study_done" } } },
                { text: "О видеоиграх", next: "games", condition: { not: { flag: "yui_games_done" } } },
                { text: "О музыке", next: "music", condition: { not: { flag: "yui_music_done" } } },
                { text: "О жизни в городе", next: "city", condition: { not: { flag: "yui_city_done" } } },
                { text: "Попрощаться", close: true }
            ]
        },

        /* ---------- Учёба ---------- */

        study: {
            text: "— Учиться мне нравится, — говорит Юи. — Но когда задают слишком много заданий, руки опускаются. Хочется ведь и отдохнуть.",
            choices: [
                {
                    text: "Ты справишься. Главное — не сдаваться и идти к своей цели.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 5 },
                        { type: "setFlag", flag: "yui_study_done", value: true }
                    ],
                    next: "study_good"
                },
                {
                    text: "Понимаю. Заданий действительно много.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 2 },
                        { type: "setFlag", flag: "yui_study_done", value: true }
                    ],
                    next: "study_neutral"
                },
                {
                    text: "Может, учёба вообще не для тебя?",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: -5 },
                        { type: "setFlag", flag: "yui_study_done", value: true }
                    ],
                    next: "study_bad"
                }
            ]
        },
        study_good: {
            text: "Юи благодарно кивает. — Спасибо. Мне это нужно было услышать.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        study_neutral: {
            text: "— Вот и я о том же, — вздыхает она.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        study_bad: {
            text: "Юи хмурится. — Ну спасибо. Я вообще-то стараюсь.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },

        /* ---------- Видеоигры ---------- */

        games: {
            text: "— Люблю казуальные игры, — говорит Юи. — Что-нибудь простое, чтобы расслабиться после учёбы. А ты играешь?",
            choices: [
                {
                    text: "Казуальные игры — отличный способ отдохнуть. Понимаю.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 5 },
                        { type: "setFlag", flag: "yui_games_done", value: true }
                    ],
                    next: "games_good"
                },
                {
                    text: "Казуалки — это не настоящие игры.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: -5 },
                        { type: "setFlag", flag: "yui_games_done", value: true }
                    ],
                    next: "games_bad"
                }
            ]
        },
        games_good: {
            text: "Юи улыбается. — Вот и я так думаю. Главное — удовольствие.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        games_bad: {
            text: "Юи пожимает плечами. — Ну, у каждого свой вкус, — говорит она суше.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },

        /* ---------- Музыка ---------- */

        music: {
            text: "— Я слушаю в основном электронную музыку, — говорит Юи. — Нравится лёгкое звучание. Но вообще могу говорить о любой музыке — главное, чтобы человеку нравилось.",
            choices: [
                {
                    text: "Мне больше по душе другой жанр, но каждому своё. Главное — чтобы нравилось.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 5 },
                        { type: "setFlag", flag: "yui_music_done", value: true }
                    ],
                    next: "music_good"
                },
                {
                    text: "Люблю разную музыку, смотрю по настроению.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 3 },
                        { type: "setFlag", flag: "yui_music_done", value: true }
                    ],
                    next: "music_neutral"
                },
                {
                    text: "Рок — плохая музыка, вот электроника — другое дело.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: -5 },
                        { type: "setFlag", flag: "yui_music_done", value: true }
                    ],
                    next: "music_bad"
                }
            ]
        },
        music_good: {
            text: "Юи кивает. — Вот это правильный подход. Не люблю, когда жанры делят на плохие и хорошие.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        music_neutral: {
            text: "— Понимаю, — говорит Юи. — Я тоже иногда слушаю что-то другое.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        music_bad: {
            text: "Юи поджимает губы. — Не люблю, когда так говорят. Музыка — дело вкуса.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },

        /* ---------- Жизнь в городе ---------- */

        city: {
            text: "— Мы с подругой снимаем квартиру неподалёку, — рассказывает Юи. — Обе приехали из деревень. Я хочу выучиться в университете и остаться работать в городе. Правда, иногда кажется, что это слишком смелые планы.",
            choices: [
                {
                    text: "У тебя всё получится. Ты целеустремлённая, а это главное.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 10 },
                        { type: "setFlag", flag: "yui_city_done", value: true },
                        { type: "changeVariable", name: "mood", amount: 5 }
                    ],
                    next: "city_good"
                },
                {
                    text: "Вряд ли что-то получится. Скорее всего, придётся вернуться в деревню.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: -10 },
                        { type: "setFlag", flag: "yui_city_done", value: true }
                    ],
                    next: "city_bad"
                }
            ]
        },
        city_good: {
            text: "Юи загорается. — Спасибо! Ты первый, кто так говорит. Мне это важно.",
            choices: [{ text: "Продолжить", next: "topics" }]
        },
        city_bad: {
            text: "Юи опускает взгляд. — Может, ты и прав… — тихо говорит она и замолкает.",
            choices: [{ text: "Продолжить", next: "topics" }]
        }
    }
};