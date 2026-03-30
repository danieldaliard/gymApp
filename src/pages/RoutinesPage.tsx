import { useState } from 'react';
import RoutineCard from '../components/routines/RoutineCard';
import Onboarding from '../components/onboarding/Onboarding';
import type { Routine, WorkoutLog } from '../models';
import styles from './Page.module.css';

const ONBOARDING_KEY = 'gymtracker_onboarding_done';

interface RoutinesPageProps {
  routines: Routine[];
  logs: WorkoutLog[];
  onAddRoutine: (name: string) => void;
  onDeleteRoutine: (id: string) => void;
  onAddExercise: (routineId: string, exerciseName: string) => void;
  onDeleteExercise: (routineId: string, exerciseId: string) => void;
  onStartWorkout: (routine: Routine) => void;
}

export default function RoutinesPage({ routines, onAddRoutine, onDeleteRoutine, onAddExercise, onDeleteExercise, onStartWorkout, logs }: RoutinesPageProps) {
  const [name, setName] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem(ONBOARDING_KEY)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddRoutine(name.trim());
    setName('');
  };

  const dismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setShowOnboarding(false);
  };

  return (
    <div className={styles.page}>
      {showOnboarding && <Onboarding onDismiss={dismissOnboarding} />}

      <form className={styles.addForm} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nueva rutina (ej: Piernas, Pecho…)"
        />
        <button className={styles.addBtn} type="submit">Crear</button>
      </form>

      {routines.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📋</span>
          <h3 className={styles.emptyTitle}>Sin rutinas todavía</h3>
          <p className={styles.emptyText}>
            Escribí el nombre de tu primera rutina arriba y tocá <strong>Crear</strong>.<br />
            Después agregás los ejercicios dentro de cada rutina.
          </p>
          <div className={styles.emptyHint}>
            💡 Ejemplos: <em>Piernas</em>, <em>Pecho y tríceps</em>, <em>Espalda y bíceps</em>
          </div>
        </div>
      ) : (
        routines.map((r) => (
          <RoutineCard
            key={r.id}
            routine={r}
            onDelete={onDeleteRoutine}
            onAddExercise={onAddExercise}
            onDeleteExercise={onDeleteExercise}
            onStartWorkout={onStartWorkout}
            logs={logs}
          />
        ))
      )}
    </div>
  );
}

