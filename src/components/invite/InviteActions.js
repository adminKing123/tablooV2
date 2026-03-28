'use client';

import { useTransition } from 'react';
import { acceptInvitationAction, declineInvitationAction } from '@/app/actions/invitation';
import Spinner from '@/components/ui/Spinner';

/**
 * InviteActions — client component that renders the Accept / Decline buttons.
 * Separated from the server page so we can handle loading states without
 * turning the entire invite page into a client component.
 */
export default function InviteActions({ token }) {
  const [accepting, startAccept]   = useTransition();
  const [declining, startDecline]  = useTransition();

  const pending = accepting || declining;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-5">
        Would you like to join this project?
      </p>
      <div className="flex flex-col gap-3">
        <button
          disabled={pending}
          onClick={() => startAccept(() => acceptInvitationAction(token))}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {accepting ? <Spinner className="w-4 h-4" /> : null}
          {accepting ? 'Joining…' : 'Accept Invitation'}
        </button>
        <button
          disabled={pending}
          onClick={() => startDecline(() => declineInvitationAction(token))}
          className="w-full flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {declining ? <Spinner className="w-4 h-4" /> : null}
          {declining ? 'Declining…' : 'Decline'}
        </button>
      </div>
    </div>
  );
}
