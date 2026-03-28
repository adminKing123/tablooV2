'use client';

import { useState, useTransition, useActionState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  inviteMemberAction,
  removeMemberAction,
  changeMemberRoleAction,
  cancelInvitationAction,
  resendInvitationAction,
} from '@/app/actions/members';
import {
  hasPermission,
  canActOn,
  assignableRoles,
  ROLE_LABELS,
} from '@/lib/permissions';
import { PlusIcon, TrashIcon, PaperAirplaneIcon, ClockIcon, XMarkIcon } from '@/assets/icons';
import Spinner from '@/components/ui/Spinner';

// ─── Role badge ───────────────────────────────────────────────────────────────

const BADGE_STYLES = {
  OWNER:  'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50',
  ADMIN:  'bg-blue-50   dark:bg-blue-950/50   text-blue-700   dark:text-blue-300   border-blue-200   dark:border-blue-900/50',
  MEMBER: 'bg-green-50  dark:bg-green-950/50  text-green-700  dark:text-green-300  border-green-200  dark:border-green-900/50',
  VIEWER: 'bg-slate-50  dark:bg-slate-800      text-slate-600  dark:text-slate-300  border-slate-200  dark:border-slate-700',
};

function RoleBadge({ role }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${BADGE_STYLES[role] ?? BADGE_STYLES.VIEWER}`}>
      {ROLE_LABELS[role]?.label ?? role}
    </span>
  );
}

// ─── User avatar ──────────────────────────────────────────────────────────────

function Avatar({ firstName, lastName, size = 'md' }) {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
  return (
    <div className={`${sz} bg-linear-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center shrink-0`}>
      <span className="text-white font-semibold">{initials}</span>
    </div>
  );
}

// ─── Invite form ──────────────────────────────────────────────────────────────

const INVITE_ROLES = ['ADMIN', 'MEMBER', 'VIEWER'];

function InviteForm({ projectId }) {
  const [open, setOpen] = useState(false);
  const router          = useRouter();

  // Memoize bound action so it isn't recreated on every render
  const boundAction = useMemo(() => inviteMemberAction.bind(null, projectId), [projectId]);
  const [state, formAction, pending] = useActionState(boundAction, null);

  // React to success in an effect — never call router.refresh() during render
  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state?.success]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
      >
        <PlusIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
        Invite Member
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Invite a new member</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      <form action={formAction} className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="email"
          name="email"
          required
          placeholder="colleague@company.com"
          className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        <select
          name="role"
          defaultValue="MEMBER"
          className="px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        >
          {INVITE_ROLES.map(r => (
            <option key={r} value={r}>{ROLE_LABELS[r]?.label}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {pending ? <Spinner className="w-4 h-4" /> : <PaperAirplaneIcon className="w-4 h-4" />}
          {pending ? 'Sending…' : 'Send'}
        </button>
      </form>

      {state?.error && (
        <p className="mt-2.5 text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}
    </div>
  );
}

// ─── Member row ───────────────────────────────────────────────────────────────

function MemberRow({ member, userRole, currentUserId, projectId }) {
  const [removing, startRemove]       = useTransition();
  const [changingRole, startRoleChange] = useTransition();
  const [localRole, setLocalRole]     = useState(member.role);
  const router = useRouter();

  const isCurrentUser = member.user.id === currentUserId;
  const canRemove     = hasPermission(userRole, 'REMOVE_MEMBER') && canActOn(userRole, member.role) && !isCurrentUser;
  const canChangeRole = hasPermission(userRole, 'MANAGE_ROLES') && canActOn(userRole, member.role);
  const allowedRoles  = assignableRoles(userRole);

  const handleRemove = () => {
    startRemove(async () => {
      await removeMemberAction(projectId, member.user.id);
      router.refresh();
    });
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setLocalRole(newRole);
    startRoleChange(async () => {
      await changeMemberRoleAction(projectId, member.user.id, newRole);
      router.refresh();
    });
  };

  return (
    <li className="flex items-center gap-3 py-3 px-1">
      <Avatar firstName={member.user.firstName} lastName={member.user.lastName} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
          {member.user.firstName} {member.user.lastName}
          {isCurrentUser && (
            <span className="ml-1.5 text-xs text-slate-400 dark:text-slate-500 font-normal">(you)</span>
          )}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{member.user.email}</p>
      </div>

      {/* Role selector or badge */}
      {canChangeRole && allowedRoles.length > 0 ? (
        <div className="relative">
          {changingRole ? (
            <Spinner className="w-4 h-4 text-slate-400" />
          ) : (
            <select
              value={localRole}
              onChange={handleRoleChange}
              className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {/* Current role (may not be in allowed list) */}
              {!allowedRoles.includes(localRole) && (
                <option value={localRole} disabled>{ROLE_LABELS[localRole]?.label}</option>
              )}
              {allowedRoles.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]?.label}</option>
              ))}
            </select>
          )}
        </div>
      ) : (
        <RoleBadge role={member.role} />
      )}

      {/* Remove button */}
      {canRemove && (
        <button
          onClick={handleRemove}
          disabled={removing}
          title="Remove member"
          className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-50"
        >
          {removing ? <Spinner className="w-4 h-4" /> : <TrashIcon className="w-4 h-4" />}
        </button>
      )}
    </li>
  );
}

// ─── Invitation row ───────────────────────────────────────────────────────────

function InvitationRow({ invitation, userRole, projectId }) {
  const [cancelling, startCancel]   = useTransition();
  const [resending,  startResend]   = useTransition();
  const router = useRouter();
  const canManage = hasPermission(userRole, 'INVITE_MEMBER');

  const days = Math.max(
    0,
    Math.ceil((new Date(invitation.expiresAt) - Date.now()) / 86_400_000)
  );

  return (
    <li className="flex items-center gap-3 py-3 px-1">
      <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
        <span className="text-slate-400 dark:text-slate-500 text-sm">✉</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{invitation.email}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Invited by {invitation.inviter.firstName} · {days}d left
        </p>
      </div>

      <RoleBadge role={invitation.role} />

      {canManage && (
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => startResend(async () => { await resendInvitationAction(invitation.id, projectId); router.refresh(); })}
            disabled={resending || cancelling}
            title="Resend invitation"
            className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors disabled:opacity-50"
          >
            {resending ? <Spinner className="w-3.5 h-3.5" /> : <PaperAirplaneIcon className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => startCancel(async () => { await cancelInvitationAction(invitation.id, projectId); router.refresh(); })}
            disabled={cancelling || resending}
            title="Cancel invitation"
            className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-50"
          >
            {cancelling ? <Spinner className="w-3.5 h-3.5" /> : <XMarkIcon className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </li>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

/**
 * MembersClient — interactive members management page.
 *
 * Props are serialised (dates as ISO strings) from the server page.
 * All mutations call server actions then router.refresh() to pick up
 * the updated data from the server.
 *
 * Permission checks run on both client (UI hiding) and server (action guards).
 */
export default function MembersClient({
  projectId,
  userRole,
  currentUserId,
  members,
  invitations,
}) {
  const canInvite = hasPermission(userRole, 'INVITE_MEMBER');

  return (
    <div className="max-w-3xl mx-auto px-8 py-8 space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Members</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {members.length} member{members.length !== 1 ? 's' : ''}
            {invitations.length > 0 && ` · ${invitations.length} pending invitation${invitations.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {canInvite && <InviteForm projectId={projectId} />}
      </div>

      {/* Invite form panel (shown inline below header on invitation CTA) */}
      {/* (InviteForm manages its own open/closed state above) */}

      {/* Members list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Active Members
          </h2>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 px-4">
          {members.map((member, i) => (
            <MemberRow
              key={member.id ?? `legacy-${i}`}
              member={member}
              userRole={userRole}
              currentUserId={currentUserId}
              projectId={projectId}
            />
          ))}
        </ul>
      </div>

      {/* Pending invitations */}
      {invitations.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <ClockIcon className="w-3.5 h-3.5 text-amber-500" />
            <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Pending Invitations
            </h2>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800 px-4">
            {invitations.map(inv => (
              <InvitationRow
                key={inv.id}
                invitation={inv}
                userRole={userRole}
                projectId={projectId}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Role reference card */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
          Role Permissions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Object.entries(ROLE_LABELS).map(([role, { label, description }]) => (
            <div key={role} className="flex items-start gap-2.5">
              <RoleBadge role={role} />
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
