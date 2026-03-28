import prisma from '@/lib/prisma';

/**
 * ProjectMemberService — CRUD for project memberships.
 *
 * Ownership note: the project creator is recorded as OWNER in ProjectMember when
 * the project is created (see ProjectService.create).  For legacy projects that
 * pre-date this model, getUserRole() falls back to checking project.userId so
 * existing data keeps working without a migration.
 */
export const ProjectMemberService = {

  /**
   * All members of a project with their user details, ordered by join date.
   * @param {number} projectId
   */
  async getByProjectId(projectId) {
    return prisma.projectMember.findMany({
      where:   { projectId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { joinedAt: 'asc' },
    });
  },

  /**
   * Single membership record for a user within a project (or null).
   * @param {number} projectId
   * @param {number} userId
   */
  async getMembership(projectId, userId) {
    return prisma.projectMember.findFirst({
      where:   { projectId, userId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  },

  /**
   * Returns the role string for a user within a project, or null if they have
   * no access.  Falls back to 'OWNER' for legacy projects where no ProjectMember
   * record exists yet.
   *
   * @param {number} projectId
   * @param {number} userId
   * @returns {Promise<string|null>}
   */
  async getUserRole(projectId, userId) {
    const member = await prisma.projectMember.findFirst({
      where:  { projectId, userId },
      select: { role: true },
    });
    if (member) return member.role;

    // Legacy fallback — project was created before ProjectMember model existed
    const project = await prisma.project.findFirst({
      where:  { id: projectId, userId },
      select: { id: true },
    });
    return project ? 'OWNER' : null;
  },

  /**
   * Add (or upsert) a user to a project with the given role.
   * Safe to call multiple times — updates role if membership already exists.
   *
   * @param {number} projectId
   * @param {number} userId
   * @param {string} [role='MEMBER']
   */
  async addMember(projectId, userId, role = 'MEMBER') {
    return prisma.projectMember.upsert({
      where:  { projectId_userId: { projectId, userId } },
      update: { role },
      create: { projectId, userId, role },
    });
  },

  /**
   * Change an existing member's role.
   * The caller is responsible for permission + canActOn checks.
   *
   * @param {number} projectId
   * @param {number} userId
   * @param {string} newRole
   */
  async updateRole(projectId, userId, newRole) {
    return prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId } },
      data:  { role: newRole },
    });
  },

  /**
   * Remove a member from a project.
   * Returns false (without throwing) if the user is the OWNER or not a member.
   *
   * @param {number} projectId
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  async removeMember(projectId, userId) {
    const member = await prisma.projectMember.findFirst({
      where:  { projectId, userId },
      select: { role: true },
    });
    if (!member || member.role === 'OWNER') return false;

    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId } },
    });
    return true;
  },

  /**
   * Returns true if the user is an active member (or owner) of the project.
   *
   * @param {number} projectId
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  async isMember(projectId, userId) {
    const role = await this.getUserRole(projectId, userId);
    return role !== null;
  },
};
