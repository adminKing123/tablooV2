'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { forgotPasswordAction } from '@/app/actions/auth';
import AuthLayout from '@/components/layout/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

/**
 * ForgotPasswordPage — captures the user's email and triggers a password-reset
 * OTP via forgotPasswordAction. Always redirects to /reset-password so the
 * server never reveals whether a given email is registered.
 */
export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, null);

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset code"
      footer={
        <Link
          href="/login"
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 text-sm transition-colors"
        >
          ← Back to sign in
        </Link>
      }
    >
      <form action={formAction} className="space-y-4">
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
          hint="We'll send a 6-digit reset code to this address"
        />

        <Button type="submit" fullWidth loading={pending} size="lg" className="mt-2">
          Send reset code
        </Button>
      </form>
    </AuthLayout>
  );
}
