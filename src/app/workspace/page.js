import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BoltIcon } from '@/assets/icons';

/**
 * WorkspacePage — landing page after onboarding.
 * Placeholder for project creation and workspace management features.
 */
export default async function WorkspacePage() {
  const user = await getServerUser();
  if (!user) redirect('/login');
  if (!user.onboardingCompleted) redirect('/onboarding');

  const workspaceName = user.workspaceName || `${user.firstName}'s Workspace`;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{workspaceName}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your workspace — projects will live here.
            </p>
          </div>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center
                        bg-white dark:bg-slate-900 border border-dashed border-slate-300
                        dark:border-slate-700 rounded-2xl">

          {/* Animated icon */}
          <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-violet-600 rounded-2xl
                          flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-5">
            <BoltIcon className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No projects yet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
            This is your workspace. Projects, tasks, and team collaboration will all start here.
            Create your first project to get going.
          </p>

          {/* Placeholder CTA — functionality coming soon */}
          <button
            disabled
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-indigo-600 text-white text-sm font-semibold
                       opacity-40 cursor-not-allowed select-none"
          >
            + New Project
            <span className="text-xs font-normal opacity-75">(coming soon)</span>
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}
