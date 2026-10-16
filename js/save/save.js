/*
  Слой сохранения. Знает только про localStorage и JSON.
  Ничего не знает ни про state, ни про GAME_DATA, ни про UI.
  Принимает произвольный сериализуемый снимок и возвращает его обратно.

  Публичный API:
    Save.write(snapshot)   -> { ok: true } | { ok: false, error: "storage" | "unknown" }
    Save.read()            -> { ok: true, snapshot } | { ok: false, error: "empty" | "parse" | "unknown" }
    Save.clear()           -> { ok: true } | { ok: false, error }
    Save.exists()          -> boolean
    Save.SAVE_KEY          -> string
*/
window.Save = (() => {
  "use strict";

  const SAVE_KEY = "text-adventure-save-v2";

  function write(snapshot) {
    try {
      const payload = JSON.stringify(snapshot);
      localStorage.setItem(SAVE_KEY, payload);
      return { ok: true };
    } catch (e) {
      // QuotaExceededError, SecurityError, приватный режим и т.п.
      const reason = (e && e.name === "QuotaExceededError") ? "storage" : "unknown";
      return { ok: false, error: reason, cause: e };
    }
  }

  function read() {
    let raw;
    try {
      raw = localStorage.getItem(SAVE_KEY);
    } catch (e) {
      return { ok: false, error: "unknown", cause: e };
    }
    if (!raw) return { ok: false, error: "empty" };
    try {
      return { ok: true, snapshot: JSON.parse(raw) };
    } catch (e) {
      return { ok: false, error: "parse", cause: e };
    }
  }

  function clear() {
    try {
      localStorage.removeItem(SAVE_KEY);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "unknown", cause: e };
    }
  }

  function exists() {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch (e) {
      return false;
    }
  }

  return { write, read, clear, exists, SAVE_KEY };
})();