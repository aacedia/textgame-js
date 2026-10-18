/*
  ДАННЫЕ ИГРЫ. Здесь только контент: локации, предметы, персонаж, стартовое состояние.
  Структура действия:
    id, label, hint?, condition?, effects[], text?, once?,
    minutes?,               // время действия в минутах; по умолчанию 1
    restoreAfterTime?,      // { hunger|thirst|fatigue|stamina: value } — применить после времени
    image?, imageAlt?, imageCaption?
  Пути к изображениям указываются относительно index.html, а не data.js.
*/
window.GAME_DATA = {
  start: "apartment",
  startDate: { year: 2026, month: 9, day: 1 },
  weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  initialState: {
    location: "apartment",
    inventory: [],
    flags: { hasInspectedTable: false },
    variables: {
      day: 1,
      minutes: 510,
      money: 99,
      lastClassDay: 0,
      classesAttended: 0,
      health: 100,
      stamina: 100,
      hunger: 20,
      thirst: 20,
      fatigue: 20
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
          hint: "Проходит 15 минут · -5 усталости",
          minutes: 15,
          effects: [],
          reduceAfterTime: { fatigue: 5 },
          text: "Ты ненадолго присаживаешься и собираешься с мыслями.",
          image: "assets/images/locations/apartment-rest.jpg"
        },
        {
          id: "sleep_8h",
          label: "Лечь спать",
          hint: "Проходит 8 часов · -100 усталости",
          minutes: 480,
          effects: [],
          reduceBeforeTime: { fatigue: 100 },
          restoreAfterTime: { stamina: 100, health: 100 },
          sleep: true,
          text: "Ты ложишься спать и просыпаешься через восемь часов.",
          image: "assets/images/locations/apartment-sleep.jpg"
        },
        {
          id: "eat_at_home",
          label: "Поесть",
          hint: "Снимает голод · 20 ₽",
          minutes: 30,
          condition: { variableAtLeast: { name: "money", value: 20 } },
          effects: [
            { type: "changeVariable", name: "money", amount: -20 }
          ],
          restoreAfterTime: { hunger: 0 },
          text: "Ты готовишь простой ужин и ешь.",
          image: "assets/images/locations/apartment-rest.jpg"
        },
        {
          id: "drink_at_home",
          label: "Попить",
          hint: "Снимает жажду",
          minutes: 5,
          effects: [],
          restoreAfterTime: { thirst: 0 },
          text: "Ты выпиваешь стакан воды.",
          image: "assets/images/locations/apartment-rest.jpg"
        }
      ]
    },
    street: {
      name: "Улица", tag: "Город",
      image: "assets/images/locations/street.jpg",
      description: [
        "На улице уже шумно: проезжают автобусы, прохожие спешат по своим делам, а на перекрёстке мигает зелёный сигнал.",
        "Отсюда можно добраться до университета, зайти в магазин или в кафе на углу."
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
          id: "go_cafe",
          label: "Зайти в кафе",
          hint: "Перекусить и подработать",
          condition: { locationOpen: "cafe" },
          effects: [{ type: "move", to: "cafe" }]
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
            },
            {
              text: "На тротуар садится голубь, клюёт крошки и улетает.",
              image: "assets/images/locations/street-scene-pigeon.jpg",
            },
            {
              text: "Мимо проходит студентка с рюкзаком и кивает тебе.",
              image: "assets/images/locations/street-scene-student.jpg",
            },
            {
              condition: { not: { flag: "foundCoin" } },
              effects: [
                { type: "setFlag", flag: "foundCoin", value: true },
                { type: "changeVariable", name: "money", amount: 100 }
              ],
              text: "На тротуаре что-то блестит. Ты наклоняешься и находишь монетку в 100 ₽. Вряд ли снова так повезёт.",
              image: "assets/images/locations/street-scene-coin.jpg",
            }
          ]
        }
      ]
    },
    university: {
      name: "Университет", tag: "Учёба",
      hours: { from: 8 * 60, to: 20 * 60 },
      closedWeekdays: [5, 6],
      defaultExit: "street",
      image: "assets/images/locations/university.jpg",
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
        },
        {
          id: "attend_class",
          label: "Посетить занятие",
          hint: "Один раз в день · нужен блокнот",
          minutes: 90,
          condition: {
            all: [
              { item: "notebook" },
              { variableDiffers: { name: "lastClassDay", other: "day" } }
            ]
          },
          effects: [
            { type: "setVariableFromVariable", name: "lastClassDay", from: "day" },
            { type: "changeVariable", name: "classesAttended", amount: 1 }
          ],
          text: "Ты заходишь в аудиторию и проводишь полтора часа на занятии.",
          image: "assets/images/locations/university-classroom.jpg",
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
      defaultExit: "street",
      image: "assets/images/locations/shop.jpg",
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
        },
        {
          id: "buy_snack",
          label: "Купить перекус",
          hint: "30 ₽ · снимает голод",
          minutes: 5,
          condition: { variableAtLeast: { name: "money", value: 30 } },
          effects: [
            { type: "changeVariable", name: "money", amount: -30 }
          ],
          restoreAfterTime: { hunger: 0 },
          text: "Ты покупаешь булочку и быстро перекусываешь.",
          image: "assets/images/locations/shop-shelves.jpg"
        },
        {
          id: "buy_water",
          label: "Купить воду",
          hint: "15 ₽ · снимает жажду",
          minutes: 2,
          condition: { variableAtLeast: { name: "money", value: 15 } },
          effects: [
            { type: "changeVariable", name: "money", amount: -15 }
          ],
          restoreAfterTime: { thirst: 0 },
          text: "Ты покупаешь бутылку воды и пьёшь.",
          image: "assets/images/locations/shop-shelves.jpg"
        },
        {
          id: "look_shelves",
          label: "Осмотреть полки",
          hint: "Изучить ассортимент",
          effects: [{ type: "setFlag", flag: "lookedAtShelves", value: true }],
          text: "На полках ты замечаешь воду, яблоки и блокноты.",
          image: "assets/images/locations/shop-shelves.jpg",
        },
        {
          id: "return_street",
          label: "Выйти на улицу",
          hint: "Вернуться к перекрёстку",
          effects: [{ type: "move", to: "street" }]
        }
      ]
    },
    cafe: {
      name: "Кафе", tag: "Уютное место",
      hours: { from: 8 * 60, to: 23 * 60 },
      defaultExit: "street",
      image: "assets/images/locations/cafe.jpg",
      description: [
        "Небольшое кафе неподалёку от перекрёстка. У окна свободный столик, за стойкой скучает бариста.",
        "Здесь можно перекусить, а если повезёт — подработать пару часов за стойкой."
      ],
      actions: [
        {
          id: "eat_at_cafe",
          label: "Поесть в кафе",
          hint: "50 ₽ · снимает голод",
          minutes: 40,
          condition: { variableAtLeast: { name: "money", value: 50 } },
          effects: [
            { type: "changeVariable", name: "money", amount: -50 }
          ],
          restoreAfterTime: { hunger: 0 },
          text: "Ты заказываешь горячий обед и не спеша ешь.",
          image: "assets/images/locations/cafe-food.jpg",
        },
        {
          id: "drink_at_cafe",
          label: "Выпить кофе",
          hint: "20 ₽ · снимает жажду",
          minutes: 15,
          condition: { variableAtLeast: { name: "money", value: 20 } },
          effects: [
            { type: "changeVariable", name: "money", amount: -20 }
          ],
          restoreAfterTime: { thirst: 0 },
          text: "Ты берёшь чашку кофе и устраиваешься у окна.",
          image: "assets/images/locations/cafe-coffee.jpg",
        },
        {
          id: "work_shift",
          label: "Подработать",
          hint: "3 часа · +300 ₽ · тратит выносливость",
          minutes: 180,
          condition: {
            all: [
              { variableAtLeast: { name: "stamina", value: 20 } },
              { variableAtLeast: { name: "money", value: 0 } }
            ]
          },
          effects: [
            { type: "changeVariable", name: "money", amount: 300 },
            { type: "changeVariable", name: "stamina", amount: -20 }
          ],
          text: "Ты отрабатываешь смену за стойкой: принимаешь заказы, вытираешь столы, улыбаешься гостям. В конце получаешь оплату.",
          image: "assets/images/locations/cafe-work.jpg",
        },
        {
          id: "look_around_cafe",
          label: "Осмотреться",
          hint: "Понаблюдать за гостями",
          effects: [{ type: "setFlag", flag: "lookedAroundCafe", value: true }],
          text: "За соседним столиком пара обсуждает планы на вечер, у окна студент листает конспекты.",
          image: "assets/images/locations/cafe-inside.jpg",
        },
        {
          id: "cafe_return_street",
          label: "Выйти на улицу",
          hint: "Вернуться к перекрёстку",
          effects: [{ type: "move", to: "street" }]
        }
      ]
    }
  },
  links: {
    apartment: ["street"],
    street: ["apartment", "university", "shop", "cafe"],
    university: ["street"],
    shop: ["street"],
    cafe: ["street"]
  },
  needsRates: {
    hunger: 100 / 720,
    thirst: 100 / 1440,
    fatigue: 100 / 1440
  },
  needsMax: 100,
  healthMax: 100,
  staminaMax: 100,
  damagePerHour: 10
};