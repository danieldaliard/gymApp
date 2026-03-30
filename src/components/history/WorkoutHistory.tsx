import { useState } from 'react';
import type { WorkoutSession } from '../../models';
import { useLanguage } from '../../i18n';
import styles from './WorkoutHistory.module.css';

interface WorkoutHistoryProps {
  sessions: WorkoutSession[];
  onDelete: (id: string) => void;
}

function formatDuration(startedAt: string, finishedAt: string): string {
  if (!finishedAt) return '';
  const mins = Math.round((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 60000);
  return mins > 0 ? `${mins} min` : '';
}

export default function WorkoutHistory({ sessions, onDelete }: WorkoutHistoryProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  if (sessions.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Sin entrenamientos registrados todavía.</p>
        <p>¡Empezá tu primer sesión! 💪</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {sessions.map((session) => {
        const duration = formatDuration(session.startedAt, session.finishedAt);
        return (
          <li key={session.id} className={styles.item}>
            <div className={styles.header} onClick={() => toggle(session.id)}>
              <div>
                <span className={styles.routineName}>
                  {session.routineName} · {session.routineDayName}
                </span>
                <span className={styles.date}>
                  {new Date(session.startedAt).toLocaleDateString('es-AR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                  {duration && <span className={styles.duration}> · {duration}</span>}
                </span>
              </div>
              <span className={styles.toggle}>{expanded === session.id ? '▲' : '▼'}</span>
            </div>

            {expanded === session.id && (
              <div className={styles.detail}>
                {session.exercises.map((ex) => (
                  <div key={ex.routineExerciseId} className={styles.exBlock}>
                    <span className={styles.exName}>{ex.name}</span>
                    {ex.sets.length === 0 ? (
                      <span className={styles.noSets}>{t.no_sets}</span>
                    ) : (
                      <div className={styles.sets}>
                        {ex.sets.map((s, i) => (
                          <span key={i} className={styles.set}>
                            {s.weight}kg×{s.reps}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button className={styles.deleteBtn} onClick={() => onDelete(session.id)}>
                  {t.delete_workout}
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

