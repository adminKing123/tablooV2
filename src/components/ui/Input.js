'use client';

/**
 * Input — labelled text input with error and hint support.
 *
 * @param {string}  label    — visible label text
 * @param {string}  error    — inline error message (red)
 * @param {string}  hint     — helper text shown when no error
 * @param {string}  id       — ties label[for] to input[id]
 */
export default function Input({ label, error, hint, id, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          block w-full px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100
          bg-white dark:bg-slate-800/60
          border rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-500 disabled:cursor-not-allowed
          ${error
            ? 'border-red-400 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
