'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';
import Spinner from '@/components/ui/Spinner';
import ThemeToggle from '@/components/ui/ThemeToggle';

/**
 * DashboardLayout — top-nav shell for all protected pages.
 *
 * Receives the already-fetched `user` object from the parent Server Component
 * (e.g. ProfilePage). No client-side auth context needed.
 *
 * Logout calls the logoutAction Server Action directly — no fetch(), no router.
 */
export default function DashboardLayout({ user, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, startLogout] = useTransition();

  const handleLogout = () => {
    setMenuOpen(false);
    startLogout(async () => {
      await logoutAction();
    });
  };

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

      {/* ── Top navigation bar ── */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/profile" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white hidden sm:block">Tabloo</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 flex-1 ml-4">
            <Link
              href="/profile"
              className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          {/* Right side: theme toggle + user avatar */}
          <div className="flex items-center gap-1 shrink-0">

            <ThemeToggle />

            {/* User avatar / dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                {/* Avatar */}
                <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">{initials}</span>
                </div>
                {/* Name */}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">
                  {user?.firstName} {user?.lastName}
                </span>
                {/* Chevron */}
                <svg className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-40">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                    </div>
                    {/* Actions */}
                    <div className="p-1">
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>

                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {loggingOut
                          ? <Spinner className="w-4 h-4" />
                          : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          )
                        }
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
