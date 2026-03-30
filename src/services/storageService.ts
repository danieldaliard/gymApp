/**
 * Storage Service — single abstraction layer over localStorage.
 *
 * ──── API Migration Checklist ────────────────────────────────────────────────
 * To replace localStorage with a .NET REST API:
 *   1. Make each function async and return Promise<T>
 *   2. Replace localStorage calls with fetch / axios calls
 *   3. Update hooks to await these calls (add loading/error state)
 *   4. The interfaces in models/index.ts already match typical API shapes
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { Routine, WorkoutLog } from '../models';

const PREFIX = 'gymtracker_';

const KEYS = {
  ROUTINES:     `${PREFIX}routines`,
  WORKOUT_LOGS: `${PREFIX}workout_logs`,
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

  getById: (id: string): Routine | null =>
    load<Routine[]>(KEYS.ROUTINES, []).find((r) => r.id === id) ?? null,
};

// ─── Workout Log Service ─────────────────────────────────────────────────────

export const workoutLogService = {
  getAll: (): WorkoutLog[] => load<WorkoutLog[]>(KEYS.WORKOUT_LOGS, []),

  save: (logs: WorkoutLog[]): void => persist(KEYS.WORKOUT_LOGS, logs),

  add: (log: WorkoutLog): void => {
    const logs = load<WorkoutLog[]>(KEYS.WORKOUT_LOGS, []);
    persist(KEYS.WORKOUT_LOGS, [log, ...logs]);
  },

  getByRoutineId: (routineId: string): WorkoutLog[] =>
    load<WorkoutLog[]>(KEYS.WORKOUT_LOGS, []).filter(
      (l) => l.routineId === routineId
    ),

  getByExerciseName: (name: string): WorkoutLog[] =>
    load<WorkoutLog[]>(KEYS.WORKOUT_LOGS, []).filter((l) =>
      l.exercises.some(
        (e) => e.exerciseName.toLowerCase() === name.toLowerCase()
      )
    ),
};
