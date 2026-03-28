import { redirect, notFound } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import { ProjectService } from '@/lib/services/project.service';
import ProjectShell from '@/components/project/ProjectShell';

/**
 * ProjectIdLayout — server component.
 *
 * Validates ownership once for ALL project sub-routes (overview, settings, …).
 * Wraps children in ProjectShell which owns the sidebar + top-bar.
 * Dynamic metadata (project name in browser tab) is handled per-page.
 */
export default async function ProjectIdLayout({ params, children }) {
  const { projectId } = await params;

  const user = await getServerUser();
  if (!user) redirect('/login');

  const project = await ProjectService.getById(Number(projectId), user.id);
  if (!project) notFound();

  return (
    <ProjectShell project={project} user={user}>
      {children}
    </ProjectShell>
  );
}
