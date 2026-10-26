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
      tvAtHome: false
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
      mood: 70,
      foodPortions: 5,
      pendingStipend: 1000,
      lastSkatingDay: 0,
      lastRinDay: 0,
      relationship_Rin: 0,
      lastYuiDay: 0,
      relationship_yui: 10,
      lastHinakoDay: 0,
      relationship_hinako: 0,
      lastNikoDay: 0,
      relationship_niko: 0,
      lastHitoriDay: 0,
      relationship_hitori: 0,
      lastRitsuDay: 0,
      relationship_ritsu: 0,
      lastMusicDay: 0,
      musicUsesToday: 0,
      orderType: null
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
    hunger: 100 / 1080,
    thirst: 100 / 720,
    fatigue: 100 / 1920
  },
  needsMax: 100,
  healthMax: 100,
  staminaMax: 100,
  damagePerHour: 10,
  moodMax: 100,
  moodRates: {
    passive: 6,
    perHighNeed: 5,
    highNeedThreshold: 80,
    lowMoodMultiplier: 1.5
  }
};