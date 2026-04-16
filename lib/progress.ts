/**
 * localStorage-backed progress tracking.
 *
 * Shape is intentionally small for v1:
 *   - completedParts:   "act-1/01-cluster-architecture#story" → true
 *   - quizResults:      quizId → { correct: boolean, attempts: number }
 *   - weakConcepts:     syllabusId → number of misses
 *
 * Guardrail #7 from the plan: weaknesses are keyed by KCNA syllabus ID, not
 * by lesson/story beat, so remediation targets exam gaps directly.
 *
 * All reads/writes are guarded for SSR (window may be undefined).
 */

const KEY = "kcna-progress.v1";

interface ProgressState {
  completedParts: Record<string, boolean>;
  quizResults: Record<string, { correct: boolean; attempts: number }>;
  weakConcepts: Record<string, number>;
}

const EMPTY: ProgressState = {
  completedParts: {},
  quizResults: {},
  weakConcepts: {},
};

function read(): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

function write(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or storage blocked — fail silently for v1.
  }
}

export function markComplete(partKey: string): void {
  const state = read();
  state.completedParts[partKey] = true;
  write(state);
}

export function isComplete(partKey: string): boolean {
  return read().completedParts[partKey] === true;
}

export function recordQuiz(
  quizId: string,
  correct: boolean,
  syllabusIds: string[],
): void {
  const state = read();
  const prev = state.quizResults[quizId] ?? { correct: false, attempts: 0 };
  state.quizResults[quizId] = {
    correct: correct || prev.correct,
    attempts: prev.attempts + 1,
  };
  if (!correct) {
    for (const id of syllabusIds) {
      state.weakConcepts[id] = (state.weakConcepts[id] ?? 0) + 1;
    }
  }
  write(state);
}

export function getWeakConcepts(): Record<string, number> {
  return read().weakConcepts;
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
