const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadRules() {
  const context = {
    console: { warn() {}, error() {} },
    Date,
    Math,
    JSON
  };
  context.window = context;
  vm.createContext(context);
  for (const file of ['js/rules/rules.js', 'js/rules/rules-effects.js']) {
    const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  return context.Rules;
}

function makeState(overrides = {}) {
  return {
    location: 'home',
    inventory: [],
    flags: {},
    sleeping: false,
    gameOver: false,
    variables: {
      minutes: 600,
      day: 1,
      hunger: 0,
      thirst: 0,
      fatigue: 0,
      mood: 100,
      health: 50,
      healthMax: 50,
      money: 0,
      ...overrides
    }
  };
}

const gameData = {
  needsMax: 100,
  healthMax: 100,
  moodMax: 100,
  needsRates: { hunger: 1, thirst: 0.5, fatigue: 0.25 },
  damagePerHour: 10,
  locations: { home: { name: 'Дом' }, street: { name: 'Улица' } },
  items: {}
};

test('applyNeeds increases needs proportionally to elapsed time', () => {
  const Rules = loadRules();
  const result = Rules.applyNeeds(makeState(), 60, gameData);
  assert.equal(result.state.variables.hunger, 60);
  assert.equal(result.state.variables.thirst, 30);
  assert.equal(result.state.variables.fatigue, 15);
  assert.equal(result.state.variables.mood, 100);
  assert.equal(result.messages.length, 0);
});

test('applyNeeds reduces needs growth while sleeping and restores no fatigue implicitly', () => {
  const Rules = loadRules();
  const state = makeState({ hunger: 10, thirst: 20, fatigue: 30 });
  state.sleeping = true;
  const result = Rules.applyNeeds(state, 60, gameData);
  assert.equal(result.state.variables.hunger, 16);
  assert.equal(result.state.variables.thirst, 23);
  assert.equal(result.state.variables.fatigue, 30);
});

test('changeVariable respects health and relationship bounds', () => {
  const Rules = loadRules();
  const result = Rules.applyEffects([
    { type: 'changeVariable', name: 'health', amount: 100 },
    { type: 'changeVariable', name: 'relationship_npc', amount: 150 }
  ], makeState({ health: 40, healthMax: 60, relationship_npc: 10 }), gameData);
  assert.equal(result.state.variables.health, 60);
  assert.equal(result.state.variables.relationship_npc, 100);
});

test('advanceTime rolls over days and applies needs', () => {
  const Rules = loadRules();
  const result = Rules.applyEffects([
    { type: 'advanceTime', minutes: 60 }
  ], makeState({ minutes: 1410, hunger: 0 }), gameData);
  assert.equal(result.state.variables.minutes, 30);
  assert.equal(result.state.variables.day, 2);
  assert.equal(result.state.variables.hunger, 60);
  assert.ok(result.messages.some(message => message.text === 'Наступает новый день.'));
});

test('applyEffects applies effects sequentially to the evolving state', () => {
  const Rules = loadRules();
  const result = Rules.applyEffects([
    { type: 'changeVariable', name: 'money', amount: 10 },
    { type: 'changeVariable', name: 'money', amount: -3 }
  ], makeState(), gameData);
  assert.equal(result.state.variables.money, 7);
  assert.equal(result.messages.length, 2);
  assert.match(result.messages[0].text, /Получено: 10/);
  assert.match(result.messages[1].text, /Потрачено: 3/);
});
