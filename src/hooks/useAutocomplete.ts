import { useMemo } from 'react';
import type { WorkoutLog } from '../models';

/**
 * Returns a filtered list of exercise name suggestions based on the current input.
 */
export function useAutocomplete(logs: WorkoutLog[], input: string): string[] {
  const suggestions = useMemo((): string[] => {
    const names = new Set<string>();
    logs.forEach((log) =>
      log.exercises.forEach((ex) => names.add(ex.exerciseName))
    );
    if (!input.trim()) return [];
    const lower = input.toLowerCase();
    return [...names]
      .filter((n) => n.toLowerCase().startsWith(lower))
      .slice(0, 6);
  }, [logs, input]);

  return suggestions;
}
