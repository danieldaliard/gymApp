import { useNavigate } from 'react-router-dom';
import WorkoutSessionComponent from '../components/workout/WorkoutSession';
import { useLanguage } from '../i18n';
import type { Routine, RoutineDay, WorkoutSession } from '../models';
import styles from './Page.module.css';

interface WorkoutPageProps {
  routines: Routine[];
  days: RoutineDay[];
  activeSession: WorkoutSession | null;
  onStartWorkout: (routine: Routine, day: RoutineDay) => void;
  onAddSet: (routineExerciseId: string, weight: number, reps: number) => void;
  onRemoveSet: (routineExerciseId: string, setIndex: number) => void;
  onFinish: () => void;
  onCancel: () => void;
  lastWeightFor: (routineExerciseId: string) => number | undefined;
  lastSessionForDay: (dayId: string) => WorkoutSession | undefined;
}

function formatRelative(isoDate: string): string {
  const d = new Date(isoDate);
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

export default function WorkoutPage({
  routines, days,
  activeSession,
  onStartWorkout, onAddSet, onRemoveSet, onFinish, onCancel,
  lastWeightFor, lastSessionForDay,
}: WorkoutPageProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleFinish = () => {
    onFinish();
    navigate('/history');
  };

  if (activeSession) {
    return (
      <div className={styles.page}>
        <WorkoutSessionComponent
          session={activeSession}
          lastWeightFor={lastWeightFor}
          onAddSet={onAddSet}
          onRemoveSet={onRemoveSet}
          onFinish={handleFinish}
          onCancel={onCancel}
        />
      </div>
    );
  }

  if (routines.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>💪</span>
          <h3 className={styles.emptyTitle}>{t.workout_no_routines_title}</h3>
          <p className={styles.emptyText}>{t.workout_no_routines_sub}</p>
          <a href="/" className={styles.emptyAction}>{t.go_to_routines}</a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <p className={styles.sub}>{t.workout_select_prompt}</p>

      {routines.map((routine) => {
        const routineDays = days
          .filter((d) => d.routineId === routine.id)
          .sort((a, b) => a.order - b.order);

        return (
          <div key={routine.id} className={styles.routineSection}>
            <h3 className={styles.routineSectionTitle}>{routine.name}</h3>

            {routineDays.length === 0 ? (
              <p className={styles.hint}>{t.workout_no_days}</p>
            ) : (
              <div className={styles.routineGrid}>
                {routineDays.map((day) => {
                  const lastSession = lastSessionForDay(day.id);
                  const exerciseCount = day.exercises.length;
                  const disabled = exerciseCount === 0;
                  return (
                    <button
                      key={day.id}
                      className={styles.routineBtn}
                      onClick={() => onStartWorkout(routine, day)}
                      disabled={disabled}
                    >
                      <span className={styles.routineIcon}>💪</span>
                      <div className={styles.routineInfo}>
                        <span className={styles.routineName}>{day.name}</span>
                        <span className={styles.routineMeta}>
                          {exerciseCount} {exerciseCount !== 1 ? t.exercises : t.exercise_sing}
                          {(day.muscleGroups ?? []).length > 0 && (
                            <span className={styles.lastDone}> · {day.muscleGroups!.join(', ')}</span>
                          )}
                        </span>
                        {lastSession && (
                          <span className={styles.lastDone}>
                            {formatRelative(lastSession.startedAt)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


