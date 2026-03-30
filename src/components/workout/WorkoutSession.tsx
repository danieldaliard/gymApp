import { useState, useEffect } from 'react';
import type { WorkoutSession, SessionExercise } from '../../models';
import { useLanguage } from '../../i18n';
import styles from './WorkoutSession.module.css';

interface WorkoutSessionProps {
  session: WorkoutSession;
  lastWeightFor: (routineExerciseId: string) => number | undefined;
  onAddSet: (routineExerciseId: string, weight: number, reps: number) => void;
  onRemoveSet: (routineExerciseId: string, setIndex: number) => void;
  onFinish: () => void;
  onCancel: () => void;
}

interface ExerciseLoggerProps {
  exercise: SessionExercise;
  lastWeight?: number;
  onAddSet: (weight: number, reps: number) => void;
  onRemoveSet: (index: number) => void;
}

function useElapsedTime(startedAt: string): string {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = new Date(startedAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Renders the active workout session with all exercises */
export default function WorkoutSession({ session, lastWeightFor, onAddSet, onRemoveSet, onFinish, onCancel }: WorkoutSessionProps) {
  const { t } = useLanguage();
  const elapsed = useElapsedTime(session.startedAt);
  const done = session.exercises.filter((ex) => ex.sets.length > 0).length;

  return (
    <div className={styles.session}>
      <div className={styles.topBar}>
        <div>
          <h2 className={styles.title}>{session.routineName}</h2>
          <span className={styles.subtitle}>{session.routineDayName}</span>
        </div>
        <div className={styles.timerBadge}>{elapsed}</div>
      </div>

      <div className={styles.progressInfo}>
        {done} / {session.exercises.length} ejercicios con series
      </div>

      <div className={styles.exercises}>
        {session.exercises.map((ex) => (
          <ExerciseLogger
            key={ex.routineExerciseId}
            exercise={ex}
            lastWeight={lastWeightFor(ex.routineExerciseId)}
            onAddSet={(w, r) => onAddSet(ex.routineExerciseId, w, r)}
            onRemoveSet={(i) => onRemoveSet(ex.routineExerciseId, i)}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <button className={`${styles.btn} ${styles.cancel}`} onClick={onCancel}>
          {t.workout_cancel}
        </button>
        <button className={`${styles.btn} ${styles.finish}`} onClick={onFinish}>
          {t.workout_finish}
        </button>
      </div>
    </div>
  );
}

function ExerciseLogger({ exercise, lastWeight, onAddSet, onRemoveSet }: ExerciseLoggerProps) {
  const { t } = useLanguage();
  const [weight, setWeight] = useState<number | ''>(lastWeight ?? '');
  const [reps, setReps] = useState<number>(12);

  const handleAdd = () => {
    if (weight === '' || (weight as number) < 0) return;
    onAddSet(weight as number, reps);
  };

  return (
    <div className={styles.exCard}>
      <div className={styles.exHeader}>
        {exercise.gifUrl && (
          <img className={styles.gifThumb} src={exercise.gifUrl} alt={exercise.name} loading="lazy" />
        )}
        <div className={styles.exInfo}>
          <span className={styles.exName}>{exercise.name}</span>
          {lastWeight != null && (
            <span className={styles.lastWeight}>{t.workout_last}: {lastWeight} {t.workout_kg}</span>
          )}
        </div>
      </div>

      {/* Set list */}
      {exercise.sets.length > 0 && (
        <ul className={styles.setList}>
          {exercise.sets.map((set, i) => (
            <li key={i} className={styles.setItem}>
              <span>{t.workout_serie} {i + 1}:</span>
              <strong>{set.weight} {t.workout_kg} × {set.reps} {t.workout_reps}</strong>
              <button className={styles.removeBtn} onClick={() => onRemoveSet(i)}>✕</button>
            </li>
          ))}
        </ul>
      )}

      {/* Add set controls */}
      <div className={styles.addRow}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>kg</label>
          <input
            className={styles.numInput}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="0"
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>reps</label>
          <input
            className={styles.numInput}
            type="number"
            inputMode="numeric"
            min="1"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
          />
        </div>
        <button className={styles.addSetBtn} onClick={handleAdd}>{t.workout_add_set}</button>
      </div>
    </div>
  );
}
