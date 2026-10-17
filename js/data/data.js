/*
  ДАННЫЕ ИГРЫ. Здесь только контент: локации, предметы, персонаж, стартовое состояние.
  Никакой логики.

  Структура локации:
    name, tag, description[], image?, imageAlt?, imageCaption?,
    hours?: { from, to },   // минуты от полуночи; отсутствует — открыта всегда
    actions[]

  Структура действия:
    id, label, hint?, condition?, effects[], text?, once?,
    image?, imageAlt?, imageCaption?

    text    — авторский текст, попадает в панель «Информация».
    image   — путь к изображению (относительно index.html), попадает в «Информацию».
    imageAlt — альтернативный текст для изображения.
    imageCaption — подпись под изображением; если не задано, подписи нет.

  Условия: { item }, { flag, equals? }, { not }, { all }, { any },
           { variableAtLeast: { name, value } }, { variableEquals: { name, value } },
           { variableDiffers: { name, other } },
           { locationOpen: "locationId" }

  Эффекты: { type: "move", to }, { type: "giveItem", item },
           { type: "removeItem", item }, { type: "setFlag", flag, value },
           { type: "changeVariable", name, amount }, { type: "setVariable", name, value },
           { type: "setVariableFromVariable", name, from },
           { type: "advanceTime", minutes }

  Пути к изображениям указываются относительно index.html, а не data.js.
*/
window.GAME_DATA = {
  start: "apartment",
  initialState: {
    location: "apartment",
    inventory: [],
    flags: { hasInspectedTable: false },
    variables: {
      day: 1,
      minutes: 510,
      money: 99,
      lastClassDay: 0,
      classesAttended: 0
    },
    uiTab: "quests",
    controlsOpen: false,
    logOpen: false,
    lastVariant: {}
  },
  character: {
    name: "Герой",
    avatar: "assets/images/characters/hero.png",
    avatarAlt: "Портрет героя",
    description: "Молодой человек, только начинает свой путь в городе."
  },
  items: {
    keys: {
      name: "Ключи от квартиры",
      icon: "🔑",
      description: "Обычная связка ключей. Лучше не потерять."
    },
    notebook: {
      name: "Блокнот",
      icon: "📓",
      // Описание может быть строкой или функцией (state) => string.
      description: (state) => {
        const count = Number(state.variables.classesAttended) || 0;
        if (count === 0) {
          return "Пока чистый. В нём можно делать заметки.";
        }
        return `Содержит заметки. Посещено занятий: ${count}.`;
      }
    }
  },
  locations: {
    apartment: {
      name: "Квартира", tag: "Безопасное место",
      image: "assets/images/locations/apartment.jpg",
      imageAlt: "Уютная квартира утром: стол, окно, мягкий свет",
      imageCaption: "Квартира утром: тихо и спокойно.",
      description: [
        "Небольшая, но уютная квартира. Утренний свет пробивается сквозь занавески, а на столе лежат ключи и телефон.",
        "Сегодня предстоит выбраться в город. Можно выйти на улицу или немного осмотреться перед дорогой."
      ],
      actions: [
        {
          id: "inspect_table",
          label: "Осмотреть стол",
          hint: "Проверить, всё ли на месте",
          effects: [
            { type: "setFlag", flag: "hasInspectedTable", value: true },
            { type: "giveItem", item: "keys" }
          ],
          once: true,
          text: "На столе лежат ключи. Ты убираешь их в карман.",
          image: "assets/images/locations/apartment-table.jpg",
          imageAlt: "Стол у окна с ключами и телефоном"
        },
        {
          id: "leave_home",
          label: "Выйти на улицу",
          hint: "Отправиться в город",
          condition: { item: "keys" },
          effects: [{ type: "move", to: "street" }]
        },
        {
          id: "rest",
          label: "Немного отдохнуть",
          hint: "Проходит 15 минут",
          effects: [{ type: "advanceTime", minutes: 15 }],
          text: "Ты ненадолго присаживаешься и собираешься с мыслями.",
          image: "assets/images/locations/apartment-rest.jpg"
        },
        {
          id: "sleep_8h",
          label: "Лечь спать",
          hint: "Проходит 8 часов",
          effects: [{ type: "advanceTime", minutes: 480 }],
          text: "Ты ложишься спать и просыпаешься через восемь часов.",
          image: "assets/images/locations/apartment-sleep.jpg"
        }
      ]
    },
    street: {
      name: "Улица", tag: "Город",
      image: "assets/images/locations/street.jpg",
      imageCaption: "Оживлённая улица: огни, прохожие и спешащий транспорт.",
      description: [
        "На улице уже шумно: проезжают автобусы, прохожие спешат по своим делам, а на перекрёстке мигает зелёный сигнал.",
        "Отсюда можно добраться до университета или зайти в небольшой магазин на соседней улице."
      ],
      actions: [
        {
          id: "go_university",
          label: "Пойти в университет",
          hint: "Занятия и знакомые лица",
          condition: { locationOpen: "university" },
          effects: [{ type: "move", to: "university" }]
        },
        {
          id: "go_shop",
          label: "Зайти в магазин",
          hint: "Посмотреть товары",
          condition: { locationOpen: "shop" },
          effects: [{ type: "move", to: "shop" }]
        },
        {
          id: "go_home",
          label: "Вернуться домой",
          hint: "Назад в квартиру",
          effects: [{ type: "move", to: "apartment" }]
        },
        {
          id: "look_around",
          label: "Осмотреться",
          hint: "Случайное событие",
          effects: [{ type: "setFlag", flag: "lookedAroundStreet", value: true }],
          variants: [
            {
              text: "Мимо проезжает автобус и останавливается на перекрёстке.",
              image: "assets/images/locations/street-scene-bus.jpg",
              imageAlt: "Автобус на остановке"
            },
            {
              text: "На тротуар садится голубь, клюёт крошки и улетает.",
              image: "assets/images/locations/street-scene-pigeon.jpg",
              imageAlt: "Голубь на тротуаре"
            },
            {
              text: "Мимо проходит студентка с рюкзаком и кивает тебе.",
              image: "assets/images/locations/street-scene-student.jpg",
              imageAlt: "Студентка с рюкзаком на улице"
            },
            {
              condition: { not: { flag: "foundCoin" } },
              effects: [
                { type: "setFlag", flag: "foundCoin", value: true },
                { type: "changeVariable", name: "money", amount: 1 }
              ],
              text: "На тротуаре что-то блестит. Ты наклоняешься и находишь монетку в 1 ₽. Вряд ли снова так повезёт.",
              image: "assets/images/locations/street-scene-coin.jpg",
              imageAlt: "Монетка на асфальте"
            }
          ]
        }
      ]
    },
    university: {
      name: "Университет", tag: "Учёба",
      hours: { from: 8 * 60, to: 20 * 60 },
      image: "assets/images/locations/university.jpg",
      imageAlt: "Главное здание университета: вход и студенты",
      description: [
        "Перед тобой главное здание университета. У входа собрались студенты, а из открытых окон доносится гул голосов.",
        "До начала занятий ещё есть время. Можно осмотреть холл или вернуться на улицу."
      ],
      actions: [
        {
          id: "look_hall",
          label: "Осмотреть холл",
          hint: "Изучить доску объявлений",
          effects: [{ type: "setFlag", flag: "sawNoticeboard", value: true }],
          text: "На доске объявлений висят расписание и афиша студенческого клуба.",
          image: "assets/images/locations/university-hall.jpg",
          imageAlt: "Светлый холл университета с доской объявлений"
        },
        {
          id: "attend_class",
          label: "Посетить занятие",
          hint: "Один раз в день · нужен блокнот",
          condition: {
            all: [
              { item: "notebook" },
              { variableDiffers: { name: "lastClassDay", other: "day" } }
            ]
          },
          effects: [
            { type: "setVariableFromVariable", name: "lastClassDay", from: "day" },
            { type: "changeVariable", name: "classesAttended", amount: 1 },
            { type: "advanceTime", minutes: 90 }
          ],
          text: "Ты заходишь в аудиторию и проводишь полтора часа на занятии.",
          image: "assets/images/locations/university-classroom.jpg",
          imageAlt: "Учебная аудитория: ряды столов и доска"
        },
        {
          id: "return_street",
          label: "Выйти на улицу",
          hint: "Вернуться к перекрёстку",
          effects: [{ type: "move", to: "street" }]
        }
      ]
    },
    shop: {
      name: "Магазин", tag: "Покупки",
      hours: { from: 8 * 60, to: 22 * 60 },
      image: "assets/images/locations/shop.jpg",
      imageAlt: "Небольшой магазин у перекрёстка: витрина и вход",
      description: [
        "Небольшой магазин у перекрёстка. На полках стоят напитки, снеки и самые разные мелочи. За кассой скучает продавец."
      ],
      actions: [
        {
          id: "buy_notebook",
          label: "Купить блокнот",
          hint: "100 ₽",
          hiddenWhen: { item: "notebook" },
          condition: { variableAtLeast: { name: "money", value: 100 } },
          effects: [
            { type: "changeVariable", name: "money", amount: -100 },
            { type: "giveItem", item: "notebook" }
          ],
          text: "Ты покупаешь блокнот и убираешь его в сумку.",
          image: "assets/images/items/notebook.jpg",
          imageAlt: "Новый блокнот в твёрдой обложке"
        },
        {
          id: "look_shelves",
          label: "Осмотреть полки",
          hint: "Изучить ассортимент",
          effects: [{ type: "setFlag", flag: "lookedAtShelves", value: true }],
          text: "На полках ты замечаешь воду, яблоки и блокноты.",
          image: "assets/images/locations/shop-shelves.jpg",
          imageAlt: "Полки небольшого магазина с товарами"
        },
        {
          id: "return_street",
          label: "Выйти на улицу",
          hint: "Вернуться к перекрёстку",
          effects: [{ type: "move", to: "street" }]
        }
      ]
    }
  },
  links: {
    apartment: ["street"],
    street: ["apartment", "university", "shop"],
    university: ["street"],
    shop: ["street"]
  }
};