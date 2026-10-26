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
    dialogue: null,
    flags: {
      hasInspectedTable: false,
      tvAtHome: false,
      hasActiveOrder: false
    },
    variables: {
      day: 1,
      minutes: 510,
      money: 50,
      lastClassDay: 0,
      lastOrderDay: 0,
      lastShiftDay: 0,
      lastElectronicsShiftDay: 0,
      lastTvDay: 0,
      lastShowerDay: 0,
      lastTrainDay: 0,
      classesAttended: 0,
      health: 50,
      healthMax: 50,
      stamina: 50,
      staminaMax: 50,
      hunger: 10,
      thirst: 5,
      fatigue: 10,
      mood: 90,
      foodPortions: 5,
      pendingStipend: 1000,
      lastSkatingDay: 0,
      lastHimariDay: 0,
      relationship_himari: 0,
      lastYuiDay: 0,
      relationship_yui: 10,
      lastHinakoDay: 0,
      relationship_hinako: 0,
      lastNikoDay: 0,
      relationship_niko: 0,
      lastHitoriDay: 0,
      relationship_hitori: 0,
      lastRitsuDay: 0,
      relationship_ritsu: 0
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
  damagePerHour: 10,
  moodMax: 100,
  moodRates: {
    passive: 4,       // -4/час пассивно
    perHighNeed: 4,   // -4/час за каждую потребность выше 80
    highNeedThreshold: 80,
    lowMoodMultiplier: 2  // при mood === 0 потребности растут ×2
  }
};