import Link from 'next/link';
import { getServerUser } from '@/lib/auth';
import { ProjectInvitationService } from '@/lib/services/project-invitation.service';
import { AuthService } from '@/lib/services/auth.service';
import InviteActions from '@/components/invite/InviteActions';

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function InviteShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">Tabloo</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProjectCard({ project, inviterName, role, expiryDays }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Coloured top strip */}
      <div className="h-1.5 w-full" style={{ background: project.color }} />
      <div className="p-7">
        {/* Project icon + name */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-md"
            style={{ background: project.color }}
          >
            {project.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{project.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Invited by <strong className="text-slate-700 dark:text-slate-200">{inviterName}</strong> as{' '}
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
              </span>
            </p>
          </div>
        </div>

        {expiryDays > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-5">
            This invitation expires in{' '}
            <span className="font-medium">{expiryDays} day{expiryDays !== 1 ? 's' : ''}</span>
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function InvitePage({ params, searchParams }) {
  const { token }    = await params;
  const { error }    = await searchParams ?? {};
  const user         = await getServerUser();

  // Validate the token
  const inv = await ProjectInvitationService.validate(token);

  // ── Invalid / used / expired ──────────────────────────────────────────────
  if (typeof inv === 'string') {
    const MESSAGES = {
      NOT_FOUND: { title: 'Invitation not found',     body: 'This invitation link is invalid or has been removed.' },
      ACCEPTED:  { title: 'Already accepted',         body: 'This invitation has already been accepted.'           },
      DECLINED:  { title: 'Invitation declined',      body: 'This invitation was declined.'                        },
      EXPIRED:   { title: 'Invitation expired',       body: 'This invitation link has expired. Ask the project owner to send a new one.' },
    };
    const msg = MESSAGES[inv] ?? MESSAGES.NOT_FOUND;

    return (
      <InviteShell>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
            ⚠️
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{msg.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{msg.body}</p>
          <Link
            href="/workspace"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            Go to Workspace
          </Link>
        </div>
      </InviteShell>
    );
  }

  const inviterName = `${inv.inviter.firstName} ${inv.inviter.lastName}`;
  const expiryDays  = ProjectInvitationService.daysRemaining(inv.expiresAt);

  // ── Logged in ─────────────────────────────────────────────────────────────
  if (user) {
    // Wrong account
    if (user.email.toLowerCase() !== inv.email) {
      return (
        <InviteShell>
          <ProjectCard project={inv.project} inviterName={inviterName} role={inv.role} expiryDays={expiryDays} />
          <div className="mt-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-6 text-center">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Wrong account</p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
              This invitation was sent to <strong>{inv.email}</strong>, but you&apos;re signed in as{' '}
              <strong>{user.email}</strong>.
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              Sign in with the correct account and come back to this link.
            </p>
          </div>
        </InviteShell>
      );
    }

    // Email matches — show accept/decline
    return (
      <InviteShell>
        <div className="mb-4">
          <ProjectCard project={inv.project} inviterName={inviterName} role={inv.role} expiryDays={expiryDays} />
        </div>
        {error === 'email_mismatch' && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center mb-3">
            There was an account mismatch. Please sign in with {inv.email}.
          </p>
        )}
        <InviteActions token={token} inviteEmail={inv.email} />
      </InviteShell>
    );
  }

  // ── Not logged in ─────────────────────────────────────────────────────────
  // Check whether the invited email has an account
  const inviteeExists = !!(await AuthService.findByEmail(inv.email));

  return (
    <InviteShell>
      <div className="mb-4">
        <ProjectCard project={inv.project} inviterName={inviterName} role={inv.role} expiryDays={expiryDays} />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-5">
          {inviteeExists
            ? 'Sign in to accept this invitation.'
            : `No account yet? Create one with ${inv.email} to accept this invitation.`}
        </p>

        <div className="flex flex-col gap-3">
          {inviteeExists ? (
            <Link
              href={`/login?invite=${token}`}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
            >
              Sign in to accept
            </Link>
          ) : (
            <Link
              href={`/signup?email=${encodeURIComponent(inv.email)}&invite=${token}`}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
            >
              Create account to accept
            </Link>
          )}
          <Link
            href="/workspace"
            className="w-full flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors"
          >
            Maybe later
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 text-center">
          The invitation link will remain valid for {expiryDays} more day{expiryDays !== 1 ? 's' : ''}.
          Bookmark it and come back after signing in.
        </p>
      </div>
    </InviteShell>
  );
}
