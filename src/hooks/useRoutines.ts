import { useState, useCallback } from 'react';
import { routineService, routineDayService } from '../services/storageService';
import { createRoutine, createRoutineDay, createRoutineExercise } from '../models';
import type { Routine, RoutineDay } from '../models';

export interface UseRoutinesReturn {
  routines: Routine[];
  days: RoutineDay[];
  getDaysForRoutine: (routineId: string) => RoutineDay[];
  addRoutine: (name: string) => void;
  deleteRoutine: (id: string) => void;
  renameRoutine: (id: string, name: string) => void;
  addDay: (routineId: string, name: string) => void;
  renameDay: (dayId: string, name: string) => void;
  deleteDay: (dayId: string) => void;
  setDayMuscleGroups: (dayId: string, muscleGroups: string[]) => void;
  addExerciseToDay: (
    dayId: string,
    exerciseDbId: string,
    name: string,
    gifUrl: string,
    bodyPart: string,
  ) => void;
  removeExerciseFromDay: (dayId: string, exerciseId: string) => void;
}

export function useRoutines(): UseRoutinesReturn {
  const [routines, setRoutines] = useState<Routine[]>(() => routineService.getAll());
  const [days, setDays] = useState<RoutineDay[]>(() => routineDayService.getAll());

  const persistRoutines = (updated: Routine[]) => {
    routineService.save(updated);
    setRoutines(updated);
  };

  const persistDays = (updated: RoutineDay[]) => {
    routineDayService.save(updated);
    setDays(updated);
  };

  const getDaysForRoutine = useCallback(
    (routineId: string): RoutineDay[] =>
      days.filter((d) => d.routineId === routineId).sort((a, b) => a.order - b.order),
    [days],
  );

  const addRoutine = (name: string) => {
    if (!name.trim()) return;
    persistRoutines([...routines, createRoutine(name.trim())]);
  };

  const deleteRoutine = (id: string) => {
    persistRoutines(routines.filter((r) => r.id !== id));
    persistDays(days.filter((d) => d.routineId !== id));
  };

  const renameRoutine = (id: string, name: string) => {
    if (!name.trim()) return;
    persistRoutines(routines.map((r) => (r.id === id ? { ...r, name: name.trim() } : r)));
  };

  const addDay = (routineId: string, name: string) => {
    if (!name.trim()) return;
    const existing = days.filter((d) => d.routineId === routineId);
    persistDays([...days, createRoutineDay(routineId, name.trim(), existing.length)]);
  };

  const renameDay = (dayId: string, name: string) => {
    if (!name.trim()) return;
    persistDays(days.map((d) => (d.id === dayId ? { ...d, name: name.trim() } : d)));
  };

  const deleteDay = (dayId: string) => {
    persistDays(days.filter((d) => d.id !== dayId));
  };

  const setDayMuscleGroups = (dayId: string, muscleGroups: string[]) => {
    persistDays(days.map((d) => (d.id === dayId ? { ...d, muscleGroups } : d)));
  };

  const addExerciseToDay = (
    dayId: string,
    exerciseDbId: string,
    name: string,
    gifUrl: string,
    bodyPart: string,
  ) => {
    const day = days.find((d) => d.id === dayId);
    if (!day) return;
    const newEx = createRoutineExercise(exerciseDbId, name, gifUrl, bodyPart, day.exercises.length);
    persistDays(days.map((d) => (d.id === dayId ? { ...d, exercises: [...d.exercises, newEx] } : d)));
  };

  const removeExerciseFromDay = (dayId: string, exerciseId: string) => {
    persistDays(
      days.map((d) =>
        d.id === dayId
          ? { ...d, exercises: d.exercises.filter((e) => e.id !== exerciseId) }
          : d,
      ),
    );
  };

  return {
    routines, days, getDaysForRoutine,
    addRoutine, deleteRoutine, renameRoutine,
    addDay, renameDay, deleteDay, setDayMuscleGroups,
    addExerciseToDay, removeExerciseFromDay,
  };
}

