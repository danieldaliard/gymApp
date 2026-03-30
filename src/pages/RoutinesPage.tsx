import { useState } from 'react';
import { ExercisePicker } from '../components/exercises/ExercisePicker';
import type { PickedExercise } from '../components/exercises/ExercisePicker';
import { useLanguage } from '../i18n';
import type { Routine, RoutineDay, WorkoutSession } from '../models';
import pageStyles from './Page.module.css';
import styles from './RoutinesPage.module.css';

const MUSCLE_GROUPS = [
  'Piernas', 'Glúteos', 'Pecho', 'Espalda', 'Hombros',
  'Bíceps', 'Tríceps', 'Core', 'Abdomen', 'Cardio',
];

interface RoutinesPageProps {
  routines: Routine[];
  days: RoutineDay[];
  sessions: WorkoutSession[];
  onAddRoutine: (name: string) => void;
  onDeleteRoutine: (id: string) => void;
  onRenameRoutine: (id: string, name: string) => void;
  onAddDay: (routineId: string, name: string) => void;
  onRenameDay: (dayId: string, name: string) => void;
  onDeleteDay: (dayId: string) => void;
  onSetDayMuscleGroups: (dayId: string, groups: string[]) => void;
  onAddExerciseToDay: (dayId: string, exerciseDbId: string, name: string, gifUrl: string, bodyPart: string) => void;
  onRemoveExerciseFromDay: (dayId: string, exerciseId: string) => void;
}

