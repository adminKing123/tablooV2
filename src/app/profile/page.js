import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CheckCircleIcon, LockClosedIcon } from '@/assets/icons';

const USAGE_LABELS = { WORK: 'Work', PERSONAL: 'Personal', SCHOOL: 'School' };
const TEAM_LABELS  = { SOLO: 'Just me', '2-5': '2–5 people', '6-15': '6–15 people', '16-50': '16–50 people', '50+': '50+ people' };

/** Individual display row inside the account details card */
function ProfileField({ label, value }) {
  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100 sm:mt-0 sm:col-span-2">{value ?? '—'}</dd>
    </div>
  );
}

/**
 * ProfilePage — async Server Component.
 *
 * Reads the auth cookie on the server via getServerUser(). No fetch() call,
 * no useEffect, no client-side loading state. If the cookie is missing or
 * invalid the user is redirected immediately before any HTML is sent.
 */
export default async function ProfilePage() {
  const user = await getServerUser();
  if (!user) redirect('/login');
  if (!user.onboardingCompleted) redirect('/onboarding');

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your personal information and account details.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Avatar card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 break-all">{user.email}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400">
              <CheckCircleIcon className="w-3 h-3" />
              Verified
            </span>
          </div>

          {/* Details card */}
          <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Account information</h3>
            <dl className="divide-y divide-slate-100 dark:divide-slate-800">
              <ProfileField label="First name"    value={user.firstName} />
              <ProfileField label="Last name"     value={user.lastName} />
              <ProfileField label="Email address" value={user.email} />
              <ProfileField label="Role"          value={user.jobTitle} />
              <ProfileField label="Phone"         value={user.phone} />
              <ProfileField label="Using Tabloo for" value={USAGE_LABELS[user.usageType]} />
              <ProfileField label="Team size"     value={TEAM_LABELS[user.teamSize]} />
              <ProfileField label="Workspace"     value={user.workspaceName} />
              <ProfileField label="Member since"  value={memberSince} />
            </dl>
          </div>

        </div>

        {/* Protected content notice */}
        <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 bg-indigo-100 dark:bg-indigo-900/60 rounded-lg flex items-center justify-center">
              <LockClosedIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">Protected page</h4>
              <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
                This area is only accessible to authenticated, verified users.
                Build your SaaS features here.
              </p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
