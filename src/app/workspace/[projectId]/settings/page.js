import { CogIcon } from '@/assets/icons';

export const metadata = { title: 'Settings' };

/**
 * ProjectSettingsPage — settings placeholder.
 * No options yet; fully fleshed out in a future iteration.
 */
export default function ProjectSettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-8">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your project preferences and configuration.
        </p>
      </div>

      {/* Empty state card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 flex flex-col items-center text-center shadow-sm">
        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
          <CogIcon className="w-7 h-7 text-slate-400 dark:text-slate-500" />
        </div>
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-1">
          No settings yet
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
          Project settings — rename, colour, visibility, danger zone — are coming soon.
        </p>
      </div>
    </div>
  );
}
