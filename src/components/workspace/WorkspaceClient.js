'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NewProjectModal from './NewProjectModal';
import { PlusIcon } from '@/assets/icons';

const VISIBILITY_LABELS = {
  PRIVATE: { label: 'Private', icon: '🔒' },
  TEAM:    { label: 'Team',    icon: '👥' },
};

/**
 * WorkspaceClient — interactive shell rendered inside the server WorkspacePage.
 * Owns the modal open/close state and receives projects + workspace name as props.
 */
export default function WorkspaceClient({ workspaceName, initialProjects }) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  // Close modal and refresh server data (revalidatePath fires, Next.js re-fetches)
  const handleClose = () => {
    setModalOpen(false);
    router.refresh();
  };

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{workspaceName}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {initialProjects.length === 0
              ? 'No projects yet — create one to get started.'
              : `${initialProjects.length} project${initialProjects.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* New Project button */}
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-sm shadow-indigo-500/30 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
        >
          <PlusIcon className="w-3.5 h-3.5" strokeWidth={2.2} />
          New Project
        </button>
      </div>

      {/* ── Empty state ─────────────────────────────────────────────── */}
      {initialProjects.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
          onClick={() => setModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setModalOpen(true)}
        >
          <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 group-hover:scale-105 transition-transform">
            <PlusIcon className="w-7 h-7" stroke="white" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Create your first project</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
            Projects help you organise tasks, track progress, and collaborate with your team.
          </p>
        </div>
      )}

      {/* ── Project grid ─────────────────────────────────────────────── */}
      {initialProjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {initialProjects.map(project => {
            const vis = VISIBILITY_LABELS[project.visibility] ?? VISIBILITY_LABELS.PRIVATE;
            const created = new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <Link
                key={project.id}
                href={`/workspace/${project.id}`}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-150"
              >
                {/* Card header */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm"
                    style={{ background: project.color }}
                  >
                    {project.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {vis.icon} {vis.label} · {created}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}

                {/* Status chip */}
                <div className="mt-auto pt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Active
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Add another project card */}
          <button
            onClick={() => setModalOpen(true)}
            className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-600 min-h-30 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all"
          >
            <PlusIcon className="w-6 h-6" />
            <span className="text-xs font-medium">New Project</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && <NewProjectModal onClose={handleClose} />}
    </div>
  );
}
