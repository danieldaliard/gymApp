/**
 * Internationalisation — minimal but scalable.
 *
 * Adding a new language:
 *   1. Add its key to the `T` object below
 *   2. Add it to the `LANGUAGES` array in TopBar
 *   No other file changes required.
 *
 * Exercise names from ExerciseDB stay in English (international gym standard).
 * All UI text is translated here.
 */
import React, { createContext, useContext, useState } from 'react';

export type Language = 'es' | 'en';

const LANG_KEY = 'gymtracker_lang';

export const T = {
  es: {
    // ── Navigation ────────────────────────────────────────
    nav_routines:  'Rutinas',
    nav_workout:   'Entrenar',
    nav_history:   'Historial',
    nav_progress:  'Progreso',
    // ── Routines page ─────────────────────────────────────
    routines_new_placeholder: 'Nueva rutina (ej: Split ABC, PPL…)',
    routines_create:          'Crear',
    routines_empty_title:     'Sin rutinas todavía',
    routines_empty_sub:       'Creá tu primera rutina para organizar tus días de entrenamiento.',
    routines_add_day:         '+ Agregar día',
    routines_day_placeholder: 'Nombre del día (ej: Día 1 · Piernas)',
    routines_no_exercises:    'Sin ejercicios. Tocá + para agregar.',
    routines_add_exercise:    '+ Agregar ejercicio',
    routines_muscle_groups:   'Grupos musculares',
    // ── Workout page ──────────────────────────────────────
    workout_select_prompt:    'Seleccioná el día de hoy:',
    workout_no_routines_title:'¡Creá tu primera rutina!',
    workout_no_routines_sub:  'Necesitás una rutina con al menos un día y ejercicios para empezar.',
    workout_no_days:          'Esta rutina aún no tiene días. Editala desde Rutinas.',
    workout_last:             'Último',
    workout_add_set:          '+ Serie',
    workout_finish:           '✅ Finalizar',
    workout_cancel:           'Cancelar sesión',
    workout_kg:               'kg',
    workout_reps:             'reps',
    workout_serie:            'Serie',
    // ── History page ──────────────────────────────────────
    history_empty_title:      'Sin entrenamientos registrados',
    history_empty_sub:        'Completá tu primer entrenamiento y aparecerá acá con todos los detalles.',
    history_go_workout:       'Ir a Entrenar →',
    history_duration:         'Duración',
    history_sets:             'series',
    // ── Progress page ─────────────────────────────────────
    progress_placeholder:     '-- Seleccioná un ejercicio --',
    progress_last_weight:     'Último peso',
    progress_record:          'Récord personal',
    progress_sessions:        'Sesiones',
    progress_chart_hint:      'Necesitás al menos 2 sesiones para ver el gráfico.',
    // ── Common ────────────────────────────────────────────
    delete:          'Eliminar',
    save:            'Guardar',
    cancel:          'Cancelar',
    close:           'Cerrar',
    loading:         'Cargando…',
    retry:           'Reintentar',
    no_sets:         'Sin series',
    go_to_routines:  'Ir a Rutinas →',
    exercises:       'ejercicios',
    exercise_sing:   'ejercicio',
    delete_workout:  'Eliminar registro',
    rename:          'Renombrar',
  },
  en: {
    nav_routines:  'Routines',
    nav_workout:   'Workout',
    nav_history:   'History',
    nav_progress:  'Progress',
    routines_new_placeholder: 'New routine (e.g. PPL Split)',
    routines_create:          'Create',
    routines_empty_title:     'No routines yet',
    routines_empty_sub:       'Create your first routine to organize your workout days.',
    routines_add_day:         '+ Add day',
    routines_day_placeholder: 'Day name (e.g. Day 1 · Legs)',
    routines_no_exercises:    'No exercises. Tap + to add.',
    routines_add_exercise:    '+ Add exercise',
    routines_muscle_groups:   'Muscle groups',
    workout_select_prompt:    "Select today's day:",
    workout_no_routines_title:'Create your first routine!',
    workout_no_routines_sub:  'You need a routine with at least one day and exercises to get started.',
    workout_no_days:          'This routine has no days yet. Edit it in Routines.',
    workout_last:             'Last',
    workout_add_set:          '+ Set',
    workout_finish:           '✅ Finish',
    workout_cancel:           'Cancel session',
    workout_kg:               'kg',
    workout_reps:             'reps',
    workout_serie:            'Set',
    history_empty_title:      'No workouts recorded',
    history_empty_sub:        'Complete your first workout and it will appear here with all details.',
    history_go_workout:       'Go to Workout →',
    history_duration:         'Duration',
    history_sets:             'sets',
    progress_placeholder:     '-- Select an exercise --',
    progress_last_weight:     'Last weight',
    progress_record:          'Personal record',
    progress_sessions:        'Sessions',
    progress_chart_hint:      'You need at least 2 sessions to see the chart.',
    delete:          'Delete',
    save:            'Save',
    cancel:          'Cancel',
    close:           'Close',
    loading:         'Loading…',
    retry:           'Retry',
    no_sets:         'No sets',
    go_to_routines:  'Go to Routines →',
    exercises:       'exercises',
    exercise_sing:   'exercise',
    delete_workout:  'Delete record',
    rename:          'Rename',
  },
} as const;

export type TranslationSet = typeof T.es;

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: TranslationSet;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  setLang: () => {},
  t: T.es,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_KEY) as Language | null;
    return saved === 'en' ? 'en' : 'es';
  });

  const setLang = (l: Language) => {
    localStorage.setItem(LANG_KEY, l);
    setLangState(l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: T[lang] as TranslationSet }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
