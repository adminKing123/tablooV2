'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Spinner from '@/components/ui/Spinner';
import { SparklesIcon, CogIcon, UsersIcon, ChevronDownIcon, UserIcon, SignOutIcon } from '@/assets/icons';

// ─── Constants ────────────────────────────────────────────────────────────────

const VISIBILITY_LABELS = {
  PRIVATE: { label: 'Private', emoji: '🔒' },
  TEAM:    { label: 'Team',    emoji: '👥' },
};

// ─── Shell ────────────────────────────────────────────────────────────────────

/**
 * ProjectShell — full-height sidebar + top-bar shell for all project sub-pages.
 *
 * Used by [projectId]/layout.js to wrap every project route (overview, settings).
 * Sidebar nav uses <Link> so TopProgressBar fires naturally on every transition.
 */
export default function ProjectShell({ project, user, userRole, children }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [loggingOut, startLogout] = useTransition();

  const base = `/workspace/${project.id}`;

  const NAV_ITEMS = [
    { href: base,               label: 'Overview', Icon: SparklesIcon, active: pathname === base                        },
    { href: `${base}/members`,  label: 'Members',  Icon: UsersIcon,    active: pathname.startsWith(`${base}/members`)  },
    { href: `${base}/settings`, label: 'Settings', Icon: CogIcon,      active: pathname.startsWith(`${base}/settings`) },
  ];

  // Show section label in the breadcrumb only when not on overview
  const activeSection = NAV_ITEMS.find(n => n.active && n.href !== base);

  const handleLogout = () => {
    setMenuOpen(false);
    startLogout(async () => { await logoutAction(); });
  };

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();
  const vis      = VISIBILITY_LABELS[project.visibility] ?? VISIBILITY_LABELS.PRIVATE;

  return (
    <div className="flex flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-200">

        {/* Brand */}
        <div className="h-14 px-4 flex items-center border-b border-slate-100 dark:border-slate-800 shrink-0">
          <Link href="/workspace" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-linear-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">Tabloo</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, Icon, active }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition-colors ${
                active
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User menu */}
        <div className="px-2 py-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <div className="relative">
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <div className="w-7 h-7 bg-linear-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-semibold">{initials}</span>
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
              </div>
              <ChevronDownIcon className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown — opens upward */}
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute bottom-full left-0 right-0 mb-1.5 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                  <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      Profile
                    </Link>
                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loggingOut ? <Spinner className="w-4 h-4" /> : <SignOutIcon className="w-4 h-4" />}
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main panel ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm min-w-0">
            <Link
              href="/workspace"
              className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
            >
              Workspace
            </Link>
            <span className="text-slate-300 dark:text-slate-700 shrink-0">/</span>
            <Link
              href={base}
              className="flex items-center gap-1.5 min-w-0 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center text-sm leading-none shrink-0"
                style={{ background: project.color }}
              >
                {project.icon}
              </span>
              <span className="truncate max-w-32">{project.name}</span>
            </Link>
            {activeSection && (
              <>
                <span className="text-slate-300 dark:text-slate-700 shrink-0">/</span>
                <span className="font-medium text-slate-900 dark:text-white shrink-0">{activeSection.label}</span>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
