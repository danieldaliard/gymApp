import { useLanguage } from '../../i18n';
import styles from './TopBar.module.css';

interface TopBarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  pathname: string;
}

export default function TopBar({ theme, onToggleTheme, pathname }: TopBarProps) {
  const { lang, setLang, t } = useLanguage();

  const PAGE_TITLES: Record<string, string> = {
    '/':         t.nav_routines,
    '/workout':  t.nav_workout,
    '/history':  t.nav_history,
    '/progress': t.nav_progress,
  };

  const title = PAGE_TITLES[pathname] ?? 'GymTracker';

  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🏋️</span>
        <span className={styles.logoText}>GymTracker</span>
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        <button
          className={styles.langBtn}
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          {lang === 'es' ? 'EN' : 'ES'}
        </button>
        <button
          className={styles.themeBtn}
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
