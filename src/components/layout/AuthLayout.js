import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';

/**
 * AuthLayout — centered card wrapper for all auth pages (login, signup, verify-otp).
 * Server Component — ThemeToggle is a Client Component rendered as a leaf node.
 *
 * @param {React.ReactNode} children  — form content
 * @param {string}          title     — page heading
 * @param {string}          subtitle  — sub-heading
 * @param {React.ReactNode} footer    — link row below the card
 */
export default function AuthLayout({ children, title, subtitle, footer }) {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 py-12 transition-colors duration-200">

      {/* Theme toggle — fixed to top-right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Brand */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Tabloo</span>
        </Link>

        {title && (
          <div className="mt-7">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
            {subtitle && (
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
        {children}
      </div>

      {/* Footer row */}
      {footer && (
        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center">{footer}</div>
      )}
    </div>
  );
}
