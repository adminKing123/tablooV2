import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import { ProjectService } from '@/lib/services/project.service';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WorkspaceClient from '@/components/workspace/WorkspaceClient';

/**
 * WorkspacePage — server component.
 * Fetches user + projects, passes to the client shell.
 */
export default async function WorkspacePage() {
  const user = await getServerUser();
  if (!user) redirect('/login');
  if (!user.onboardingCompleted) redirect('/onboarding');

  const projects = await ProjectService.getAccessibleByUserId(user.id);
  const workspaceName = user.workspaceName || `${user.firstName}'s Workspace`;

  return (
    <DashboardLayout user={user}>
      <WorkspaceClient
        workspaceName={workspaceName}
        initialProjects={projects}
      />
    </DashboardLayout>
  );
}
