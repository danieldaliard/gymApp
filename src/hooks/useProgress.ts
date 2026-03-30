import { useMemo } from 'react';
import type { WorkoutSession } from '../models';

export interface ProgressDataPoint {
  date: string;
  maxWeight: number;
  avgWeight: number;
  totalSets: number;
}

export interface UseProgressReturn {
  chartData: ProgressDataPoint[];
  lastWeight: number | null;
  maxWeight: number;
  allExerciseNames: string[];
}

export function useProgress(sessions: WorkoutSession[], exerciseName: string): UseProgressReturn {
  const allExerciseNames = useMemo((): string[] => {
    const names = new Set<string>();
    sessions.forEach((s) => s.exercises.forEach((ex) => names.add(ex.name)));
    return [...names].sort();
  }, [sessions]);

  const chartData = useMemo<ProgressDataPoint[]>(() => {
    if (!exerciseName) return [];
    return sessions
      .filter((s) => s.exercises.some((e) => e.name.toLowerCase() === exerciseName.toLowerCase()))
      .map((s) => {
        const ex = s.exercises.find((e) => e.name.toLowerCase() === exerciseName.toLowerCase())!;
        const weights = ex.sets.map((set) => set.weight);
        const maxW = weights.length ? Math.max(...weights) : 0;
        const avgW = weights.length
          ? Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10
          : 0;
        return {
          date: new Date(s.startedAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
          maxWeight: maxW,
          avgWeight: avgW,
          totalSets: ex.sets.length,
        };
      })
      .reverse();
  }, [sessions, exerciseName]);

  const lastWeight = chartData.length > 0 ? chartData[chartData.length - 1].maxWeight : null;
  const maxWeight = chartData.reduce((max, d) => (d.maxWeight > max ? d.maxWeight : max), 0);

  return { chartData, lastWeight, maxWeight, allExerciseNames };
}