import { redirect, notFound } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import { ProjectService } from '@/lib/services/project.service';
import { ProjectMemberService } from '@/lib/services/project-member.service';
import ProjectShell from '@/components/project/ProjectShell';

/**
 * ProjectIdLayout — server component.
 *
 * Validates access (owner OR member) once for ALL project sub-routes.
 * Fetches userRole for sidebar permission-aware rendering.
 * Wraps children in ProjectShell which owns the sidebar + top-bar.
 * Dynamic metadata (project name in browser tab) is handled per-page.
 */
export default async function ProjectIdLayout({ params, children }) {
  const { projectId } = await params;
  const id = Number(projectId);

  const user = await getServerUser();
  if (!user) redirect('/login');

  const [project, userRole] = await Promise.all([
    ProjectService.getByIdWithAccess(id, user.id),
    ProjectMemberService.getUserRole(id, user.id),
  ]);

  if (!project) notFound();

  return (
    <ProjectShell project={project} user={user} userRole={userRole ?? 'VIEWER'}>
      {children}
    </ProjectShell>
  );
}
