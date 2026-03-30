/**
 * Domain models — v2 architecture.
 *
 * Design principle:
 *   WorkoutSession snapshots all exercise data (name, gifUrl) at creation time.
 *   Editing or deleting a Routine never corrupts historical sessions.
 *
 * API migration:
 *   1. Keep these interfaces — they match REST DTOs
 *   2. Replace factory functions in services/ with API calls
 *   3. No hook or component changes required
 */
import { v4 as uuidv4 } from 'uuid';

// ─── Primitives ───────────────────────────────────────────────────────────────

export interface WorkoutSet {
  weight: number;
  reps: number;
}

// ─── Routine template (editable, no weights/reps stored here) ────────────────

export interface Routine {
  id: string;
  name: string;
  createdAt: string; // ISO 8601
}

export interface RoutineDay {
  id: string;
  routineId: string;
  name: string;           // e.g. "Día 1 – Piernas"
  muscleGroups: string[]; // e.g. ["Piernas", "Glúteos"]
  exercises: RoutineExercise[];
  order: number;
}

/** Exercise slot inside a day — reference only, no sets/weights */
export interface RoutineExercise {
  id: string;
  exerciseDbId: string;  // ExerciseDB id or 'custom'
  name: string;          // snapshot of name when added
  gifUrl: string;
  bodyPart: string;
  order: number;
}

// ─── Workout session (immutable execution snapshot) ──────────────────────────

/**
 * Fully self-contained session record. Safe to keep even after the source
 * Routine/RoutineDay has been modified or deleted.
 */
export interface WorkoutSession {
  id: string;
  routineId: string;
  routineName: string;    // snapshot
  routineDayId: string;
  routineDayName: string; // snapshot
  startedAt: string;      // ISO 8601
  finishedAt: string;     // ISO 8601 — empty string while in progress
  exercises: SessionExercise[];
}

export interface SessionExercise {
  routineExerciseId: string; // links back for last-weight lookup
  exerciseDbId: string;
  name: string;              // snapshot
  gifUrl: string;
  sets: WorkoutSet[];
}

// ─── Factory functions ────────────────────────────────────────────────────────

export function createRoutine(name: string): Routine {
  return { id: uuidv4(), name, createdAt: new Date().toISOString() };
}

export function createRoutineDay(
  routineId: string,
  name: string,
  order: number,
): RoutineDay {
  return { id: uuidv4(), routineId, name, muscleGroups: [], exercises: [], order };
}

export function createRoutineExercise(
  exerciseDbId: string,
  name: string,
  gifUrl: string,
  bodyPart: string,
  order: number,
): RoutineExercise {
  return { id: uuidv4(), exerciseDbId, name, gifUrl, bodyPart, order };
}

export function createWorkoutSession(routine: Routine, day: RoutineDay): WorkoutSession {
  return {
    id: uuidv4(),
    routineId: routine.id,
    routineName: routine.name,
    routineDayId: day.id,
    routineDayName: day.name,
    startedAt: new Date().toISOString(),
    finishedAt: '',
    exercises: day.exercises.map((ex) => ({
      routineExerciseId: ex.id,
      exerciseDbId: ex.exerciseDbId,
      name: ex.name,
      gifUrl: ex.gifUrl,
      sets: [],
    })),
  };
}

export function createSet(weight = 0, reps = 12): WorkoutSet {
  return { weight, reps };
}
