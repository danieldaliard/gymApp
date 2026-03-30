/**
 * useExercises — fetches exercises from ExerciseDB API.
 * https://exercisedb.dev/api/v1
 *
 * Features:
 *  - Body-part filter chips (loaded from API)
 *  - Debounced fuzzy search
 *  - Pagination (load more)
 *  - Previously-used exercises sorted to the top
 *
 * API migration note:
 *   To switch to your own .NET backend, update BASE_URL in exerciseApiService.ts.
 *   This hook's return shape stays identical.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  exerciseApi,
  BODY_PART_LABELS,
  BODY_PART_COLORS,
} from '../services/exerciseApiService';
import type { ApiExercise, ApiPage } from '../services/exerciseApiService';
import type { WorkoutSession } from '../models';

const PAGE_SIZE = 25;

export interface BodyPartOption {
  value: string;
  label: string;
  color: string;
}

export interface UseExercisesReturn {
  exercises: ApiExercise[];
  bodyParts: BodyPartOption[];
  search: string;
  setSearch: (v: string) => void;
  selectedBodyPart: string | null;
  setSelectedBodyPart: (bp: string | null) => void;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  retry: () => void;
  hasMore: boolean;
  loadMore: () => void;
}

export function useExercises(sessions: WorkoutSession[] = []): UseExercisesReturn {
  const [exercises, setExercises] = useState<ApiExercise[]>([]);
  const [bodyParts, setBodyParts] = useState<BodyPartOption[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build a set of previously-used exercise names for sort prioritisation
  const usedNames = useMemo<Set<string>>(() => {
    const names = new Set<string>();
    sessions.forEach((sess) => sess.exercises.forEach((e) => names.add(e.name.toLowerCase())));
    return names;
  }, [sessions]);

  // Load body parts list once on mount
  useEffect(() => {
    exerciseApi.getBodyParts().then((page) => {
      const opts: BodyPartOption[] = (page.data ?? []).map((item) => {
        const bp = typeof item === 'string' ? item : item.name;
        return {
          value: bp,
          label: BODY_PART_LABELS[bp] ?? bp,
          color: BODY_PART_COLORS[bp] ?? '#6b7280',
        };
      });
      setBodyParts(opts);
    }).catch(() => {/* non-critical */});
  }, []);

  // Core fetch — first page
  const fetchFirstPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOffset(0);
    try {
      let page: ApiPage<ApiExercise>;
      if (search.trim()) {
        page = await exerciseApi.search(search.trim(), PAGE_SIZE, 0);
      } else if (selectedBodyPart) {
        page = await exerciseApi.getByBodyPart(selectedBodyPart, PAGE_SIZE, 0);
      } else {
        page = await exerciseApi.getAll(PAGE_SIZE, 0);
      }
      setExercises(page.data ?? []);
      const total = page.metadata?.totalExercises ?? 0;
      setHasMore(total > PAGE_SIZE);
    } catch (e) {
      setError((e as Error).message ?? 'Error al cargar ejercicios');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedBodyPart, retryToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce to avoid hammering the API on every keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const delay = search.trim() ? 350 : 0;
    debounceRef.current = setTimeout(fetchFirstPage, delay);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [fetchFirstPage]);

  // Load next page and append
  const loadMore = useCallback(async () => {
    const nextOffset = offset + PAGE_SIZE;
    setLoadingMore(true);
    try {
      let page: ApiPage<ApiExercise>;
      if (search.trim()) {
        page = await exerciseApi.search(search.trim(), PAGE_SIZE, nextOffset);
      } else if (selectedBodyPart) {
        page = await exerciseApi.getByBodyPart(selectedBodyPart, PAGE_SIZE, nextOffset);
      } else {
        page = await exerciseApi.getAll(PAGE_SIZE, nextOffset);
      }
      setExercises((prev) => [...prev, ...(page.data ?? [])]);
      setOffset(nextOffset);
      const total = page.metadata?.totalExercises ?? 0;
      setHasMore(total > nextOffset + PAGE_SIZE);
    } catch {
      // silently ignore load-more errors
    } finally {
      setLoadingMore(false);
    }
  }, [search, selectedBodyPart, offset]);

  // Sort used exercises to the top (client-side, no extra fetch)
  const sortedExercises = useMemo<ApiExercise[]>(() => {
    if (usedNames.size === 0) return exercises;
    return [...exercises].sort((a, b) => {
      const aUsed = usedNames.has(a.name.toLowerCase()) ? 0 : 1;
      const bUsed = usedNames.has(b.name.toLowerCase()) ? 0 : 1;
      return aUsed - bUsed;
    });
  }, [exercises, usedNames]);

  return {
    exercises: sortedExercises,
    bodyParts,
    search,
    setSearch,
    selectedBodyPart,
    setSelectedBodyPart,
    loading,
    loadingMore,
    error,
    retry: () => setRetryToken((t) => t + 1),
    hasMore,
    loadMore,
  };
}
