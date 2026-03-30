import ProgressView from '../components/progress/ProgressView';
import type { WorkoutSession } from '../models';
import styles from './Page.module.css';

interface ProgressPageProps {
  sessions: WorkoutSession[];
}

export default function ProgressPage({ sessions }: ProgressPageProps) {
  return (
    <div className={styles.page}>
      <ProgressView sessions={sessions} />
    </div>
  );
}
