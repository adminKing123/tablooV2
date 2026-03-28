import { redirect, notFound } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import { ProjectService } from '@/lib/services/project.service';
import { ProjectMemberService } from '@/lib/services/project-member.service';
import { ProjectInvitationService } from '@/lib/services/project-invitation.service';
import MembersClient from '@/components/project/MembersClient';

export const metadata = { title: 'Members' };

/**
 * ProjectMembersPage — server component.
 *
 * Fetches all members, pending invitations, and the current user's role,
 * then delegates rendering to the interactive MembersClient.
 *
 * Member list edge-case (legacy projects):
 *   Projects created before the ProjectMember model have no member records.
 *   In that case we synthesise an OWNER entry from the project's user relation
 *   so the UI always shows at least one member.
 */
export default async function ProjectMembersPage({ params }) {
  const { projectId } = await params;
  const id = Number(projectId);

  const user = await getServerUser();
  if (!user) redirect('/login');

  // layout.js already validated access; we re-verify non-destructively here
  const project = await ProjectService.getByIdWithOwner(id);
  if (!project) notFound();

  const [rawMembers, invitations, userRole] = await Promise.all([
    ProjectMemberService.getByProjectId(id),
    ProjectInvitationService.getByProjectId(id),
    ProjectMemberService.getUserRole(id, user.id),
  ]);

  // Synthesise OWNER entry for legacy projects with no ProjectMember records
  const hasOwnerRecord = rawMembers.some(m => m.role === 'OWNER');
  const members = hasOwnerRecord
    ? rawMembers
    : [
        {
          id:       null,
          role:     'OWNER',
          joinedAt: project.createdAt,
          user:     {
            id:        project.user.id,
            firstName: project.user.firstName,
            lastName:  project.user.lastName,
            email:     project.user.email,
          },
        },
        ...rawMembers,
      ];

  // Serialise dates for the client component
  const serialised = {
    projectId: id,
    userRole:  userRole ?? 'VIEWER',
    currentUserId: user.id,
    members: members.map(m => ({
      id:       m.id,
      role:     m.role,
      joinedAt: m.joinedAt?.toISOString() ?? null,
      user:     m.user,
    })),
    invitations: invitations.map(inv => ({
      id:        inv.id,
      email:     inv.email,
      role:      inv.role,
      expiresAt: inv.expiresAt.toISOString(),
      createdAt: inv.createdAt.toISOString(),
      inviter:   inv.inviter,
    })),
  };

  return <MembersClient {...serialised} />;
}