export default function RoutinesPage({
  routines, days, sessions,
  onAddRoutine, onDeleteRoutine, onRenameRoutine,
  onAddDay, onRenameDay, onDeleteDay,
  onSetDayMuscleGroups,
  onAddExerciseToDay, onRemoveExerciseFromDay,
}: RoutinesPageProps) {
  const { t } = useLanguage();
  const [newName, setNewName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddRoutine(newName.trim());
    setNewName('');
  };

  return (
    <div className={pageStyles.page}>
      <form className={pageStyles.addForm} onSubmit={handleCreate}>
        <input
          className={pageStyles.input}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={t.routines_new_placeholder}
        />
        <button className={pageStyles.addBtn} type="submit">{t.routines_create}</button>
      </form>

      {routines.length === 0 ? (
        <div className={pageStyles.emptyState}>
          <span className={pageStyles.emptyIcon}>📋</span>
          <h3 className={pageStyles.emptyTitle}>{t.routines_empty_title}</h3>
          <p className={pageStyles.emptyText}>{t.routines_empty_sub}</p>
        </div>
      ) : (
        routines.map((routine) => {
          const routineDays = days
            .filter((d) => d.routineId === routine.id)
            .sort((a, b) => a.order - b.order);
          return (
            <RoutineItem
              key={routine.id}
              routine={routine}
              days={routineDays}
              sessions={sessions}
              onDelete={() => onDeleteRoutine(routine.id)}
              onRename={(name) => onRenameRoutine(routine.id, name)}
              onAddDay={(name) => onAddDay(routine.id, name)}
              onRenameDay={onRenameDay}
              onDeleteDay={onDeleteDay}
              onSetDayMuscleGroups={onSetDayMuscleGroups}
              onAddExerciseToDay={onAddExerciseToDay}
              onRemoveExerciseFromDay={onRemoveExerciseFromDay}
            />
          );
        })
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────
// RoutineItem
// ─────────────────────────────────────────────────
interface RoutineItemProps {
  routine: Routine;
  days: RoutineDay[];
  sessions: WorkoutSession[];
  onDelete: () => void;
  onRename: (name: string) => void;
  onAddDay: (name: string) => void;
  onRenameDay: (dayId: string, name: string) => void;
  onDeleteDay: (dayId: string) => void;
  onSetDayMuscleGroups: (dayId: string, groups: string[]) => void;
  onAddExerciseToDay: (dayId: string, exerciseDbId: string, name: string, gifUrl: string, bodyPart: string) => void;
  onRemoveExerciseFromDay: (dayId: string, exerciseId: string) => void;
}

function RoutineItem({
  routine, days, sessions,
  onDelete, onRename,
  onAddDay, onRenameDay, onDeleteDay,
  onSetDayMuscleGroups,
  onAddExerciseToDay, onRemoveExerciseFromDay,
}: RoutineItemProps) {
  const { t } = useLanguage();
  const [dayName, setDayName] = useState('');

  const handleAddDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dayName.trim()) return;
    onAddDay(dayName.trim());
    setDayName('');
  };

  return (
    <div className={styles.routineCard}>
      <div className={styles.routineHeader}>
        <input
          className={styles.routineNameInput}
          defaultValue={routine.name}
          onBlur={(e) => onRename(e.target.value)}
        />
        <button className={styles.iconBtn} onClick={onDelete} title={t.delete}>🗑</button>
      </div>

      <div className={styles.dayList}>
        {days.map((day) => (
          <DayItem
            key={day.id}
            day={day}
            sessions={sessions}
            onRename={(name) => onRenameDay(day.id, name)}
            onDelete={() => onDeleteDay(day.id)}
            onSetMuscleGroups={(groups) => onSetDayMuscleGroups(day.id, groups)}
            onAddExercise={(ex) => onAddExerciseToDay(day.id, ex.exerciseDbId, ex.name, ex.gifUrl, ex.bodyPart)}
            onRemoveExercise={(exId) => onRemoveExerciseFromDay(day.id, exId)}
          />
        ))}
      </div>

      <form className={styles.addDayForm} onSubmit={handleAddDay}>
        <input
          className={styles.addDayInput}
          value={dayName}
          onChange={(e) => setDayName(e.target.value)}
          placeholder={t.routines_day_placeholder}
        />
        <button className={styles.addDayBtn} type="submit">{t.routines_add_day}</button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────
// DayItem
// ─────────────────────────────────────────────────
interface DayItemProps {
  day: RoutineDay;
  sessions: WorkoutSession[];
  onRename: (name: string) => void;
  onDelete: () => void;
  onSetMuscleGroups: (groups: string[]) => void;
  onAddExercise: (ex: PickedExercise) => void;
  onRemoveExercise: (exerciseId: string) => void;
}

function DayItem({ day, sessions, onRename, onDelete, onSetMuscleGroups, onAddExercise, onRemoveExercise }: DayItemProps) {
  const { t } = useLanguage();
  const [showPicker, setShowPicker] = useState(false);

  const toggleMuscle = (g: string) => {
    const current = day.muscleGroups ?? [];
    onSetMuscleGroups(
      current.includes(g) ? current.filter((m) => m !== g) : [...current, g]
    );
  };

  return (
    <div className={styles.dayCard}>
      <div className={styles.dayHeader}>
        <input
          className={styles.dayNameInput}
          defaultValue={day.name}
          onBlur={(e) => onRename(e.target.value)}
        />
        <button className={styles.iconBtn} onClick={onDelete} title={t.delete}>🗑</button>
      </div>

      <div className={styles.muscleChips}>
        {MUSCLE_GROUPS.map((g) => (
          <button
            key={g}
            className={`${styles.muscleChip}${(day.muscleGroups ?? []).includes(g) ? ` ${styles.selected}` : ''}`}
            type="button"
            onClick={() => toggleMuscle(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {day.exercises.length === 0 ? (
        <p className={styles.noExercisesHint}>{t.routines_no_exercises}</p>
      ) : (
        <ul className={styles.exerciseList}>
          {day.exercises.map((ex) => (
            <li key={ex.id} className={styles.exerciseRow}>
              {ex.gifUrl && (
                <img className={styles.exerciseGif} src={ex.gifUrl} alt={ex.name} loading="lazy" />
              )}
              <span className={styles.exerciseName}>{ex.name}</span>
              {ex.bodyPart && <span className={styles.bodyPartChip}>{ex.bodyPart}</span>}
              <button className={styles.removeExBtn} onClick={() => onRemoveExercise(ex.id)}>✕</button>
            </li>
          ))}
        </ul>
      )}

      <button className={styles.addExBtn} type="button" onClick={() => setShowPicker(true)}>
        {t.routines_add_exercise}
      </button>

      {showPicker && (
        <ExercisePicker
          sessions={sessions}
          onSelect={(ex) => { onAddExercise(ex); setShowPicker(false); }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}


