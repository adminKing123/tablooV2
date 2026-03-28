'use client';

import { useTheme } from '@/components/providers/ThemeProvider';

/** Cycles: light → dark → system → light */
const CYCLE = { light: 'dark', dark: 'system', system: 'light' };
const LABELS = { light: 'Light', dark: 'Dark', system: 'System' };

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

const ICONS = {
  light: <SunIcon />,
  dark: <MoonIcon />,
  system: <SystemIcon />,
};

/**
 * ThemeToggle — icon button that cycles through light → dark → system.
 * Shows the current mode icon; clicking advances to the next mode.
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useTheme();
  const label = LABELS[theme] ?? 'System';

  return (
    <button
      type="button"
      onClick={() => setTheme(CYCLE[theme] ?? 'system')}
      title={`Theme: ${label} — click to change`}
      aria-label={`Current theme: ${label}. Click to toggle.`}
      className={`p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ${className}`}
    >
      {ICONS[theme] ?? <SystemIcon />}
    </button>
  );
}
