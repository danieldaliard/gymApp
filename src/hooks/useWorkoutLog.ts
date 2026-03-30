import { useState, useCallback } from 'react';
import { workoutLogService } from '../services/storageService';
import { createWorkoutLog, createSet } from '../models';
import type { Routine, WorkoutLog } from '../models';

export interface UseWorkoutLogReturn {
  logs: WorkoutLog[];
  activeSession: WorkoutLog | null;
  startSession: (routine: Routine) => void;
  cancelSession: () => void;
  updateSet: (exerciseId: string, setIndex: number, weight: number, reps: number) => void;
  addSet: (exerciseId: string, weight: number, reps: number) => void;
  removeSet: (exerciseId: string, setIndex: number) => void;
  finishSession: () => void;
  deleteLog: (id: string) => void;
}

/**
 * Manages a live workout session and the historical log.
 */
export function useWorkoutLog(): UseWorkoutLogReturn {
  const [logs, setLogs] = useState<WorkoutLog[]>(() => workoutLogService.getAll());
  const [activeSession, setActiveSession] = useState<WorkoutLog | null>(null);

  // ---------- session ----------
  const startSession = useCallback((routine: Routine) => {
    setActiveSession(createWorkoutLog(routine));
  }, []);

  const cancelSession = useCallback(() => setActiveSession(null), []);

  /** Add or update a set for an exercise in the active session */
  const updateSet = useCallback((exerciseId: string, setIndex: number, weight: number, reps: number) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.exerciseId !== exerciseId) return ex;
          const sets = [...ex.sets];
          sets[setIndex] = createSet(Number(weight), Number(reps));
          return { ...ex, sets };
        }),
      };
    });
  }, []);

  /** Append a new set to an exercise */
  const addSet = useCallback((exerciseId: string, weight: number, reps: number) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.exerciseId === exerciseId
            ? { ...ex, sets: [...ex.sets, createSet(Number(weight), Number(reps))] }
            : ex
        ),
      };
    });
  }, []);

  const removeSet = useCallback((exerciseId: string, setIndex: number) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.exerciseId === exerciseId
            ? { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) }
            : ex
        ),
      };
    });
  }, []);

  const finishSession = useCallback(() => {
    if (!activeSession) return;
    workoutLogService.add(activeSession);
    setLogs(workoutLogService.getAll());
    setActiveSession(null);
  }, [activeSession]);

  // ---------- log history ----------
  const deleteLog = useCallback((id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    workoutLogService.save(updated);
    setLogs(updated);
  }, [logs]);

  return {
    logs,
    activeSession,
    startSession,
    cancelSession,
    updateSet,
    addSet,
    removeSet,
    finishSession,
    deleteLog,
  };
}
