'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext(null);

/**
 * Applies the resolved theme class to <html>.
 * Accepts 'light' | 'dark' | 'system'.
 */
function applyTheme(theme) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
}

/**
 * ThemeProvider — manages light / dark / system theme preference.
 *
 * - Persists preference to localStorage.
 * - Listens for OS preference changes when in 'system' mode.
 * - Pair with the anti-FOUC inline script in layout.js to avoid flash on load.
 */
export function ThemeProvider({ children }) {
  // Default to 'system' — the anti-FOUC script handles the initial class before hydration
  const [theme, setThemeState] = useState('system');

  // Sync state with persisted preference after mount
  useEffect(() => {
    const stored = localStorage.getItem('theme') ?? 'system';
    setThemeState(stored);
  }, []);

  // Re-apply when OS preference changes (only relevant in 'system' mode)
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme — access the current theme and setter from any client component.
 * @returns {{ theme: 'light'|'dark'|'system', setTheme: (t: string) => void }}
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
