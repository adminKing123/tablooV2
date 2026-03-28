import { redirect, notFound } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import { ProjectService } from '@/lib/services/project.service';

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { projectId } = await params;
  const user    = await getServerUser();
  if (!user) return {};
  const project = await ProjectService.getById(Number(projectId), user.id);
  return { title: project?.name ?? 'Project' };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VISIBILITY_LABELS = {
  PRIVATE: { label: 'Private', emoji: '🔒' },
  TEAM:    { label: 'Team',    emoji: '👥' },
};

// ─── Page ────────────────────────────────────────────────────────────────────

/**
 * ProjectOverviewPage — server component rendered in the ProjectShell main pane.
 * Layout.js already validated ownership; this page re-fetches for its own content.
 */
export default async function ProjectOverviewPage({ params }) {
  const { projectId } = await params;

  const user    = await getServerUser();
  if (!user) redirect('/login');

  const project = await ProjectService.getById(Number(projectId), user.id);
  if (!project) notFound();

  const vis     = VISIBILITY_LABELS[project.visibility] ?? VISIBILITY_LABELS.PRIVATE;
  const created = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">

      {/* ── Hero card ── */}
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

      {/* ── Recent activity ── */}
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
