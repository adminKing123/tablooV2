'use client';

import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

/** Individual field row inside the profile details card */
function ProfileField({ label, value }) {
  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">{value ?? '—'}</dd>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Your personal information and account details.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Avatar card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5 break-all">{user?.email}</p>
            {/* Verified badge */}
            <span className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          </div>

          {/* Details card */}
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-2">Account information</h3>
            <dl className="divide-y divide-slate-100">
              <ProfileField label="First name"    value={user?.firstName} />
              <ProfileField label="Last name"     value={user?.lastName} />
              <ProfileField label="Email address" value={user?.email} />
              <ProfileField label="Member since"  value={memberSince} />
            </dl>
          </div>

        </div>

        {/* Protected content notice */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-indigo-900">Protected page</h4>
              <p className="mt-1 text-sm text-indigo-700">
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
