import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useProgress } from '../../hooks/useProgress';
import { useLanguage } from '../../i18n';
import type { WorkoutSession } from '../../models';
import styles from './ProgressView.module.css';

interface ProgressViewProps {
  sessions: WorkoutSession[];
}

export default function ProgressView({ sessions }: ProgressViewProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState('');
  const { chartData, lastWeight, maxWeight, allExerciseNames } = useProgress(
    sessions,
    selected
  );

  return (
    <div className={styles.container}>
      <div className={styles.selectorWrapper}>
        <label className={styles.label} htmlFor="exercise-select">
          {t.nav_progress}
        </label>
        <select
          id="exercise-select"
          className={styles.select}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">{t.progress_placeholder}</option>
          {allExerciseNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>{t.progress_last_weight}</span>
              <span className={styles.statValue}>
                {lastWeight != null ? `${lastWeight} kg` : '—'}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>{t.progress_record}</span>
              <span className={styles.statValue}>
                {maxWeight ? `${maxWeight} kg` : '—'}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>{t.progress_sessions}</span>
              <span className={styles.statValue}>{chartData.length}</span>
            </div>
          </div>

          {chartData.length < 2 ? (
            <p className={styles.hint}>{t.progress_chart_hint}</p>
          ) : (
            <div className={styles.chart}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} unit=" kg" />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: 'var(--text)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="maxWeight"
                    name="Max kg"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'var(--accent)' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgWeight"
                    name="Prom kg"
                    stroke="var(--success)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'var(--success)' }}
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Per-session detail table */}
          <div className={styles.history}>
            <h3 className={styles.histTitle}>{t.history_duration}</h3>
            {chartData
              .slice()
              .reverse()
              .map((d, i) => (
                <div key={i} className={styles.histRow}>
                  <span className={styles.histDate}>{d.date}</span>
                  <span className={styles.histSets}>
                    {d.maxWeight} kg · {d.totalSets} {t.history_sets}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}

      {!selected && allExerciseNames.length === 0 && (
        <p className={styles.hint}>
          {t.workout_no_routines_sub}
        </p>
      )}
    </div>
  );
}
