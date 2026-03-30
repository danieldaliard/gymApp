import { useNavigate } from 'react-router-dom';
import WorkoutSession from '../components/workout/WorkoutSession';
import type { Routine, WorkoutLog } from '../models';
import styles from './Page.module.css';

interface WorkoutPageProps {
  routines: Routine[];
  activeSession: WorkoutLog | null;
  logs: WorkoutLog[];
  onStartWorkout: (routine: Routine) => void;
  onAddSet: (exerciseId: string, weight: number, reps: number) => void;
  onRemoveSet: (exerciseId: string, setIndex: number) => void;
  onFinish: () => void;
  onCancel: () => void;
}

/** Format an ISO date string as a friendly relative label */
function formatRelative(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

export default function WorkoutPage({ routines, activeSession, onStartWorkout, onAddSet, onRemoveSet, onFinish, onCancel, logs }: WorkoutPageProps) {
  const navigate = useNavigate();

  /** Last weight used per exercise name */
  const lastWeights: Record<string, number> = {};
  logs.forEach((log) => {
    log.exercises.forEach((ex) => {
      if (ex.sets.length > 0 && !(ex.exerciseName in lastWeights)) {
        lastWeights[ex.exerciseName] = Math.max(...ex.sets.map((s) => s.weight));
      }
    });
  });

  /** Most recent log date per routine */
  const lastDoneByRoutine: Record<string, string> = {};
  logs.forEach((log) => {
    if (!lastDoneByRoutine[log.routineId]) {
      lastDoneByRoutine[log.routineId] = log.date;
    }
  });

  const handleFinish = () => {
    onFinish();
    navigate('/history');
  };

  if (activeSession) {
    return (
      <div className={styles.page}>
        <WorkoutSession
          session={activeSession}
          lastWeights={lastWeights}
          onAddSet={onAddSet}
          onRemoveSet={onRemoveSet}
          onFinish={handleFinish}
          onCancel={onCancel}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {routines.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>💪</span>
          <h3 className={styles.emptyTitle}>¡Creá tu primera rutina!</h3>
          <p className={styles.emptyText}>
            Para empezar a entrenar, primero necesitás crear una rutina con al menos un ejercicio.
          </p>
          <a href="/" className={styles.emptyAction}>Ir a Rutinas →</a>
        </div>
      ) : (
        <>
          <p className={styles.sub}>Seleccioná la rutina de hoy:</p>
          <div className={styles.routineGrid}>
            {routines.map((r) => {
              const lastDate = lastDoneByRoutine[r.id];
              return (
                <button
                  key={r.id}
                  className={styles.routineBtn}
                  onClick={() => onStartWorkout(r)}
                  disabled={r.exercises.length === 0}
                >
                  <span className={styles.routineIcon}>💪</span>
                  <div className={styles.routineInfo}>
                    <span className={styles.routineName}>{r.name}</span>
                    <span className={styles.routineMeta}>
                      {r.exercises.length} ejercicio{r.exercises.length !== 1 ? 's' : ''}
                      {lastDate && (
                        <span className={styles.lastDone}> · {formatRelative(lastDate)}</span>
                      )}
                    </span>
                  </div>
                  {lastDate && (
                    <span className={styles.repeatBadge} title="Repetir última sesión">↩</span>
                  )}
                </button>
              );
            })}
          </div>

          <p className={styles.hint}>
            💡 Al iniciar una rutina, el último peso usado de cada ejercicio se pre-carga automáticamente.
          </p>
        </>
      )}
    </div>
  );
}

