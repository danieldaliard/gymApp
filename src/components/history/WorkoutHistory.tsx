import { useState } from 'react';
import type { WorkoutLog } from '../../models';
import styles from './WorkoutHistory.module.css';

interface WorkoutHistoryProps {
  logs: WorkoutLog[];
  onDelete: (id: string) => void;
}

export default function WorkoutHistory({ logs, onDelete }: WorkoutHistoryProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  if (logs.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Sin entrenamientos registrados todavía.</p>
        <p>¡Empezá tu primer sesión! 💪</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {logs.map((log) => (
        <li key={log.id} className={styles.item}>
          <div className={styles.header} onClick={() => toggle(log.id)}>
            <div>
              <span className={styles.routineName}>{log.routineName}</span>
              <span className={styles.date}>
                {new Date(log.date).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <span className={styles.toggle}>{expanded === log.id ? '▲' : '▼'}</span>
          </div>

          {expanded === log.id && (
            <div className={styles.detail}>
              {log.exercises.map((ex) => (
                <div key={ex.exerciseId} className={styles.exBlock}>
                  <span className={styles.exName}>{ex.exerciseName}</span>
                  {ex.sets.length === 0 ? (
                    <span className={styles.noSets}>Sin series</span>
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
              <button
                className={styles.deleteBtn}
                onClick={() => onDelete(log.id)}
              >
                Eliminar registro
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
