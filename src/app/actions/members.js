'use server';

import { revalidatePath } from 'next/cache';
import { getServerUser } from '@/lib/auth';
import { ProjectMemberService } from '@/lib/services/project-member.service';
import { ProjectInvitationService } from '@/lib/services/project-invitation.service';
import { AuthService } from '@/lib/services/auth.service';
import { hasPermission, canActOn, PROJECT_ROLES } from '@/lib/permissions';
import { sendProjectInvitationEmail } from '@/lib/email';
import prisma from '@/lib/prisma';

const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';
const REVALIDATE = (projectId) => revalidatePath(`/workspace/${projectId}/members`);

// ─── Invite ───────────────────────────────────────────────────────────────────

/**
 * Invite a new member to a project by email.
 * - Validates actor permissions.
 * - Rejects if the invitee is already an active member.
 * - Creates a ProjectInvitation and sends an email (fire-and-forget).
 *
 * @param {number} projectId
 * @param {FormData} formData  — fields: email (string), role (string)
 */
export async function inviteMemberAction(projectId, _prevState, formData) {
  const user = await getServerUser();
  if (!user) return { error: 'Unauthenticated' };

  // Permission check
  const actorRole = await ProjectMemberService.getUserRole(Number(projectId), user.id);
  if (!hasPermission(actorRole, 'INVITE_MEMBER')) {
    return { error: 'You do not have permission to invite members.' };
  }

  const email = formData.get('email')?.toString().trim().toLowerCase() ?? '';
  const role  = formData.get('role')?.toString() ?? 'MEMBER';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }
  if (!PROJECT_ROLES.includes(role) || role === 'OWNER') {
    return { error: 'Invalid role selected.' };
  }

  // Don't invite yourself
  if (email === user.email.toLowerCase()) {
    return { error: 'You cannot invite yourself.' };
  }

  // Check if email already belongs to an active project member
  const existingUser = await AuthService.findByEmail(email);
  if (existingUser) {
    const alreadyMember = await ProjectMemberService.isMember(Number(projectId), existingUser.id);
    if (alreadyMember) return { error: 'This person is already a member of this project.' };
  }

  // Create invitation
  let invitation;
  try {
    invitation = await ProjectInvitationService.create(
      Number(projectId), user.id, email, role
    );
  } catch (err) {
    console.error('inviteMemberAction:', err.message);
    return { error: 'Failed to create invitation. Please try again.' };
  }

  // Send email — fire-and-forget (failure should not block the UI)
  const roleName = role.charAt(0) + role.slice(1).toLowerCase();
  sendProjectInvitationEmail(email, {
    inviterName:  `${user.firstName} ${user.lastName}`,
    projectName:  invitation.project.name,
    projectColor: invitation.project.color,
    projectIcon:  invitation.project.icon,
    role:         roleName,
    acceptUrl:    `${APP_URL}/invite/${invitation.token}`,
    expiryDays:   7,
    userExists:   !!existingUser,
  }).catch(() => {});

  REVALIDATE(projectId);
  return { success: true, email };
}

// ─── Remove member ────────────────────────────────────────────────────────────

/**
 * Remove a member from a project.
 * The OWNER cannot be removed. Actors cannot remove members they can't act on.
 *
 * @param {number} projectId
 * @param {number} targetUserId
 */
export async function removeMemberAction(projectId, targetUserId) {
  const user = await getServerUser();
  if (!user) return { error: 'Unauthenticated' };

  const actorRole  = await ProjectMemberService.getUserRole(Number(projectId), user.id);
  if (!hasPermission(actorRole, 'REMOVE_MEMBER')) {
    return { error: 'You do not have permission to remove members.' };
  }

  const targetMembership = await ProjectMemberService.getMembership(Number(projectId), Number(targetUserId));
  if (!targetMembership) return { error: 'Member not found.' };

  if (!canActOn(actorRole, targetMembership.role)) {
    return { error: 'You cannot remove a member with a higher or equal role.' };
  }

  const removed = await ProjectMemberService.removeMember(Number(projectId), Number(targetUserId));
  if (!removed) return { error: 'Could not remove this member.' };

  REVALIDATE(projectId);
  return { success: true };
}

// ─── Change role ──────────────────────────────────────────────────────────────

/**
 * Change a member's role within a project.
 *
 * @param {number} projectId
 * @param {number} targetUserId
 * @param {string} newRole
 */
export async function changeMemberRoleAction(projectId, targetUserId, newRole) {
  const user = await getServerUser();
  if (!user) return { error: 'Unauthenticated' };

  if (!PROJECT_ROLES.includes(newRole) || newRole === 'OWNER') {
    return { error: 'Invalid role.' };
  }

  const actorRole = await ProjectMemberService.getUserRole(Number(projectId), user.id);
  if (!hasPermission(actorRole, 'MANAGE_ROLES')) {
    return { error: 'You do not have permission to change member roles.' };
  }

  const targetMembership = await ProjectMemberService.getMembership(Number(projectId), Number(targetUserId));
  if (!targetMembership) return { error: 'Member not found.' };

  if (!canActOn(actorRole, targetMembership.role)) {
    return { error: 'You cannot change the role of a member with a higher or equal role.' };
  }

  await ProjectMemberService.updateRole(Number(projectId), Number(targetUserId), newRole);

  REVALIDATE(projectId);
  return { success: true };
}

// ─── Cancel invitation ────────────────────────────────────────────────────────

/**
 * Cancel (expire) a pending invitation.
 *
 * @param {number} invitationId
 * @param {number} projectId
 */
export async function cancelInvitationAction(invitationId, projectId) {
  const user = await getServerUser();
  if (!user) return { error: 'Unauthenticated' };

  const actorRole = await ProjectMemberService.getUserRole(Number(projectId), user.id);
  if (!hasPermission(actorRole, 'INVITE_MEMBER')) {
    return { error: 'You do not have permission to cancel invitations.' };
  }

  await ProjectInvitationService.cancel(Number(invitationId));

  REVALIDATE(projectId);
  return { success: true };
}

// ─── Resend invitation ────────────────────────────────────────────────────────

/**
 * Resend an invitation — cancels the old token, creates a fresh one, re-sends email.
 *
 * @param {number} invitationId
 * @param {number} projectId
 */
export async function resendInvitationAction(invitationId, projectId) {
  const user = await getServerUser();
  if (!user) return { error: 'Unauthenticated' };

  const actorRole = await ProjectMemberService.getUserRole(Number(projectId), user.id);
  if (!hasPermission(actorRole, 'INVITE_MEMBER')) {
    return { error: 'You do not have permission to resend invitations.' };
  }

  // Fetch old invitation to re-use email + role
  const old = await prisma.projectInvitation.findUnique({
    where: { id: Number(invitationId) },
  });

  if (!old) return { error: 'Invitation not found.' };

  await ProjectInvitationService.cancel(Number(invitationId));

  const fresh = await ProjectInvitationService.create(
    Number(projectId), user.id, old.email, old.role
  );

  const existingUser = await AuthService.findByEmail(old.email);
  const roleName = old.role.charAt(0) + old.role.slice(1).toLowerCase();

  sendProjectInvitationEmail(old.email, {
    inviterName:  `${user.firstName} ${user.lastName}`,
    projectName:  fresh.project.name,
    projectColor: fresh.project.color,
    projectIcon:  fresh.project.icon,
    role:         roleName,
    acceptUrl:    `${APP_URL}/invite/${fresh.token}`,
    expiryDays:   7,
    userExists:   !!existingUser,
  }).catch(() => {});

  REVALIDATE(projectId);
  return { success: true };
}
