const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadGameActions() {
  const action = {
    id: 'work',
    label: 'Работа',
    minutes: 60,
    restoreBeforeTime: { health: 10 },
    reduceBeforeTime: { fatigue: 3 },
    restoreAfterTime: { health: 20 },
    reduceAfterTime: { fatigue: 10 }
  };
  const data = {
    locations: { home: { name: 'Дом', actions: [action] } },
    items: {},
    dialogues: {}
  };
  let state = {
    location: 'home',
    gameOver: false,
    inventory: [],
    flags: {},
    variables: { minutes: 600, day: 1, health: 5, fatigue: 2 },
    streakAction: null,
    streakCount: 0,
    lastAction: null
  };
  const logs = [];
  const rules = {
    checkCondition: () => true,
    pickVariant: () => null,
    isLocationOpen: () => true,
    applyEffects(effects, current) {
      assert.equal(effects[0].type, 'advanceTime');
      assert.equal(current.variables.health, 10);
      assert.equal(current.variables.fatigue, 0);
      return { state: structuredClone(current), messages: [] };
    }
  };
  const context = {
    console,
    structuredClone,
    GAME_DATA: data,
    Rules: rules,
    get Game() { return this._game; },
    set Game(value) { this._game = value; }
  };
  context.window = context;
  context.Game = {
    getState: () => state,
    setState: next => { state = next; },
    pushLog: entries => logs.push(...entries),
    setInfo() {},
    clearInfo() {},
    render() {},
    get _state() { return state; }
  };
  vm.createContext(context);
  const source = fs.readFileSync(path.join(__dirname, '..', 'js/game/game-actions.js'), 'utf8');
  vm.runInContext(source, context, { filename: 'js/game/game-actions.js' });
  return { Game: context.Game, getState: () => state, logs };
}

test('action restore/reduce adjustments run before and after time in the documented order', () => {
  const { Game, getState } = loadGameActions();
  Game.onAction('work');
  assert.equal(getState().variables.health, 20);
  assert.equal(getState().variables.fatigue, 0);
});
