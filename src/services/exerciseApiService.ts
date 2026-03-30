/**
 * ExerciseDB API service — https://exercisedb.dev
 * Base URL: https://exercisedb.dev/api/v1
 * No authentication required (free, open source, 1500+ exercises with GIFs).
 *
 * API migration note (future .NET backend):
 *   Update BASE_URL to your own proxy, add auth headers here.
 *   No hook or component changes required.
 */

const BASE_URL = 'https://exercisedb.dev/api/v1';

// ─── Response types ──────────────────────────────────────────────────────────

export interface ApiExercise {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

export interface ApiPage<T> {
  success: boolean;
  metadata: {
    totalExercises: number;
    totalPages: number;
    currentPage: number;
    nextPage: string | null;
  };
  data: T[];
}

// ─── Body part labels & colors (API returns English keys) ────────────────────

export const BODY_PART_LABELS: Record<string, string> = {
  back:          '🔙 Espalda',
  cardio:        '🏃 Cardio',
  chest:         '💪 Pecho',
  'lower arms':  '💪 Antebrazos',
  'lower legs':  '🦵 Pantorrillas',
  neck:          '🧠 Cuello',
  shoulders:     '🏋️ Hombros',
  'upper arms':  '💪 Brazos',
  'upper legs':  '🦵 Piernas',
  waist:         '🔥 Core',
};

export const BODY_PART_COLORS: Record<string, string> = {
  back:          '#2563eb',
  cardio:        '#475569',
  chest:         '#dc2626',
  'lower arms':  '#7c3aed',
  'lower legs':  '#16a34a',
  neck:          '#94a3b8',
  shoulders:     '#d97706',
  'upper arms':  '#0891b2',
  'upper legs':  '#16a34a',
  waist:         '#ea580c',
};

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`ExerciseDB ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const exerciseApi = {
  /** GET /api/v1/bodyparts — returns objects {name: string} */
  getBodyParts: (): Promise<ApiPage<{ name: string }>> =>
    apiFetch<ApiPage<{ name: string }>>('/bodyparts'),

  /** GET /api/v1/exercises/search?q=&limit=&offset=&threshold= */
  search: (q: string, limit = 25, offset = 0): Promise<ApiPage<ApiExercise>> =>
    apiFetch<ApiPage<ApiExercise>>(
      `/exercises/search?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}&threshold=0.4`
    ),

  /** GET /api/v1/bodyparts/{bodyPartName}/exercises?limit=&offset= */
  getByBodyPart: (bodyPart: string, limit = 25, offset = 0): Promise<ApiPage<ApiExercise>> =>
    apiFetch<ApiPage<ApiExercise>>(
      `/bodyparts/${encodeURIComponent(bodyPart)}/exercises?limit=${limit}&offset=${offset}`
    ),

  /** GET /api/v1/exercises?limit=&offset= */
  getAll: (limit = 25, offset = 0): Promise<ApiPage<ApiExercise>> =>
    apiFetch<ApiPage<ApiExercise>>(`/exercises?limit=${limit}&offset=${offset}`),

  /** GET /api/v1/exercises/{exerciseId} */
  getById: (id: string): Promise<ApiPage<ApiExercise>> =>
    apiFetch<ApiPage<ApiExercise>>(`/exercises/${encodeURIComponent(id)}`),
};
