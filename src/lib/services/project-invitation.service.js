import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';

const INVITE_EXPIRY_DAYS = 7;

/** Secure URL-safe random token. */
function generateToken() {
  return randomBytes(32).toString('hex');
}

/**
 * ProjectInvitationService — manages email-based project invitations.
 *
 * Status lifecycle:
 *   PENDING → ACCEPTED  (invitee accepts)
 *   PENDING → DECLINED  (invitee declines)
 *   PENDING → EXPIRED   (past expiresAt, or manually cancelled, or superseded by resend)
 */
export const ProjectInvitationService = {

  /**
   * Create a new invitation (or replace an existing PENDING one for the same email).
   * Returns the created record with project + inviter details.
   *
   * @param {number} projectId
   * @param {number} invitedBy  — user id of the person sending the invite
   * @param {string} email
   * @param {string} [role='MEMBER']
   */
  async create(projectId, invitedBy, email, role = 'MEMBER') {
    const normalised = email.toLowerCase().trim();
    const expiresAt  = new Date(Date.now() + INVITE_EXPIRY_DAYS * 86_400_000);

    // Expire any existing pending invitation for this email in this project
    await prisma.projectInvitation.updateMany({
      where: { projectId, email: normalised, status: 'PENDING' },
      data:  { status: 'EXPIRED' },
    });

    return prisma.projectInvitation.create({
      data: {
        projectId,
        invitedBy,
        email: normalised,
        role,
        token: generateToken(),
        expiresAt,
      },
      include: {
        project: { select: { id: true, name: true, color: true, icon: true } },
        inviter: { select: { firstName: true, lastName: true } },
      },
    });
  },

  /**
   * All PENDING invitations for a project, newest first.
   *
   * @param {number} projectId
   */
  async getByProjectId(projectId) {
    return prisma.projectInvitation.findMany({
      where:   { projectId, status: 'PENDING' },
      include: { inviter: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Look up an invitation by token, including project + inviter details.
   * Returns null if the token doesn't exist.
   *
   * @param {string} token
   */
  async getByToken(token) {
    return prisma.projectInvitation.findUnique({
      where:   { token },
      include: {
        project: { select: { id: true, name: true, color: true, icon: true } },
        inviter: { select: { firstName: true, lastName: true } },
      },
    });
  },

  /**
   * Validates a token and returns either the invitation object or an error key:
   *   'NOT_FOUND'  — no such token
   *   'ACCEPTED'   — already accepted
   *   'DECLINED'   — already declined
   *   'EXPIRED'    — expired (also marks DB record as EXPIRED)
   *
   * @param {string} token
   * @returns {Promise<object|string>}
   */
  async validate(token) {
    const inv = await this.getByToken(token);
    if (!inv) return 'NOT_FOUND';
    if (inv.status !== 'PENDING') return inv.status;
    if (new Date() > inv.expiresAt) {
      await prisma.projectInvitation.update({ where: { token }, data: { status: 'EXPIRED' } });
      return 'EXPIRED';
    }
    return inv;
  },

  /**
   * Mark an invitation as ACCEPTED.
   * @param {string} token
   */
  async accept(token) {
    return prisma.projectInvitation.update({ where: { token }, data: { status: 'ACCEPTED' } });
  },

  /**
   * Mark an invitation as DECLINED.
   * @param {string} token
   */
  async decline(token) {
    return prisma.projectInvitation.update({ where: { token }, data: { status: 'DECLINED' } });
  },

  /**
   * Cancel (expire) a pending invitation by its id.
   * @param {number} id
   */
  async cancel(id) {
    return prisma.projectInvitation.update({ where: { id }, data: { status: 'EXPIRED' } });
  },

  /**
   * Days remaining until invitation expires (minimum 0).
   * @param {Date} expiresAt
   * @returns {number}
   */
  daysRemaining(expiresAt) {
    const ms = new Date(expiresAt) - Date.now();
    return Math.max(0, Math.ceil(ms / 86_400_000));
  },
};
