'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Spinner from '@/components/ui/Spinner';
import {
  SparklesIcon,
  ClipboardListIcon,
  ViewColumnsIcon,
  UsersIcon,
  CogIcon,
  ChevronDownIcon,
  UserIcon,
  SignOutIcon,
} from '@/assets/icons';

// ─── Constants ────────────────────────────────────────────────────────────────

const VISIBILITY_LABELS = {
  PRIVATE: { label: 'Private', emoji: '🔒' },
  TEAM:    { label: 'Team',    emoji: '👥' },
  PUBLIC:  { label: 'Public',  emoji: '🌐' },
};

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', Icon: SparklesIcon      },
  { key: 'tasks',    label: 'Tasks',    Icon: ClipboardListIcon  },
  { key: 'board',    label: 'Board',    Icon: ViewColumnsIcon    },
  { key: 'members',  label: 'Members',  Icon: UsersIcon          },
  { key: 'settings', label: 'Settings', Icon: CogIcon            },
];

// ─── Quick-start cards for the overview pane ──────────────────────────────────

const QUICKSTART = [
  {
    key:         'tasks',
    Icon:        ClipboardListIcon,
    iconClass:   'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
    title:       'Add your first task',
    description: 'Break your project into actionable steps.',
  },
  {
    key:         'members',
    Icon:        UsersIcon,
    iconClass:   'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400',
    title:       'Invite team members',
    description: 'Collaborate with others on this project.',
  },
  {
    key:         'board',
    Icon:        ViewColumnsIcon,
    iconClass:   'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400',
    title:       'Set up your board',
    description: 'Visualise task progress in a Kanban view.',
  },
];

// ─── Section meta for the "coming soon" placeholder ──────────────────────────

const SECTION_META = {
  tasks:    { Icon: ClipboardListIcon, label: 'Tasks',    description: 'Create and track tasks for your project.' },
  board:    { Icon: ViewColumnsIcon,   label: 'Board',    description: 'Visualise task progress in a Kanban view.' },
  members:  { Icon: UsersIcon,         label: 'Members',  description: 'Invite team members to collaborate.' },
  settings: { Icon: CogIcon,           label: 'Settings', description: 'Configure project settings and preferences.' },
};

// ─── Root shell ───────────────────────────────────────────────────────────────

/**
 * ProjectShell — full-page sidebar layout for a single project.
 *
 * Replaces DashboardLayout entirely: it owns the sidebar navigation,
 * top breadcrumb bar, user dropdown, and the scrollable content pane.
 */
export default function ProjectShell({ project, user }) {
  const [section, setSection]     = useState('overview');
  const [menuOpen, setMenuOpen]   = useState(false);
  const [loggingOut, startLogout] = useTransition();

  const handleLogout = () => {
    setMenuOpen(false);
    startLogout(async () => { await logoutAction(); });
  };

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();
  const vis = VISIBILITY_LABELS[project.visibility] ?? VISIBILITY_LABELS.PRIVATE;
  const created = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="flex flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-200 overflow-hidden">

        {/* Brand bar */}
        <div className="h-14 px-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <Link href="/workspace" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-linear-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">Tabloo</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ key, label, Icon }) => {
            const active = section === key;
            return (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition-colors text-left ${
                  active
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* User menu at bottom */}
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
        <header className="h-14 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 transition-colors duration-200">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm min-w-0">
            <Link
              href="/workspace"
              className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
            >
              Workspace
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white min-w-0">
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center text-sm leading-none shrink-0"
                style={{ background: project.color }}
              >
                {project.icon}
              </span>
              <span className="truncate">{project.name}</span>
            </span>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
          </div>
        </header>

        {/* Scrollable content pane */}
        <main className="flex-1 overflow-y-auto">
          {section === 'overview'
            ? <OverviewSection project={project} vis={vis} created={created} onNavigate={setSection} />
            : <ComingSoonSection section={section} />
          }
        </main>
      </div>
    </div>
  );
}

// ─── Overview content ─────────────────────────────────────────────────────────

function OverviewSection({ project, vis, created, onNavigate }) {
  const stats = [
    { label: 'Open Tasks',  value: '0',  note: 'No tasks yet',      valueClass: 'text-indigo-600 dark:text-indigo-400'  },
    { label: 'Members',     value: '1',  note: 'Just you for now',  valueClass: 'text-violet-600 dark:text-violet-400'  },
    { label: 'Completion',  value: '0%', note: 'Get started!',      valueClass: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">

      {/* Project hero card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 shadow-sm">
        <div className="flex items-start gap-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-md"
            style={{ background: project.color }}
          >
            {project.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {vis.emoji} {vis.label}
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${project.description ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500 italic'}`}>
              {project.description || 'No description yet.'}
            </p>
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Created {created}</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, note, valueClass }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <p className={`text-3xl font-bold ${valueClass}`}>{value}</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-1">{label}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{note}</p>
          </div>
        ))}
      </div>

      {/* Getting started */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
          Getting Started
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {QUICKSTART.map(({ key, Icon, iconClass, title, description }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-left shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
          Recent Activity
        </h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
          <p className="text-sm text-slate-400 dark:text-slate-500">No activity yet.</p>
          <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">
            Project events will appear here once you start working.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Coming soon placeholder ──────────────────────────────────────────────────

function ComingSoonSection({ section }) {
  const { Icon, label, description } = SECTION_META[section] ?? SECTION_META.tasks;

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-100 px-8 text-center">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{label}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-4">{description}</p>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
        Coming soon
      </span>
    </div>
  );
}
