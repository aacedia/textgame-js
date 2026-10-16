/*
  ДАННЫЕ ИГРЫ. Здесь только контент: локации, предметы, персонаж, стартовое состояние.
  Никакой логики.

  Структура локации:
    name, tag, description[], image?, imageAlt?, imageCaption?,
    hours?: { from, to },   // минуты от полуночи; отсутствует — открыта всегда
    actions[]

  Структура действия:
    id, label, hint?, condition?, effects[], text?, once?

  Условия: { item }, { flag, equals? }, { not }, { all }, { any },
           { variableAtLeast: { name, value } }, { variableEquals: { name, value } },
           { variableDiffers: { name, other } },
           { locationOpen: "locationId" }

  Эффекты: { type: "move", to }, { type: "giveItem", item },
           { type: "removeItem", item }, { type: "setFlag", flag, value },
           { type: "changeVariable", name, amount }, { type: "setVariable", name, value },
           { type: "setVariableFromVariable", name, from },
           { type: "advanceTime", minutes }
*/
window.GAME_DATA = {
  start: "apartment",
  initialState: {
    location: "apartment",
    inventory: [],
    flags: { hasInspectedTable: false },
    variables: { day: 1, minutes: 510, money: 250, lastClassDay: 0 },
    uiTab: "inventory",
    controlsOpen: false
  },
  character: {
    name: "Герой",
    avatar: "https://pbs.twimg.com/profile_images/1936718908989362176/llks1Mq8_400x400.jpg",
    avatarAlt: "Портрет героя",
    description: "Молодой человек, только начинает свой путь в городе."
  },
  items: {
    keys: { name: "Ключи от квартиры", icon: "🔑", description: "Обычная связка ключей. Лучше не потерять." },
    notebook: { name: "Блокнот", icon: "📓", description: "Пока чистый. В нём можно делать заметки." }
  },
  locations: {
    apartment: {
      name: "Квартира", tag: "Безопасное место",
      description: [
        "Небольшая, но уютная квартира. Утренний свет пробивается сквозь занавески, а на столе лежат ключи и телефон.",
        "Сегодня предстоит выбраться в город. Можно выйти на улицу или немного осмотреться перед дорогой."
      ],
      actions: [
        { id: "inspect_table", label: "Осмотреть стол", hint: "Проверить, всё ли на месте", effects: [{ type: "setFlag", flag: "hasInspectedTable", value: true }, { type: "giveItem", item: "keys" }], once: true, text: "На столе лежат ключи. Ты убираешь их в карман." },
        { id: "leave_home", label: "Выйти на улицу", hint: "Отправиться в город", effects: [{ type: "move", to: "street" }] },
        { id: "rest", label: "Немного отдохнуть", hint: "Проходит 15 минут", effects: [{ type: "advanceTime", minutes: 15 }], text: "Ты ненадолго присаживаешься и собираешься с мыслями." },
        { id: "sleep_8h", label: "Лечь спать", hint: "Проходит 8 часов", effects: [{ type: "advanceTime", minutes: 480 }], text: "Ты ложишься спать и просыпаешься через восемь часов." }
      ]
    },
    street: {
      name: "Улица", tag: "Город",
      image: "https://img.magnific.com/premium-photo/people-city-street-night_1064398-1288.jpg",
      imageAlt: "Ночная городская улица с людьми и огнями",
      imageCaption: "Улица вечером: огни, прохожие и спешащий транспорт.",
      description: [
        "На улице уже шумно: проезжают автобусы, прохожие спешат по своим делам, а на перекрёстке мигает зелёный сигнал.",
        "Отсюда можно добраться до университета или зайти в небольшой магазин на соседней улице."
      ],
      actions: [
        { id: "go_university", label: "Пойти в университет", hint: "Занятия и знакомые лица", condition: { locationOpen: "university" }, effects: [{ type: "move", to: "university" }] },
        { id: "go_shop", label: "Зайти в магазин", hint: "Посмотреть товары", condition: { locationOpen: "shop" }, effects: [{ type: "move", to: "shop" }] },
        { id: "go_home", label: "Вернуться домой", hint: "Назад в квартиру", effects: [{ type: "move", to: "apartment" }] },
        { id: "look_around", label: "Осмотреться", hint: "Понаблюдать за прохожими", effects: [{ type: "setFlag", flag: "lookedAroundStreet", value: true }], text: "Мимо проходит студент с рюкзаком. На остановке подъезжает автобус." }
      ]
    },
    university: {
      name: "Университет", tag: "Учёба",
      hours: { from: 8 * 60, to: 20 * 60 },
      description: [
        "Перед тобой главное здание университета. У входа собрались студенты, а из открытых окон доносится гул голосов.",
        "До начала занятий ещё есть время. Можно осмотреть холл или вернуться на улицу."
      ],
      actions: [
        { id: "look_hall", label: "Осмотреть холл", hint: "Изучить доску объявлений", effects: [{ type: "setFlag", flag: "sawNoticeboard", value: true }], text: "На доске объявлений висят расписание и афиша студенческого клуба." },
        {
          id: "attend_class",
          label: "Посетить занятие",
          hint: "Один раз в день · 90 минут",
          condition: { variableDiffers: { name: "lastClassDay", other: "day" } },
          effects: [
            { type: "setVariableFromVariable", name: "lastClassDay", from: "day" },
            { type: "advanceTime", minutes: 90 }
          ],
          text: "Ты заходишь в аудиторию и проводишь полтора часа на занятии."
        },
        { id: "return_street", label: "Выйти на улицу", hint: "Вернуться к перекрёстку", effects: [{ type: "move", to: "street" }] }
      ]
    },
    shop: {
      name: "Магазин", tag: "Покупки",
      hours: { from: 8 * 60, to: 22 * 60 },
      description: [
        "Небольшой магазин у перекрёстка. На полках стоят напитки, снеки и самые разные мелочи. За кассой скучает продавец.",
        "Можно купить блокнот за 100 ₽. Деньги и покупки уже работают как простая игровая механика."
      ],
      actions: [
        { id: "buy_notebook", label: "Купить блокнот", hint: "100 ₽", condition: { all: [{ not: { item: "notebook" } }, { variableAtLeast: { name: "money", value: 100 } }] }, effects: [{ type: "changeVariable", name: "money", amount: -100 }, { type: "giveItem", item: "notebook" }], text: "Ты покупаешь блокнот и убираешь его в сумку." },
        { id: "look_shelves", label: "Осмотреть полки", hint: "Изучить ассортимент", effects: [{ type: "setFlag", flag: "lookedAtShelves", value: true }], text: "На полках ты замечаешь воду, яблоки и блокноты." },
        { id: "return_street", label: "Выйти на улицу", hint: "Вернуться к перекрёстку", effects: [{ type: "move", to: "street" }] }
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