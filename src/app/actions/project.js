'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import { ProjectService } from '@/lib/services/project.service';

/**
 * createProjectAction
 * Validates input, creates a project, and revalidates the workspace page.
 */
export async function createProjectAction(prevState, formData) {
  const user = await getServerUser();
  if (!user) redirect('/login');

  const name        = formData.get('name')?.toString().trim()        ?? '';
  const description = formData.get('description')?.toString().trim() ?? '';
  const color       = formData.get('color')?.toString()              ?? '#6366f1';
  const icon        = formData.get('icon')?.toString()               ?? '📁';
  const visibility  = formData.get('visibility')?.toString()         ?? 'PRIVATE';

  if (!name)          return { error: 'Project name is required' };
  if (name.length > 100) return { error: 'Project name must be under 100 characters' };

  try {
    await ProjectService.create({ userId: user.id, name, description, color, icon, visibility });
  } catch (err) {
    console.error('createProjectAction:', err.message);
    return { error: 'Failed to create project. Please try again.' };
  }

  revalidatePath('/workspace');
  return { success: true };
}
