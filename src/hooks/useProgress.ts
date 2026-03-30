import { useMemo } from 'react';
import type { WorkoutLog, WorkoutSet } from '../models';

export interface ProgressDataPoint {
  date: string;
  maxWeight: number;
  avgWeight: number;
  sets: WorkoutSet[];
}

export interface UseProgressReturn {
  chartData: ProgressDataPoint[];
  lastWeight: number | null;
  maxWeight: number;
  allExerciseNames: string[];
}

/**
 * Derives progress data for a specific exercise name from the workout log history.
 */
export function useProgress(logs: WorkoutLog[], exerciseName: string): UseProgressReturn {
  const allExerciseNames = useMemo((): string[] => {
    const names = new Set<string>();
    logs.forEach((log) =>
      log.exercises.forEach((ex) => names.add(ex.exerciseName))
    );
    return [...names].sort();
  }, [logs]);

  const chartData = useMemo(() => {
    if (!exerciseName) return [];

    return logs
      .filter((log) =>
        log.exercises.some(
          (e) => e.exerciseName.toLowerCase() === exerciseName.toLowerCase()
        )
      )
      .map((log) => {
        const ex = log.exercises.find(
          (e) => e.exerciseName.toLowerCase() === exerciseName.toLowerCase()
        );
        const weights = ex?.sets?.map((s) => s.weight) ?? [];
        const maxW = weights.length ? Math.max(...weights) : 0;
        const avgW =
          weights.length
            ? Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10
            : 0;
        return {
          date: log.date.slice(0, 10),
          maxWeight: maxW,
          avgWeight: avgW,
          sets: ex?.sets ?? [],
        };
      })
      .reverse(); // chronological order
  }, [logs, exerciseName]);

  const lastWeight = chartData.length > 0 ? chartData[chartData.length - 1].maxWeight : null;
  const maxWeight = chartData.reduce(
    (max, d) => (d.maxWeight > max ? d.maxWeight : max),
    0
  );

  return { chartData, lastWeight, maxWeight, allExerciseNames };
}
