import prisma from '@/lib/prisma';

/**
 * ProjectService — all project business logic.
 */
export const ProjectService = {

  /** Fetch all projects for a user, newest first. */
  async getByUserId(userId) {
    return prisma.project.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  /** Create a new project. */
  async create({ userId, name, description, color, icon, visibility }) {
    return prisma.project.create({
      data: { userId, name, description, color, icon, visibility },
    });
  },

  /** Delete a project (only if it belongs to the user). */
  async delete(id, userId) {
    return prisma.project.deleteMany({ where: { id, userId } });
  },
};
