import WorkoutHistory from '../components/history/WorkoutHistory';
import { useLanguage } from '../i18n';
import type { WorkoutSession } from '../models';
import styles from './Page.module.css';

interface HistoryPageProps {
  sessions: WorkoutSession[];
  onDeleteSession: (id: string) => void;
}

export default function HistoryPage({ sessions, onDeleteSession }: HistoryPageProps) {
  const { t } = useLanguage();
  return (
    <div className={styles.page}>
      {sessions.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📅</span>
          <h3 className={styles.emptyTitle}>{t.history_empty_title}</h3>
          <p className={styles.emptyText}>{t.history_empty_sub}</p>
          <a href="/workout" className={styles.emptyAction}>{t.history_go_workout}</a>
        </div>
      ) : (
        <>
          <p className={styles.count}>{sessions.length} entrenamiento{sessions.length !== 1 ? 's' : ''}</p>
          <WorkoutHistory sessions={sessions} onDelete={onDeleteSession} />
        </>
      )}
    </div>
  );
}

