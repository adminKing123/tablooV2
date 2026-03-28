'use client';

import { useActionState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '@/app/actions/auth';
import AuthLayout from '@/components/layout/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';

/**
 * Inner component needs useSearchParams, so it must be wrapped in Suspense.
 */
function LoginForm() {
  const searchParams = useSearchParams();
  const justVerified = searchParams.get('verified') === '1';
  const justReset    = searchParams.get('reset')    === '1';
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      footer={
        <span>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium">
            Sign up
          </Link>
        </span>
      }
    >
      <form action={formAction} className="space-y-4">
        {justVerified && (
          <Alert type="success" message="Email verified! You can now sign in." />
        )}
        {justReset && (
          <Alert type="success" message="Password reset successfully! You can now sign in." />
        )}
        <Alert type="error" message={state?.error} />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={pending}
        />

        <div className="space-y-1.5">
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            disabled={pending}
          />
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" fullWidth loading={pending} size="lg" className="mt-2">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Spinner className="w-8 h-8 text-indigo-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
