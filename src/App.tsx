import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import { useRoutines } from './hooks/useRoutines';
import { useWorkoutSessions } from './hooks/useWorkoutSessions';
import { useTheme } from './hooks/useTheme';
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';
import RoutinesPage from './pages/RoutinesPage';
import WorkoutPage from './pages/WorkoutPage';
import HistoryPage from './pages/HistoryPage';
import ProgressPage from './pages/ProgressPage';
import './index.css';

/** Inner layout — needs to be inside BrowserRouter to use useLocation */
function AppLayout() {
  const { pathname } = useLocation();
  const { theme, toggle: toggleTheme } = useTheme();

  const {
    routines, days,
    addRoutine, deleteRoutine, renameRoutine,
    addDay, renameDay, deleteDay,
    setDayMuscleGroups,
    addExerciseToDay, removeExerciseFromDay,
  } = useRoutines();

  const {
    sessions, activeSession,
    startSession, cancelSession,
    addSet, removeSet, finishSession, deleteSession,
    lastWeightFor, lastSessionForDay,
  } = useWorkoutSessions();

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
                days={days}
                sessions={sessions}
                onAddRoutine={addRoutine}
                onDeleteRoutine={deleteRoutine}
                onRenameRoutine={renameRoutine}
                onAddDay={addDay}
                onRenameDay={renameDay}
                onDeleteDay={deleteDay}
                onSetDayMuscleGroups={setDayMuscleGroups}
                onAddExerciseToDay={addExerciseToDay}
                onRemoveExerciseFromDay={removeExerciseFromDay}
              />
            }
          />
          <Route
            path="/workout"
            element={
              <WorkoutPage
                routines={routines}
                days={days}
                activeSession={activeSession}
                onStartWorkout={startSession}
                onAddSet={addSet}
                onRemoveSet={removeSet}
                onFinish={finishSession}
                onCancel={cancelSession}
                lastWeightFor={lastWeightFor}
                lastSessionForDay={lastSessionForDay}
              />
            }
          />
          <Route
            path="/history"
            element={<HistoryPage sessions={sessions} onDeleteSession={deleteSession} />}
          />
          <Route
            path="/progress"
            element={<ProgressPage sessions={sessions} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </LanguageProvider>
  );
}




