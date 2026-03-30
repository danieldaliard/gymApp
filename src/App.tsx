import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useRoutines } from './hooks/useRoutines';
import { useWorkoutLog } from './hooks/useWorkoutLog';
import { useTheme } from './hooks/useTheme';
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';
import RoutinesPage from './pages/RoutinesPage';
import WorkoutPage from './pages/WorkoutPage';
import HistoryPage from './pages/HistoryPage';
import ProgressPage from './pages/ProgressPage';
import type { Routine, WorkoutLog } from './models';
import './index.css';

interface AppLayoutProps {
  routines: Routine[];
  addRoutine: (name: string) => void;
  deleteRoutine: (id: string) => void;
  addExercise: (routineId: string, exerciseName: string) => void;
  deleteExercise: (routineId: string, exerciseId: string) => void;
  logs: WorkoutLog[];
  activeSession: WorkoutLog | null;
  startSession: (routine: Routine) => void;
  cancelSession: () => void;
  addSet: (exerciseId: string, weight: number, reps: number) => void;
  removeSet: (exerciseId: string, setIndex: number) => void;
  finishSession: () => void;
  deleteLog: (id: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

/** Inner layout — needs to be inside BrowserRouter to use useLocation */
function AppLayout({ routines, addRoutine, deleteRoutine, addExercise, deleteExercise,
                     logs, activeSession, startSession, cancelSession,
                     addSet, removeSet, finishSession, deleteLog,
                     theme, toggleTheme }: AppLayoutProps) {
  const { pathname } = useLocation();

  return (
    <div className="app-root">
      <TopBar theme={theme} onToggleTheme={toggleTheme} pathname={pathname} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <RoutinesPage
                routines={routines}
                onAddRoutine={addRoutine}
                onDeleteRoutine={deleteRoutine}
                onAddExercise={addExercise}
                onDeleteExercise={deleteExercise}
                onStartWorkout={startSession}
                logs={logs}
              />
            }
          />
          <Route
            path="/workout"
            element={
              <WorkoutPage
                routines={routines}
                activeSession={activeSession}
                onStartWorkout={startSession}
                onAddSet={addSet}
                onRemoveSet={removeSet}
                onFinish={finishSession}
                onCancel={cancelSession}
                logs={logs}
              />
            }
          />
          <Route
            path="/history"
            element={<HistoryPage logs={logs} onDeleteLog={deleteLog} />}
          />
          <Route
            path="/progress"
            element={<ProgressPage logs={logs} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();

  const { routines, addRoutine, deleteRoutine, addExercise, deleteExercise } = useRoutines();
  const { logs, activeSession, startSession, cancelSession, addSet, removeSet, finishSession, deleteLog } = useWorkoutLog();

  return (
    <BrowserRouter>
      <AppLayout
        routines={routines}
        addRoutine={addRoutine}
        deleteRoutine={deleteRoutine}
        addExercise={addExercise}
        deleteExercise={deleteExercise}
        logs={logs}
        activeSession={activeSession}
        startSession={startSession}
        cancelSession={cancelSession}
        addSet={addSet}
        removeSet={removeSet}
        finishSession={finishSession}
        deleteLog={deleteLog}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </BrowserRouter>
  );
}



