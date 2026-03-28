'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { SunIcon, MoonIcon, MonitorIcon } from '@/assets/icons';

/** Cycles: light → dark → system → light */
const CYCLE = { light: 'dark', dark: 'system', system: 'light' };
const LABELS = { light: 'Light', dark: 'Dark', system: 'System' };

const ICONS = {
  light:  <SunIcon  className="w-4 h-4" />,
  dark:   <MoonIcon className="w-4 h-4" />,
  system: <MonitorIcon className="w-4 h-4" />,
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
      {ICONS[theme] ?? <MonitorIcon className="w-4 h-4" />}
    </button>
  );
}
