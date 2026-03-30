import { useState } from 'react';
import { routineService } from '../services/storageService';
import { createRoutine, createExercise } from '../models';
import type { Routine } from '../models';

export interface UseRoutinesReturn {
  routines: Routine[];
  addRoutine: (name: string) => void;
  deleteRoutine: (id: string) => void;
  renameRoutine: (id: string, newName: string) => void;
  addExercise: (routineId: string, exerciseName: string) => void;
  deleteExercise: (routineId: string, exerciseId: string) => void;
  reorderExercise: (routineId: string, fromIndex: number, toIndex: number) => void;
}

/**
 * Manages the list of workout routines.
 * All mutations go through storageService so the layer is swappable.
 */
export function useRoutines(): UseRoutinesReturn {
  const [routines, setRoutines] = useState<Routine[]>(() => routineService.getAll());

  const persist = (updated: Routine[]): void => {
    routineService.save(updated);
    setRoutines(updated);
  };

  const addRoutine = (name: string): void => {
    if (!name.trim()) return;
    persist([...routines, createRoutine(name.trim())]);
  };

  const deleteRoutine = (id: string): void => {
    persist(routines.filter((r) => r.id !== id));
  };

  const renameRoutine = (id: string, newName: string): void => {
    persist(routines.map((r) => (r.id === id ? { ...r, name: newName } : r)));
  };

  const addExercise = (routineId: string, exerciseName: string): void => {
    if (!exerciseName.trim()) return;
    persist(
      routines.map((r) =>
        r.id === routineId
          ? { ...r, exercises: [...r.exercises, createExercise(exerciseName.trim())] }
          : r
      )
    );
  };

  const deleteExercise = (routineId: string, exerciseId: string): void => {
    persist(
      routines.map((r) =>
        r.id === routineId
          ? { ...r, exercises: r.exercises.filter((e) => e.id !== exerciseId) }
          : r
      )
    );
  };

  const reorderExercise = (routineId: string, fromIndex: number, toIndex: number): void => {
    persist(
      routines.map((r) => {
        if (r.id !== routineId) return r;
        const exs = [...r.exercises];
        const [moved] = exs.splice(fromIndex, 1);
        exs.splice(toIndex, 0, moved);
        return { ...r, exercises: exs };
      })
    );
  };

  return { routines, addRoutine, deleteRoutine, renameRoutine, addExercise, deleteExercise, reorderExercise };
}
