window.GAME_DATA.dialogues = window.GAME_DATA.dialogues || {};

window.GAME_DATA.dialogues.secretary = {
    start: "greeting",
    nodes: {
        greeting: {
            text: "Девушка-секретарь поднимает глаза от бумаг и вежливо улыбается. — Здравствуйте. Вы по какому вопросу?",
            choices: [
                { text: "Насчёт стипендии", next: "about" },
                { text: "Попрощаться", close: true }
            ]
        },
        about: {
            text: "— В начале учебного года всем студентам начисляется стартовая стипендия — 1000 ¥, — объясняет секретарь. — Дальше она начисляется за посещаемость: за каждое посещённое занятие — 200 ¥. Забрать накопленное можно, когда сумма достигнет 1000 ¥.",
            choices: [
                { text: "Сколько у меня накоплено?", next: "check" },
                { text: "Хочу забрать накопленное", next: "claim" },
                { text: "Спасибо, я подумаю", close: true }
            ]
        },
        check: {
            text: "Секретарь заглядывает в журнал. — У вас накоплено {pendingStipend} ¥.",
            choices: [
                { text: "Хочу забрать накопленное", next: "claim" },
                { text: "Понятно, спасибо", close: true }
            ]
        },
        claim: {
            text: "Секретарь открывает журнал и проверяет записи.",
            choices: [
                {
                    text: "Забрать стипендию",
                    close: true,
                    command: "stipend:claim"
                },
                { text: "Попрощаться", close: true }
            ]
        }
    }
};