import { useMemo } from 'react';
import type { WorkoutSession } from '../models';

/**
 * Returns exercise name suggestions based on past sessions.
 * Useful as a fallback for custom exercise names.
 */
export function useAutocomplete(sessions: WorkoutSession[], input: string): string[] {
  return useMemo((): string[] => {
    const names = new Set<string>();
    sessions.forEach((s) => s.exercises.forEach((ex) => names.add(ex.name)));
    if (!input.trim()) return [];
    const lower = input.toLowerCase();
    return [...names].filter((n) => n.toLowerCase().startsWith(lower)).slice(0, 6);
  }, [sessions, input]);
}
