'use server';

import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import { AuthService } from '@/lib/services/auth.service';

/**
 * completeOnboardingAction
 * Saves all onboarding fields and marks the user's profile as complete.
 * Redirects to /profile on success.
 */
export async function completeOnboardingAction(prevState, formData) {
  const user = await getServerUser();
  if (!user) redirect('/login');

  const jobTitle      = formData.get('jobTitle')?.toString().trim()      || null;
  const phone         = formData.get('phone')?.toString().trim()         || null;
  const usageType     = formData.get('usageType')?.toString()            || null;
  const teamSize      = formData.get('teamSize')?.toString()             || null;
  const workspaceName = formData.get('workspaceName')?.toString().trim() || null;

  if (!jobTitle)      return { error: 'Please select your role', step: 1 };
  if (!usageType)     return { error: "Please select what you're using Tabloo for", step: 2 };
  if (!teamSize)      return { error: 'Please select your team size', step: 3 };
  if (!workspaceName) return { error: 'Please enter a workspace name', step: 4 };

  try {
    await AuthService.updateOnboarding(user.id, { jobTitle, phone, usageType, teamSize, workspaceName });
  } catch (err) {
    console.error('completeOnboardingAction:', err.message);
    return { error: 'Something went wrong. Please try again.', step: 4 };
  }

  redirect('/profile');
}

/**
 * skipOnboardingAction
 * Marks onboarding as complete with no extended data so the user can proceed.
 */
export async function skipOnboardingAction() {
  const user = await getServerUser();
  if (!user) redirect('/login');

  try {
    await AuthService.updateOnboarding(user.id, {
      jobTitle: null, phone: null, usageType: null, teamSize: null, workspaceName: null,
    });
  } catch (err) {
    console.error('skipOnboardingAction:', err.message);
  }

  redirect('/profile');
}
