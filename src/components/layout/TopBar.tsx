import styles from './TopBar.module.css';

const PAGE_TITLES: Record<string, string> = {
  '/':         'Rutinas',
  '/workout':  'Entrenar',
  '/history':  'Historial',
  '/progress': 'Progreso',
};

interface TopBarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  pathname: string;
}

export default function TopBar({ theme, onToggleTheme, pathname }: TopBarProps) {
  const title = PAGE_TITLES[pathname] ?? 'GymTracker';

  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🏋️</span>
        <span className={styles.logoText}>GymTracker</span>
      </div>
      <h1 className={styles.title}>{title}</h1>
      <button
        className={styles.themeBtn}
        onClick={onToggleTheme}
        aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
        title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
