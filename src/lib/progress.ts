"use client";

const STORAGE_KEY = "chatgpt-beginner-guide-progress-v1";

export type ProgressState = {
  completed: Record<string, boolean>;
  checklist: Record<string, boolean[]>;
};

function empty(): ProgressState {
  return { completed: {}, checklist: {} };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      completed: parsed.completed ?? {},
      checklist: parsed.checklist ?? {},
    };
  } catch {
    return empty();
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function isLessonDone(slug: string): boolean {
  return !!loadProgress().completed[slug];
}

export function markLessonDone(slug: string, done = true): void {
  const state = loadProgress();
  state.completed[slug] = done;
  saveProgress(state);
}

export function getChecklist(slug: string, length: number): boolean[] {
  const saved = loadProgress().checklist[slug];
  if (saved && saved.length === length) return saved;
  return Array.from({ length }, () => false);
}

export function setChecklistItem(
  slug: string,
  length: number,
  index: number,
  value: boolean
): void {
  const state = loadProgress();
  const list = getChecklist(slug, length).slice();
  list[index] = value;
  state.checklist[slug] = list;
  saveProgress(state);
}

export function countCompleted(slugs: string[]): number {
  const state = loadProgress();
  return slugs.filter((s) => state.completed[s]).length;
}
