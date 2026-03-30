import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
  { to: '/', label: 'Rutinas', icon: '📋' },
  { to: '/workout', label: 'Entrenar', icon: '💪' },
  { to: '/history', label: 'Historial', icon: '📅' },
  { to: '/progress', label: 'Progreso', icon: '📈' },
];

export default function BottomNav() {
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
