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
import type { WorkoutLog } from '../../models';
import styles from './ProgressView.module.css';

interface ProgressViewProps {
  logs: WorkoutLog[];
}

export default function ProgressView({ logs }: ProgressViewProps) {
  const [selected, setSelected] = useState('');
  const { chartData, lastWeight, maxWeight, allExerciseNames } = useProgress(
    logs,
    selected
  );

  return (
    <div className={styles.container}>
      <div className={styles.selectorWrapper}>
        <label className={styles.label} htmlFor="exercise-select">
          Ejercicio
        </label>
        <select
          id="exercise-select"
          className={styles.select}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">-- Seleccioná un ejercicio --</option>
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
              <span className={styles.statLabel}>Último peso</span>
              <span className={styles.statValue}>
                {lastWeight != null ? `${lastWeight} kg` : '—'}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Récord personal</span>
              <span className={styles.statValue}>
                {maxWeight ? `${maxWeight} kg` : '—'}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Sesiones</span>
              <span className={styles.statValue}>{chartData.length}</span>
            </div>
          </div>

          {chartData.length < 2 ? (
            <p className={styles.hint}>
              Necesitás al menos 2 sesiones para ver el gráfico.
            </p>
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
            <h3 className={styles.histTitle}>Historial por sesión</h3>
            {chartData
              .slice()
              .reverse()
              .map((d, i) => (
                <div key={i} className={styles.histRow}>
                  <span className={styles.histDate}>{d.date}</span>
                  <div className={styles.histSets}>
                    {d.sets.map((s, j) => (
                      <span key={j} className={styles.histSet}>
                        {s.weight}kg×{s.reps}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {!selected && allExerciseNames.length === 0 && (
        <p className={styles.hint}>
          Aún no hay registros. ¡Completá tu primer entrenamiento!
        </p>
      )}
    </div>
  );
}
