'use client';

import { useActionState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signupAction } from '@/app/actions/auth';
import AuthLayout from '@/components/layout/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';

/**
 * Inner form reads searchParams for invite pre-fill, so it needs Suspense.
 */
function SignupForm() {
  const searchParams = useSearchParams();
  const preEmail     = searchParams.get('email')  ?? '';
  const invite       = searchParams.get('invite') ?? '';

  const [state, formAction, pending] = useActionState(signupAction, null);

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started for free today"
      footer={
        <span>
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium">
            Sign in
          </Link>
        </span>
      }
    >
      <form action={formAction} className="space-y-4">
        {invite   && <input type="hidden" name="invite" value={invite} />}
        <Alert type="error" message={state?.error} />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          defaultValue={preEmail}
          required
          disabled={pending}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="firstName"
            name="firstName"
            type="text"
            label="First name"
            placeholder="John"
            autoComplete="given-name"
            required
            disabled={pending}
          />
          <Input
            id="lastName"
            name="lastName"
            type="text"
            label="Last name"
            placeholder="Doe"
            autoComplete="family-name"
            required
            disabled={pending}
          />
        </div>

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          required
          disabled={pending}
          hint="Use 8 or more characters"
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          disabled={pending}
        />

        <Button type="submit" fullWidth loading={pending} size="lg" className="mt-2">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Spinner className="w-8 h-8 text-indigo-500" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}

