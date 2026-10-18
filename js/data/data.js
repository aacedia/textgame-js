/*
  ДАННЫЕ ИГРЫ. Каркас: стартовое состояние и константы.
  Локации, связи, предметы и персонаж подмешиваются отдельными файлами.
*/
window.GAME_DATA = {
  start: "apartment",
  startDate: { year: 2026, month: 9, day: 1 },
  weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],

  initialState: {
    location: "apartment",
    inventory: [],
    flags: {
      hasInspectedTable: false,
      tvAtHome: false,
      hasActiveOrder: false,
      orderSize: 0,
      orderReward: 0,
      orderName: ""
    },
    variables: {
      day: 1,
      minutes: 510,
      money: 50,
      lastClassDay: 0,
      lastHimariDay: 0,
      lastOrderDay: 0,
      lastShiftDay: 0,
      classesAttended: 0,
      health: 100,
      stamina: 100,
      hunger: 20,
      thirst: 20,
      fatigue: 20,
      foodPortions: 0
    },
    uiTab: "quests",
    inventoryFilter: "all",
    controlsOpen: false,
    logOpen: false,
    lastVariant: {}
  },

  items: {},
  character: {},
  locations: {},
  links: {},

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