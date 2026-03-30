import WorkoutHistory from '../components/history/WorkoutHistory';
import type { WorkoutLog } from '../models';
import styles from './Page.module.css';

interface HistoryPageProps {
  logs: WorkoutLog[];
  onDeleteLog: (id: string) => void;
}

export default function HistoryPage({ logs, onDeleteLog }: HistoryPageProps) {
  return (
    <div className={styles.page}>
      {logs.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📅</span>
          <h3 className={styles.emptyTitle}>Sin entrenamientos registrados</h3>
          <p className={styles.emptyText}>
            Cuando completes tu primer entrenamiento desde la pestaña <strong>Entrenar</strong>,
            va a aparecer acá con todos los detalles.
          </p>
          <a href="/workout" className={styles.emptyAction}>Ir a Entrenar →</a>
        </div>
      ) : (
        <>
          <p className={styles.count}>{logs.length} entrenamiento{logs.length !== 1 ? 's' : ''} registrado{logs.length !== 1 ? 's' : ''}</p>
          <WorkoutHistory logs={logs} onDelete={onDeleteLog} />
        </>
      )}
    </div>
  );
}

