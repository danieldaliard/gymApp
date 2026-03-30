# GymTracker 💪

A personal gym workout tracker web app built with **React + Vite**. Mobile-first, works offline via `localStorage`, and structured for easy migration to a .NET backend.

## Features

- **Rutinas** — Create training days (e.g. Legs, Chest) and add exercises to each
- **Entrenar** — Start a live session: log sets with weight & reps for each exercise
- **Historial** — Browse past workouts by date
- **Progreso** — Line chart + table showing weight evolution per exercise; shows last weight used

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Charts | Recharts |
| IDs | uuid v4 |
| Persistence | localStorage (via `storageService`) |
| Styling | CSS Modules (mobile-first) |

## Project Structure

```
src/
  models/           # Entity factories (Routine, Exercise, Set, WorkoutLog)
  services/         # storageService.js — single LS abstraction layer
  hooks/            # useRoutines, useWorkoutLog, useProgress, useAutocomplete
  components/       # layout/, routines/, workout/, history/, progress/
  pages/            # RoutinesPage, WorkoutPage, HistoryPage, ProgressPage
```

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

## API Migration

To replace localStorage with a .NET REST API:
1. Update each method in `src/services/storageService.js` with `fetch` calls
2. Make the functions `async` and `await` them in the hooks
3. No component code changes needed


- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
