import prisma from '@/lib/prisma';

/**
 * ProjectService — all project business logic.
 */
export const ProjectService = {

  /** Fetch all projects owned by a user (legacy — owner-only). */
  async getByUserId(userId) {
    return prisma.project.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Fetch all projects the user can access — owned or member-of.
   * Each project is annotated with `userRole` so the UI can differentiate
   * owned projects from invited ones.
   * Also includes legacy projects (owned but without a ProjectMember row).
   */
  async getAccessibleByUserId(userId) {
    // Fetch all ProjectMember rows for this user, including the project data
    const memberships = await prisma.projectMember.findMany({
      where:   { userId },
      include: { project: true },
    });

    const memberProjectIds = new Set(memberships.map((m) => m.projectId));

    // Legacy owned projects that pre-date the ProjectMember model
    const legacyOwned = await prisma.project.findMany({
      where: {
        userId,
        ...(memberProjectIds.size > 0 && { id: { notIn: [...memberProjectIds] } }),
      },
    });

    const projects = [
      ...memberships.map((m) => ({ ...m.project, userRole: m.role })),
      ...legacyOwned.map((p)  => ({ ...p,          userRole: 'OWNER'  })),
    ];

    return projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * Fetch a project the user owns.
   * Use this when ownership (not just membership) is required.
   */
  async getById(id, userId) {
    return prisma.project.findFirst({ where: { id, userId } });
  },

  /**
   * Fetch a project by id for any active member (owner or invited member).
   * Layout.js and page-level guards should use this to allow non-owners access.
   * Falls back to ownership check for legacy projects without ProjectMember records.
   */
  async getByIdWithAccess(id, userId) {
    // Check via ProjectMember (covers invited members + new projects)
    const membership = await prisma.projectMember.findFirst({
      where:   { projectId: id, userId },
      include: { project: true },
    });
    if (membership) return membership.project;

    // Legacy fallback — project created before the ProjectMember model
    return prisma.project.findFirst({ where: { id, userId } });
  },

  /**
   * Fetch a project with its owner user details.
   * Used by the Members page to display the owner when no ProjectMember
   * records exist yet (legacy projects).
   */
  async getByIdWithOwner(id) {
    return prisma.project.findUnique({
      where:   { id },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
  },

  /**
   * Create a new project and automatically add the creator as OWNER.
   * Wrapped in a transaction so both records are always created together.
   */
  async create({ userId, name, description, color, icon, visibility }) {
    return prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: { userId, name, description, color, icon, visibility },
      });
      await tx.projectMember.create({
        data: { projectId: project.id, userId, role: 'OWNER' },
      });
      return project;
    });
  },

  /** Delete a project (only if it belongs to the user). */
  async delete(id, userId) {
    return prisma.project.deleteMany({ where: { id, userId } });
  },
};

