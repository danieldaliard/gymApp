import { useState } from 'react';
import type { WorkoutLog } from '../../models';
import styles from './WorkoutSession.module.css';

interface WorkoutSessionProps {
  session: WorkoutLog;
  lastWeights: Record<string, number>;
  onAddSet: (exerciseId: string, weight: number, reps: number) => void;
  onRemoveSet: (exerciseId: string, setIndex: number) => void;
  onFinish: () => void;
  onCancel: () => void;
}

interface ExerciseLoggerProps {
  exercise: WorkoutLog['exercises'][number];
  lastWeight?: number;
  onAddSet: (weight: number, reps: number) => void;
  onRemoveSet: (index: number) => void;
}

/** Renders the active workout session with all exercises */
export default function WorkoutSession({ session, onAddSet, onRemoveSet, onFinish, onCancel, lastWeights }: WorkoutSessionProps) {
  return (
    <div className={styles.session}>
      <div className={styles.topBar}>
        <h2 className={styles.title}>{session.routineName}</h2>
        <span className={styles.date}>{new Date(session.date).toLocaleDateString('es-AR')}</span>
      </div>

      <div className={styles.exercises}>
        {session.exercises.map((ex) => (
          <ExerciseLogger
            key={ex.exerciseId}
            exercise={ex}
            lastWeight={lastWeights?.[ex.exerciseName]}
            onAddSet={(w, r) => onAddSet(ex.exerciseId, w, r)}
            onRemoveSet={(i) => onRemoveSet(ex.exerciseId, i)}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <button className={`${styles.btn} ${styles.cancel}`} onClick={onCancel}>
          Cancelar
        </button>
        <button className={`${styles.btn} ${styles.finish}`} onClick={onFinish}>
          ✅ Finalizar
        </button>
      </div>
    </div>
  );
}

function ExerciseLogger({ exercise, lastWeight, onAddSet, onRemoveSet }: ExerciseLoggerProps) {
  const [weight, setWeight] = useState<number | ''>(lastWeight ?? '');
  const [reps, setReps] = useState<number>(12);

  const handleAdd = () => {
    if (weight === '' || (weight as number) < 0) return;
    onAddSet(weight as number, reps);
  };

  return (
    <div className={styles.exCard}>
      <div className={styles.exHeader}>
        <span className={styles.exName}>{exercise.exerciseName}</span>
        {lastWeight != null && (
          <span className={styles.lastWeight}>Último: {lastWeight} kg</span>
        )}
      </div>

      {/* Set list */}
      {exercise.sets.length > 0 && (
        <ul className={styles.setList}>
          {exercise.sets.map((set, i) => (
            <li key={i} className={styles.setItem}>
              <span>Serie {i + 1}:</span>
              <strong>{set.weight} kg × {set.reps} reps</strong>
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
        <button className={styles.addSetBtn} onClick={handleAdd}>+ Serie</button>
      </div>
    </div>
  );
}
