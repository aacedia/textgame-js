Object.assign(window.GAME_DATA.items, {
    keys: {
        name: "Ключи от квартиры",
        icon: "🔑",
        description: "Обычная связка ключей. Лучше не потерять."
    },
    notebook: {
        name: "Блокнот",
        icon: "📓",
        description: (state) => {
            const count = Number(state.variables.classesAttended) || 0;
            if (count === 0) return "Пока чистый. В нём можно делать заметки.";
            return `Содержит заметки. Посещено занятий: ${count}.`;
        }
    }
});