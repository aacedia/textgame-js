const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadSave() {
  const values = new Map();
  const context = {
    console,
    JSON,
    Date,
    String,
    localStorage: {
      setItem(key, value) { values.set(key, String(value)); },
      getItem(key) { return values.has(key) ? values.get(key) : null; },
      removeItem(key) { values.delete(key); }
    }
  };
  context.window = context;
  vm.createContext(context);
  const source = fs.readFileSync(path.join(__dirname, '..', 'js/save/save.js'), 'utf8');
  vm.runInContext(source, context, { filename: 'js/save/save.js' });
  return { Save: context.Save, values };
}

test('Save writes and reads a JSON snapshot', () => {
  const { Save } = loadSave();
  const snapshot = { version: 2, state: { location: 'home' } };
  assert.equal(Save.write(snapshot).ok, true);
  const result = Save.read();
  assert.equal(result.ok, true);
  assert.deepEqual(JSON.parse(JSON.stringify(result.snapshot)), snapshot);
  assert.equal(Save.exists(), true);
});

test('Save reports empty storage and clears an existing snapshot', () => {
  const { Save } = loadSave();
  assert.deepEqual(JSON.parse(JSON.stringify(Save.read())), { ok: false, error: 'empty' });
  Save.write({ saved: true });
  assert.equal(Save.clear().ok, true);
  assert.equal(Save.exists(), false);
  assert.equal(Save.read().error, 'empty');
});

test('Save reports malformed JSON without throwing', () => {
  const { Save, values } = loadSave();
  values.set(Save.SAVE_KEY, '{broken json');
  const result = Save.read();
  assert.equal(result.ok, false);
  assert.equal(result.error, 'parse');
});
