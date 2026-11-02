const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadValidator() {
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(path.join(__dirname, '../js/data/data-validation.js'), 'utf8'),
    context
  );
  return context.window.DataValidation;
}

function validData() {
  return {
    locations: {
      room: {
        actions: [{ id: 'talk', dialogue: 'npc' }]
      }
    },
    dialogues: {
      npc: {
        start: 'hello',
        nodes: {
          hello: {
            choices: [{ text: 'Continue', next: 'bye' }]
          },
          bye: { choices: [{ text: 'Leave', close: true }] }
        }
      }
    },
    character: {},
    initialState: { location: 'room', inventory: [] },
    start: 'room'
  };
}

test('accepts valid dialogue graph and action references', () => {
  const report = loadValidator().validate(validData());
  assert.equal(report.ok, true);
  assert.equal(report.errors.length, 0);
});

test('reports missing dialogue referenced by an action', () => {
  const data = validData();
  data.locations.room.actions[0].dialogue = 'missing';
  const report = loadValidator().validate(data);
  assert.equal(report.ok, false);
  assert.ok(report.errors.some(error => error.path.endsWith('.dialogue')));
});

test('reports missing dialogue start and next nodes', () => {
  const data = validData();
  data.dialogues.npc.start = 'unknown-start';
  data.dialogues.npc.nodes.hello.choices[0].next = 'unknown-next';
  const report = loadValidator().validate(data);
  assert.ok(report.errors.some(error => error.path === 'dialogues.npc.start'));
  assert.ok(report.errors.some(error => error.path.endsWith('.next')));
});

test('reports malformed choices and conflicting close/next navigation', () => {
  const data = validData();
  data.dialogues.npc.nodes.hello.choices[0].close = true;
  const report = loadValidator().validate(data);
  assert.ok(report.errors.some(error => error.message.includes('next и close')));
});
