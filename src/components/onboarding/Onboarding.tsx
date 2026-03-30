import styles from './Onboarding.module.css';

interface Step {
  icon: string;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    icon: '📋',
    title: 'Creá tus rutinas',
    desc: 'En la pestaña Rutinas, creá días de entrenamiento (ej: Piernas, Pecho) y agregá ejercicios a cada uno.',
  },
  {
    icon: '💪',
    title: 'Registrá tu entrenamiento',
    desc: 'En Entrenar, seleccioná la rutina del día y cargá series con peso y repeticiones en tiempo real.',
  },
  {
    icon: '📅',
    title: 'Revisá tu historial',
    desc: 'Cada entrenamiento completado queda guardado con fecha. Podés ver todos los detalles de sesiones pasadas.',
  },
  {
    icon: '📈',
    title: 'Seguí tu progreso',
    desc: 'En Progreso, elegí un ejercicio y ves cómo evolucionó tu peso a lo largo del tiempo con un gráfico.',
  },
];

interface OnboardingProps {
  onDismiss: () => void;
}

export default function Onboarding({ onDismiss }: OnboardingProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.bigIcon}>🏋️</span>
          <h2 className={styles.title}>¡Bienvenido a GymTracker!</h2>
          <p className={styles.sub}>Tu app personal para registrar y mejorar tus entrenamientos.</p>
        </div>

        <ol className={styles.steps}>
          {STEPS.map((step, i) => (
            <li key={i} className={styles.step}>
              <div className={styles.stepIcon}>{step.icon}</div>
              <div>
                <strong className={styles.stepTitle}>{step.title}</strong>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <button className={styles.cta} onClick={onDismiss}>
          ¡Empezar ahora! 🚀
        </button>
      </div>
    </div>
  );
}
