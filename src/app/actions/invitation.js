'use server';

import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import { ProjectInvitationService } from '@/lib/services/project-invitation.service';
import { ProjectMemberService } from '@/lib/services/project-member.service';

// ─── Accept ───────────────────────────────────────────────────────────────────

/**
 * Accept a project invitation.
 *
 * Validates:
 *   - User is authenticated
 *   - Token is valid and not expired
 *   - Logged-in user's email matches the invitation email
 *   - User is not already a member
 *
 * On success: creates ProjectMember, marks invitation ACCEPTED,
 *             redirects to the project overview page.
 *
 * Called as a Server Action from the /invite/[token] page.
 *
 * @param {string} token
 */
export async function acceptInvitationAction(token) {
  const user = await getServerUser();
  if (!user) redirect(`/login`);

  const inv = await ProjectInvitationService.validate(token);

  // inv is either the invitation object or an error string
  if (typeof inv === 'string') {
    // Redirect back to invite page — it will show the appropriate error state
    redirect(`/invite/${token}`);
  }

  // Email must match
  if (inv.email !== user.email.toLowerCase()) {
    redirect(`/invite/${token}?error=email_mismatch`);
  }

  // Idempotency — already a member
  const alreadyMember = await ProjectMemberService.isMember(inv.projectId, user.id);
  if (!alreadyMember) {
    await ProjectMemberService.addMember(inv.projectId, user.id, inv.role);
  }

  await ProjectInvitationService.accept(token);

  redirect(`/workspace/${inv.projectId}`);
}

// ─── Decline ──────────────────────────────────────────────────────────────────

/**
 * Decline a project invitation.
 * Marks the invitation as DECLINED and redirects to the workspace.
 *
 * @param {string} token
 */
export async function declineInvitationAction(token) {
  const user = await getServerUser();
  if (!user) redirect(`/login`);

  const inv = await ProjectInvitationService.validate(token);

  if (typeof inv !== 'string') {
    // Only decline if email matches — silent no-op otherwise
    if (inv.email === user.email.toLowerCase()) {
      await ProjectInvitationService.decline(token);
    }
  }

  redirect('/workspace');
}
