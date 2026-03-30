/**
 * Storage Service v2 — single abstraction layer over localStorage.
 *
 * Uses v2 keys to avoid conflicts with any v1 data.
 *
 * API migration:
 *   1. Make each method async → Promise<T>
 *   2. Replace localStorage calls with fetch/axios
 *   3. Hooks already have loading/error state patterns ready
 */
import type { Routine, RoutineDay, WorkoutSession } from '../models';

const PREFIX = 'gymtracker_v2_';

const KEYS = {
  ROUTINES:     `${PREFIX}routines`,
  ROUTINE_DAYS: `${PREFIX}routine_days`,
  SESSIONS:     `${PREFIX}sessions`,
} as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function persist<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Routine Service ─────────────────────────────────────────────────────────

export const routineService = {
  getAll: (): Routine[] => load<Routine[]>(KEYS.ROUTINES, []),
  save: (routines: Routine[]): void => persist(KEYS.ROUTINES, routines),
};

// ─── Routine Day Service ──────────────────────────────────────────────────────

export const routineDayService = {
  getAll: (): RoutineDay[] => load<RoutineDay[]>(KEYS.ROUTINE_DAYS, []),
  save: (days: RoutineDay[]): void => persist(KEYS.ROUTINE_DAYS, days),
};

// ─── Session Service ──────────────────────────────────────────────────────────

export const sessionService = {
  getAll: (): WorkoutSession[] => load<WorkoutSession[]>(KEYS.SESSIONS, []),
  save: (sessions: WorkoutSession[]): void => persist(KEYS.SESSIONS, sessions),
  add: (session: WorkoutSession): void => {
    const all = load<WorkoutSession[]>(KEYS.SESSIONS, []);
    persist(KEYS.SESSIONS, [session, ...all]);
  },
};
