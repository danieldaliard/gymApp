import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gymtracker_theme';

type Theme = 'light' | 'dark';

export interface UseThemeReturn {
  theme: Theme;
  toggle: () => void;
}

/**
 * Manages light/dark theme by toggling a `data-theme` attribute on <html>.
 * Defaults to light mode; persists preference in localStorage.
 */
export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return saved ?? 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return { theme, toggle };
}
