/**
 * useWorkoutSessions — manages the live workout session and all past sessions.
 *
 * Key architecture principle:
 *   Sessions are immutable snapshots (exerciseName, gifUrl are stored at session-create time).
 *   Editing or deleting a Routine does NOT corrupt historical sessions.
 *
 * API migration:
 *   Replace sessionService calls with async fetch/axios calls.
 *   Add loading/error state to the hook.
 *   Component interfaces stay the same.
 */
import { useState, useCallback } from 'react';
import { sessionService } from '../services/storageService';
import { createWorkoutSession, createSet } from '../models';
import type { Routine, RoutineDay, WorkoutSession } from '../models';

export interface UseWorkoutSessionsReturn {
  sessions: WorkoutSession[];
  activeSession: WorkoutSession | null;
  startSession: (routine: Routine, day: RoutineDay) => void;
  cancelSession: () => void;
  addSet: (routineExerciseId: string, weight: number, reps: number) => void;
  removeSet: (routineExerciseId: string, setIndex: number) => void;
  finishSession: () => void;
  deleteSession: (id: string) => void;
  /** Returns the highest weight used across all past sessions for this exercise slot */
  lastWeightFor: (routineExerciseId: string) => number | undefined;
  /** Most recent completed session for a given routineDayId */
  lastSessionForDay: (dayId: string) => WorkoutSession | undefined;
}

export function useWorkoutSessions(): UseWorkoutSessionsReturn {
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => sessionService.getAll());
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);

  const startSession = useCallback((routine: Routine, day: RoutineDay) => {
    setActiveSession(createWorkoutSession(routine, day));
  }, []);

  const cancelSession = useCallback(() => setActiveSession(null), []);

  const addSet = useCallback((routineExerciseId: string, weight: number, reps: number) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.routineExerciseId === routineExerciseId
            ? { ...ex, sets: [...ex.sets, createSet(weight, reps)] }
            : ex,
        ),
      };
    });
  }, []);

  const removeSet = useCallback((routineExerciseId: string, setIndex: number) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.routineExerciseId === routineExerciseId
            ? { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) }
            : ex,
        ),
      };
    });
  }, []);

  const finishSession = useCallback(() => {
    if (!activeSession) return;
    const done: WorkoutSession = { ...activeSession, finishedAt: new Date().toISOString() };
    sessionService.add(done);
    setSessions(sessionService.getAll());
    setActiveSession(null);
  }, [activeSession]);

  const deleteSession = useCallback(
    (id: string) => {
      const updated = sessions.filter((s) => s.id !== id);
      sessionService.save(updated);
      setSessions(updated);
    },
    [sessions],
  );

  const lastWeightFor = useCallback(
    (routineExerciseId: string): number | undefined => {
      for (const s of sessions) {
        const ex = s.exercises.find((e) => e.routineExerciseId === routineExerciseId);
        if (ex && ex.sets.length > 0) {
          return Math.max(...ex.sets.map((set) => set.weight));
        }
      }
      return undefined;
    },
    [sessions],
  );

  const lastSessionForDay = useCallback(
    (dayId: string): WorkoutSession | undefined =>
      sessions.find((s) => s.routineDayId === dayId),
    [sessions],
  );

  return {
    sessions,
    activeSession,
    startSession,
    cancelSession,
    addSet,
    removeSet,
    finishSession,
    deleteSession,
    lastWeightFor,
    lastSessionForDay,
  };
}
