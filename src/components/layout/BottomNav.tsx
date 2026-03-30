import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { to: '/',         label: t.nav_routines, icon: '📋' },
    { to: '/workout',  label: t.nav_workout,  icon: '💪' },
    { to: '/history',  label: t.nav_history,  icon: '📅' },
    { to: '/progress', label: t.nav_progress, icon: '📈' },
  ];

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>{icon}</span>
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
