import { redirect, notFound } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import { ProjectService } from '@/lib/services/project.service';
import ProjectShell from '@/components/project/ProjectShell';

/**
 * ProjectPage — server component.
 * Validates ownership then hands off to the full-page ProjectShell client component.
 */
export default async function ProjectPage({ params }) {
  const { projectId } = await params;

  const user = await getServerUser();
  if (!user) redirect('/login');

  const project = await ProjectService.getById(Number(projectId), user.id);
  if (!project) notFound();

  return <ProjectShell project={project} user={user} />;
}
