/**
 * Domain types and factory functions.
 *
 * These interfaces are intentionally shaped to match future .NET API DTOs.
 * When migrating to a backend:
 *   1. Keep the interfaces here (or move to a `types/api.ts` file)
 *   2. Replace factory functions in services with API calls
 *   3. No component/hook changes required
 */
import { v4 as uuidv4 } from 'uuid';

// ─── Interfaces ────────────────────────────────────────────────────────────

export interface WorkoutSet {
  weight: number;
  reps: number;
}

export interface Exercise {
  id: string;
  name: string;
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string; // ISO 8601
}

/** One exercise entry inside a logged workout session */
export interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

/** A completed workout session saved to history */
export interface WorkoutLog {
  id: string;
  routineId: string;
  routineName: string;
  date: string; // ISO 8601
  exercises: LoggedExercise[];
}

// ─── Factory functions ──────────────────────────────────────────────────────

export function createRoutine(name: string): Routine {
  return {
    id: uuidv4(),
    name,
    exercises: [],
    createdAt: new Date().toISOString(),
  };
}

export function createExercise(name: string): Exercise {
  return {
    id: uuidv4(),
    name,
  };
}

export function createSet(weight = 0, reps = 12): WorkoutSet {
  return { weight, reps };
}

export function createWorkoutLog(routine: Routine): WorkoutLog {
  return {
    id: uuidv4(),
    routineId: routine.id,
    routineName: routine.name,
    date: new Date().toISOString(),
    exercises: routine.exercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: [],
    })),
  };
}
