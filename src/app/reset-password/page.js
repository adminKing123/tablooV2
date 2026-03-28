'use client';

import { useActionState, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPasswordAction, resendResetOTPAction } from '@/app/actions/auth';
import AuthLayout from '@/components/layout/AuthLayout';
import OTPInput from '@/components/ui/OTPInput';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const email = decodeURIComponent(searchParams.get('email') ?? '');

  // OTPInput is controlled for UX — value syncs into a hidden form input
  const [otpCode, setOtpCode] = useState('');

  const [resetState,  resetAction,  resetPending]  = useActionState(resetPasswordAction,  null);
  const [resendState, resendAction, resendPending]  = useActionState(resendResetOTPAction, null);

  // Clear OTP boxes after a successful resend so the user types the new code
  useEffect(() => {
    if (resendState?.success) setOtpCode('');
  }, [resendState]);

  const codeComplete = otpCode.replace(/\s/g, '').length === 6;

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        email ? (
          <span>
            Enter the code sent to{' '}
            <span className="font-medium text-slate-700 dark:text-slate-200">{email}</span>
          </span>
        ) : (
          'Enter the 6-digit code from your email'
        )
      }
      footer={
        <Link
          href="/login"
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 text-sm transition-colors"
        >
          ← Back to sign in
        </Link>
      }
    >
      {/* ── Reset form ── */}
      <form action={resetAction} className="space-y-5">
        {/* Hidden fields forwarded to the Server Action */}
        <input type="hidden" name="email"   value={email} />
        <input type="hidden" name="otpCode" value={otpCode} />

        <Alert type="error"   message={resetState?.error} />
        <Alert type="success" message={resendState?.success} />

        {/* OTP code entry */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Reset code
          </p>
          <OTPInput
            value={otpCode}
            onChange={setOtpCode}
            disabled={resetPending}
          />
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 dark:text-slate-500">
              New password
            </span>
          </div>
        </div>

        {/* New password */}
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          label="New password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          required
          disabled={resetPending}
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm new password"
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          required
          disabled={resetPending}
        />

        <Button
          type="submit"
          fullWidth
          loading={resetPending}
          size="lg"
          disabled={!codeComplete}
          className="mt-2"
        >
          Reset password
        </Button>
      </form>

      {/* ── Resend form ── */}
      <form action={resendAction} className="mt-5 text-center">
        <input type="hidden" name="email" value={email} />
        <Alert type="error" message={resendState?.error} className="mb-3 text-left" />
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Didn&apos;t receive a code?{' '}
        </span>
        <button
          type="submit"
          disabled={resendPending}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendPending ? 'Sending…' : 'Resend code'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Spinner className="w-8 h-8 text-indigo-500" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
