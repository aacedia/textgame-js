window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.yui = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Юи сидит на лавочке в наушниках, пританцовывая в такт музыке. Заметив тебя, она вынимает один наушник и улыбается.",
            choices: [
                {
                    text: "Поговорить",
                    next: "topics",
                    effects: [{ type: "setVariableFromVariable", name: "lastYuiDay", from: "day" }]
                },
                { text: "Уйти", close: true }
            ]
        },
        topics: {
            text: "— Привет, сосед. Как дела? — спрашивает она, наматывая провод наушников на палец.",
            choices: [
                { text: "Об учёбе", next: "study", condition: { not: { flag: "yui_study_done" } } },
                { text: "О видеоиграх", next: "games", condition: { not: { flag: "yui_games_done" } } },
                { text: "О музыке", next: "music", condition: { not: { flag: "yui_music_done" } } },
                { text: "О жизни в городе", next: "city", condition: { not: { flag: "yui_city_done" } } },
                { text: "О деревне", next: "village", condition: { not: { flag: "yui_village_done" } } },
                { text: "О наушниках", next: "headphones", condition: { not: { flag: "yui_headphones_done" } } },
                { text: "О соседях", next: "roommates", condition: { not: { flag: "yui_roommates_done" } } },
                { text: "О еде", next: "food", condition: { not: { flag: "yui_food_done" } } },
                {
                    text: "Просто поболтать",
                    next: "smalltalk",
                    condition: {
                        all: [
                            { flag: "yui_study_done" },
                            { flag: "yui_games_done" },
                            { flag: "yui_music_done" },
                            { flag: "yui_city_done" },
                            { flag: "yui_village_done" },
                            { flag: "yui_headphones_done" },
                            { flag: "yui_roommates_done" },
                            { flag: "yui_food_done" }
                        ]
                    }
                },
                { text: "Попрощаться", close: true }
            ]
        },

        /* ---------- Учёба ---------- */

        study: {
            text: "— Хочу сказать про учёбу. — Юи вздыхает. — Мне нравится учиться, правда. Но когда задают слишком много, руки опускаются. Хочется ведь и отдохнуть. А потом чувствуешь себя виноватой, что отдыхаешь.",
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
            text: "Юи благодарно кивает. — Спасибо. Мне это нужно было услышать. — Она снова улыбается. — Иногда кажется, что я одна так переживаю.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        study_neutral: {
            text: "— Вот и я о том же, — вздыхает она. — Но всё равно надо как-то успевать.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        study_bad: {
            text: "Юи хмурится. — Ну спасибо. Я вообще-то стараюсь. — Она снова надевает наушник.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Игры ---------- */

        games: {
            text: "— Хочу сказать про игры. — Юи оживляется. — Люблю казуальные. Что-нибудь простое, чтобы расслабиться после учёбы. А ты играешь?",
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
                    text: "Играю, но в основном в сюжетные.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 3 },
                        { type: "setFlag", flag: "yui_games_done", value: true }
                    ],
                    next: "games_mixed"
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
            text: "Юи улыбается. — Вот и я так думаю. Главное — удовольствие. — Она чуть покачивает головой в такт музыке.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        games_mixed: {
            text: "Юи кивает. — Сюжетные — это здорово. Но у меня после них голова гудит, а казуалки как чай. — Она смеётся.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        games_bad: {
            text: "Юи пожимает плечами. — Ну, у каждого свой вкус, — говорит она суше.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Музыка ---------- */

        music: {
            text: "— Хочу рассказать про музыку. — Юи приподнимает наушник. — Слушаю в основном электронную. Нравится лёгкое звучание. Но вообще могу говорить о любой музыке — главное, чтобы человеку нравилось.",
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
            text: "Юи кивает. — Вот это правильный подход. Не люблю, когда жанры делят на плохие и хорошие. — Она улыбается. — Музыка — это же не соревнование.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        music_neutral: {
            text: "— Понимаю, — говорит Юи. — Я тоже иногда слушаю что-то другое. — Она снова приподнимает наушник.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        music_bad: {
            text: "Юи поджимает губы. — Не люблю, когда так говорят. Музыка — дело вкуса. — Она больше не поднимает тему.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Город ---------- */

        city: {
            text: "— Хочу рассказать про город. — Юи откидывается на спинку лавочки. — Мы с подругой снимаем квартиру неподалёку. Обе приехали из деревень. Я хочу выучиться в университете и остаться работать в городе. Правда, иногда кажется, что это слишком смелые планы.",
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
                    text: "А что именно тебя держит здесь?",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 5 },
                        { type: "setFlag", flag: "yui_city_done", value: true }
                    ],
                    next: "city_why"
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
            text: "Юи загорается. — Спасибо! Ты первый, кто так говорит. Мне это важно. — Она снова улыбается, и в этой улыбке больше уверенности.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        city_why: {
            text: "Юи задумывается. — Здесь больше возможностей. И людей. — Она пожимает плечами. — В деревне все друг друга знают, и это здорово, но иногда кажется, что ты уже родился с готовой ролью. А в городе можно попробовать что-то другое.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        city_bad: {
            text: "Юи опускает взгляд. — Может, ты и прав… — тихо говорит она и замолкает. Больше она к этой теме не возвращается.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Деревня ---------- */

        village: {
            text: "— Хочу рассказать про деревню. — Юи смотрит в сторону, будто вспоминает. — У нас было тихо. Все знали друг друга. По вечерам кто-нибудь обязательно заходил в гости. — Она улыбается. — Я скучаю не по месту, а по тому, что там было легко. Но возвращаться не хочу.",
            choices: [
                {
                    text: "Тогда ты правильно сделала, что уехала.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 5 },
                        { type: "setFlag", flag: "yui_village_done", value: true }
                    ],
                    next: "village_good"
                },
                {
                    text: "Скучать — это нормально. Это же часть тебя.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 7 },
                        { type: "setFlag", flag: "yui_village_done", value: true }
                    ],
                    next: "village_deep"
                },
                {
                    text: "Если скучаешь, зачем вообще уезжала?",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: -3 },
                        { type: "setFlag", flag: "yui_village_done", value: true }
                    ],
                    next: "village_bad"
                }
            ]
        },
        village_good: {
            text: "Юи кивает. — Может, и правильно. — Она проводит пальцем по краю наушника. — Иногда я думаю, что скучаю не по дому, а по себе в нём. Но остаться всё равно не смогла бы.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        village_deep: {
            text: "Юи смотрит на тебя внимательнее. — Да. Наверное. — Она делает паузу. — Мне казалось, что скучать — это как предавать место, куда ты уехал. А ты говоришь, что это просто часть меня.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        village_bad: {
            text: "Юи пожимает плечами. — Потому что хотела большего. — Она больше ничего не говорит, и в тишине чувствуется, что тема закрыта.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Наушники ---------- */

        headphones: {
            text: "— Про наушники? — Юи снимает их совсем и кладёт на колени. — Да, я почти всегда в них. Не потому что не хочу слышать людей. Наоборот. Когда что-то играет, я лучше думаю. В голове становится тише. — Она улыбается. — И мир вокруг становится мягче.",
            choices: [
                {
                    text: "Понимаю. Музыка помогает собраться с мыслями.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 5 },
                        { type: "setFlag", flag: "yui_headphones_done", value: true }
                    ],
                    next: "headphones_good"
                },
                {
                    text: "А если кто-то хочет с тобой поговорить, а ты в наушниках?",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 3 },
                        { type: "setFlag", flag: "yui_headphones_done", value: true }
                    ],
                    next: "headphones_ask"
                },
                {
                    text: "Не проще ли просто побыть в тишине?",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 1 },
                        { type: "setFlag", flag: "yui_headphones_done", value: true }
                    ],
                    next: "headphones_quiet"
                }
            ]
        },
        headphones_good: {
            text: "Юи кивает. — Вот именно. — Она снова надевает один наушник. — А то думают, что я отгораживаюсь. А я наоборот.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        headphones_ask: {
            text: "Юи задумывается. — Тогда снимаю. — Она улыбается. — У меня правило: если вижу, что человек хочет что-то сказать, наушники в сторону. Музыка подождёт.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        headphones_quiet: {
            text: "Юи качает головой. — Не проще. Тишина у меня и так в голове. А музыка её заполняет чем-то хорошим. — Она пожимает плечами.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- О соседях ---------- */

        roommates: {
            text: "— Хочу рассказать про соседку. — Юи понижает голос. — Мы снимаем квартиру вдвоём. Она хорошая, но иногда забывает мыть посуду. И я никогда не знаю, как сказать. С одной стороны, ерунда. С другой — это же каждый раз. А если я скажу, может, она обидится.",
            choices: [
                {
                    text: "Лучше сказать. Пока это просто посуда, а потом может стать чем-то большим.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 7 },
                        { type: "setFlag", flag: "yui_roommates_done", value: true }
                    ],
                    next: "roommates_good"
                },
                {
                    text: "Скажи мягко, но прямо. Мол, давай договоримся, а не упрекать.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 5 },
                        { type: "setFlag", flag: "yui_roommates_done", value: true }
                    ],
                    next: "roommates_direct"
                },
                {
                    text: "Может, просто мыть за ней? Не такая уж и проблема.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: -3 },
                        { type: "setFlag", flag: "yui_roommates_done", value: true }
                    ],
                    next: "roommates_bad"
                }
            ]
        },
        roommates_good: {
            text: "Юи кивает. — Да, наверное. — Она вздыхает. — Я просто боюсь, что после разговора станет неловко. Хотя, наверное, уже неловко от того, что я молчу.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        roommates_direct: {
            text: "Юи задумывается. — Прямо, но мягко. — Она улыбается. — Звучит выполнимо. Спасибо, попробую.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        roommates_bad: {
            text: "Юи качает головой. — Может, и не проблема. Но каждый раз внутри что-то копится. — Она смотрит в сторону. — Наверное, я так долго не выдержу.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- О еде ---------- */

        food: {
            text: "— Хочу сказать про еду. — Юи улыбается. — Я из деревни, поэтому готовить умею. Но в городе всё время хочется что-то попробовать из кафе. И это дорого. — Она смеётся. — Вот и думаю: готовить дома или ходить по кафе?",
            choices: [
                {
                    text: "Дома вкуснее и дешевле. Можно готовить с удовольствием.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 4 },
                        { type: "setFlag", flag: "yui_food_done", value: true }
                    ],
                    next: "food_home"
                },
                {
                    text: "Иногда стоит и в кафе сходить. Это же тоже впечатление.",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 5 },
                        { type: "setFlag", flag: "yui_food_done", value: true }
                    ],
                    next: "food_cafe"
                },
                {
                    text: "А ты готовить вообще умеешь?",
                    effects: [
                        { type: "changeVariable", name: "relationship_yui", amount: 2 },
                        { type: "setFlag", flag: "yui_food_done", value: true }
                    ],
                    next: "food_ask"
                }
            ]
        },
        food_home: {
            text: "Юи кивает. — Да, дома вкуснее. И можно готовить так, как хочется. — Она улыбается. — У нас в деревне все готовили сами. Наверное, я просто скучаю по этому.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        food_cafe: {
            text: "Юи оживляется. — Вот и я так думаю! — Она улыбается. — Иногда нужно просто себя порадовать.",
            choices: [{ text: "Попрощаться", close: true }]
        },
        food_ask: {
            text: "Юи усмехается. — Умею, ещё как. — Она чуть приосанивается. — Просто в городе столько соблазнов, что готовить иногда лень.",
            choices: [{ text: "Попрощаться", close: true }]
        },

        /* ---------- Просто поболтать ---------- */

        smalltalk: {
            text: "Вы болтаете о мелочах: о музыке, которая играет у неё в наушниках, о новом кафе неподалёку, о планах на выходные. Юи улыбается — ей приятно просто поговорить.",
            choices: [
                {
                    text: "Попрощаться",
                    next: "smalltalk_result",
                    effects: [{ type: "changeVariable", name: "relationship_yui", amount: 2 }]
                }
            ]
        },
        smalltalk_result: {
            text: "Вы прощаетесь. Юи машет рукой и снова надевает наушники.",
            choices: [{ text: "Закрыть", close: true }]
        }
    }
};