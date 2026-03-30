import ProgressView from '../components/progress/ProgressView';
import type { WorkoutLog } from '../models';
import styles from './Page.module.css';

interface ProgressPageProps {
  logs: WorkoutLog[];
}

export default function ProgressPage({ logs }: ProgressPageProps) {
  return (
    <div className={styles.page}>
      <ProgressView logs={logs} />
    </div>
  );
}
