import { createInitialState, normalizeState, SAVE_KEY } from "./state";
import type { GameState } from "./types";

export function saveGame(state: GameState) {
  const next = { ...state, lastSavedAt: new Date().toISOString() };
  localStorage.setItem(SAVE_KEY, JSON.stringify(next));
  return next;
}

export function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    return saved ? normalizeState(JSON.parse(saved)) : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function resetGame() {
  const next = createInitialState();
  saveGame(next);
  return next;
}

export function exportSave(state: GameState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `hooker-and-millions-day-${state.currentDay}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function importSave(file: File) {
  return file.text().then((text) => normalizeState(JSON.parse(text)));
}