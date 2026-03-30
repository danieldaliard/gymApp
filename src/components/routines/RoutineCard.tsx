import { useState } from 'react';
import { ExercisePicker } from '../exercises/ExercisePicker';
import type { Routine, WorkoutLog } from '../../models';
import styles from './RoutineCard.module.css';

interface RoutineCardProps {
  routine: Routine;
  logs: WorkoutLog[];
  onDelete: (id: string) => void;
  onAddExercise: (routineId: string, exerciseName: string) => void;
  onDeleteExercise: (routineId: string, exerciseId: string) => void;
  onStartWorkout: (routine: Routine) => void;
}

export default function RoutineCard({ routine, onDelete, onAddExercise, onDeleteExercise, onStartWorkout, logs }: RoutineCardProps) {
  const [open, setOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handlePickerSelect = (name: string) => {
    onAddExercise(routine.id, name);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={() => setOpen((o) => !o)}>
        <div className={styles.headerLeft}>
          <span className={styles.name}>{routine.name}</span>
          <span className={styles.badge}>{routine.exercises.length} ejercicios</span>
        </div>
        <span className={styles.toggle}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className={styles.body}>
          <ul className={styles.exerciseList}>
            {routine.exercises.length === 0 && (
              <li className={styles.empty}>
                Agregá ejercicios con el botón de abajo ↓
              </li>
            )}
            {routine.exercises.map((ex) => (
              <li key={ex.id} className={styles.exerciseItem}>
                <span>{ex.name}</span>
                <button
                  className={styles.iconBtn}
                  onClick={() => onDeleteExercise(routine.id, ex.id)}
                  aria-label="Eliminar ejercicio"
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>

          {/* Add exercise via picker */}
          <button
            className={`${styles.btn} ${styles.addExBtn}`}
            onClick={() => setShowPicker(true)}
          >
            + Agregar ejercicio
          </button>

          <div className={styles.actions}>
            <button
              className={`${styles.btn} ${styles.startBtn}`}
              onClick={() => onStartWorkout(routine)}
              disabled={routine.exercises.length === 0}
            >
              💪 Iniciar entrenamiento
            </button>
            <button
              className={`${styles.btn} ${styles.deleteBtn}`}
              onClick={() => onDelete(routine.id)}
            >
              Eliminar rutina
            </button>
          </div>
        </div>
      )}

      {showPicker && (
        <ExercisePicker
          logs={logs}
          onSelect={handlePickerSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

