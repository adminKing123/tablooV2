import {
  XCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@/assets/icons';

/**
 * Alert — inline feedback banner.
 *
 * @param {'error'|'success'|'warning'|'info'} type
 * @param {string} message — renders null when empty/undefined
 */

const CONFIG = {
  error: {
    wrapper: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-300',
    icon: <XCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />,
  },
  success: {
    wrapper: 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-300',
    icon: <CheckCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />,
  },
  warning: {
    wrapper: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300',
    icon: <ExclamationTriangleIcon className="w-4 h-4 shrink-0 mt-0.5" />,
  },
  info: {
    wrapper: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-300',
    icon: <InformationCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />,
  },
};

export default function Alert({ type = 'error', message, className = '' }) {
  if (!message) return null;
  const { wrapper, icon } = CONFIG[type] ?? CONFIG.error;
  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 p-3.5 rounded-lg border text-sm ${wrapper} ${className}`}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
}
