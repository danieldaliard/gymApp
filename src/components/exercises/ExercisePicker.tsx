import { useState } from 'react';
import { useExercises } from '../../hooks/useExercises';
import { BODY_PART_COLORS } from '../../services/exerciseApiService';
import type { ApiExercise } from '../../services/exerciseApiService';
import type { WorkoutLog } from '../../models';
import styles from './ExercisePicker.module.css';

interface ExercisePickerProps {
  logs: WorkoutLog[];
  onSelect: (name: string) => void;
  onClose: () => void;
}

// Build used-name set for the green dot indicator (same logs passed to hook)
function getUsedNames(logs: WorkoutLog[]): Set<string> {
  const s = new Set<string>();
  logs.forEach((l) => l.exercises.forEach((e) => s.add(e.exerciseName.toLowerCase())));
  return s;
}

export function ExercisePicker({ logs, onSelect, onClose }: ExercisePickerProps) {
  const {
    exercises, bodyParts,
    search, setSearch,
    selectedBodyPart, setSelectedBodyPart,
    loading, loadingMore, error, retry,
    hasMore, loadMore,
  } = useExercises(logs);

  const [freeText, setFreeText] = useState('');
  const usedNames = getUsedNames(logs);

  const handleSelect = (ex: ApiExercise) => {
    onSelect(ex.name);
    onClose();
  };

  const handleFreeTextSubmit = () => {
    const trimmed = freeText.trim();
    if (trimmed) { onSelect(trimmed); onClose(); }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal>
      <div className={styles.sheet}>
        <div className={styles.handle} />

        <div className={styles.header}>
          <h3>Elegir ejercicio</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Buscar ejercicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Body-part filter chips — loaded from API */}
        <div className={styles.chips}>
          <button
            className={`${styles.chip} ${selectedBodyPart === null ? styles.chipActive : ''}`}
            onClick={() => setSelectedBodyPart(null)}
          >
            Todos
          </button>
          {bodyParts.map((bp) => (
            <button
              key={bp.value}
              className={`${styles.chip} ${selectedBodyPart === bp.value ? styles.chipActive : ''}`}
              onClick={() => setSelectedBodyPart(selectedBodyPart === bp.value ? null : bp.value)}
            >
              {bp.label}
            </button>
          ))}
        </div>

        {/* Exercise list */}
        <div className={styles.list}>

          {/* Loading skeleton */}
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}

          {/* Error state */}
          {!loading && error && (
            <div className={styles.errorBox}>
              <p>😕 {error}</p>
              <button className={styles.retryBtn} onClick={retry}>Reintentar</button>
            </div>
          )}

          {/* Results */}
          {!loading && !error && exercises.map((ex) => {
            const isUsed = usedNames.has(ex.name.toLowerCase());
            const bodyPart = ex.bodyParts[0] ?? '';
            const color = BODY_PART_COLORS[bodyPart] ?? '#6b7280';
            const bpLabel = bodyParts.find((b) => b.value === bodyPart)?.label ?? bodyPart;
            return (
              <button key={ex.exerciseId} className={styles.card} onClick={() => handleSelect(ex)}>
                <img
                  className={styles.cardImg}
                  src={ex.gifUrl}
                  alt={ex.name}
                  loading="lazy"
                />
                <div className={styles.cardInfo}>
                  <p className={styles.cardName}>{ex.name}</p>
                  <p className={styles.cardMuscles}>{ex.targetMuscles.join(' · ')}</p>
                </div>
                <span className={styles.badge} style={{ backgroundColor: color }}>
                  {bpLabel}
                </span>
                {isUsed && <span className={styles.usedDot} title="Ya lo usaste antes" />}
              </button>
            );
          })}

          {/* Empty state */}
          {!loading && !error && exercises.length === 0 && (
            <p className={styles.empty}>No se encontraron ejercicios</p>
          )}

          {/* Load more */}
          {!loading && !error && hasMore && (
            <button
              className={styles.loadMoreBtn}
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Cargando…' : 'Ver más ejercicios'}
            </button>
          )}

          {/* Free-text fallback */}
          <div className={styles.freeTextRow}>
            <span className={styles.freeTextLabel}>✏️ Otro ejercicio</span>
            <input
              className={styles.freeTextInput}
              type="text"
              placeholder="Escribí el nombre del ejercicio..."
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFreeTextSubmit()}
            />
            <button
              className={styles.freeTextBtn}
              onClick={handleFreeTextSubmit}
              disabled={!freeText.trim()}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

