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

  /* ---------- файл: экспорт / импорт ---------- */

  // Скачивает снимок как .json-файл.
  // snapshot — произвольный сериализуемый объект (обычно из Game.buildSnapshot()).
  function download(snapshot, filename) {
    try {
      const json = JSON.stringify(snapshot, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || defaultFilename();
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Освобождаем URL после того, как браузер начнёт загрузку.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "unknown", cause: e };
    }
  }

  function defaultFilename() {
    const d = new Date();
    const pad = n => String(n).padStart(2, "0");
    return `textgame-save-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.json`;
  }

  // Читает File -> snapshot.
  // Возвращает Promise, потому что FileReader асинхронен.
  function readFile(file) {
    return new Promise(resolve => {
      if (!file) { resolve({ ok: false, error: "empty" }); return; }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve({ ok: true, snapshot: JSON.parse(String(reader.result)) });
        } catch (e) {
          resolve({ ok: false, error: "parse", cause: e });
        }
      };
      reader.onerror = () => resolve({ ok: false, error: "unknown", cause: reader.error });
      reader.readAsText(file, "utf-8");
    });
  }

  // Открывает системный диалог выбора файла.
  // onFile получает File (или null, если пользователь отменил).
  function pickFile(onFile, accept) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept || "application/json,.json";
    input.style.display = "none";
    document.body.appendChild(input);

    let done = false;
    const finish = file => {
      if (done) return;
      done = true;
      input.remove();
      onFile(file || null);
    };

    input.addEventListener("change", () => finish(input.files && input.files[0]));
    // Отмена выбора: change не срабатывает, ловим по возвращению фокуса.
    window.addEventListener("focus", function onFocus() {
      window.removeEventListener("focus", onFocus);
      setTimeout(() => finish(input.files && input.files[0]), 300);
    }, { once: true });

    input.click();
  }

  return { write, read, clear, exists, download, readFile, pickFile, defaultFilename, SAVE_KEY };

  return { write, read, clear, exists, SAVE_KEY };
})();