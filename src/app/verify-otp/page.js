'use client';

import { useActionState, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyOTPAction, resendOTPAction } from '@/app/actions/auth';
import AuthLayout from '@/components/layout/AuthLayout';
import OTPInput from '@/components/ui/OTPInput';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';

function VerifyOTPContent() {
  const searchParams = useSearchParams();
  const email = decodeURIComponent(searchParams.get('email') ?? '');

  // OTPInput is controlled for UX — value syncs into a hidden form input
  const [otpCode, setOtpCode] = useState('');

  const [verifyState, verifyAction, verifyPending] = useActionState(verifyOTPAction, null);
  const [resendState, resendAction, resendPending] = useActionState(resendOTPAction, null);

  // Clear the OTP boxes after a successful resend
  useEffect(() => {
    if (resendState?.success) setOtpCode('');
  }, [resendState]);

  return (
    <AuthLayout
      title="Check your email"
      subtitle={
        email ? (
          <span>
            We sent a 6-digit code to{' '}
            <span className="font-medium text-slate-700">{email}</span>
          </span>
        ) : (
          'Enter the 6-digit code we sent to your email'
        )
      }
      footer={
        <Link href="/login" className="text-slate-500 hover:text-slate-600 text-sm">
          ← Back to sign in
        </Link>
      }
    >
      {/* ── Verify form ── */}
      <form action={verifyAction} className="space-y-6">
        {/* Hidden fields pass email + OTP value to the Server Action */}
        <input type="hidden" name="email"   value={email} />
        <input type="hidden" name="otpCode" value={otpCode} />

        <Alert type="error"   message={verifyState?.error} />
        <Alert type="success" message={resendState?.success} />

        <OTPInput
          value={otpCode}
          onChange={setOtpCode}
          disabled={verifyPending}
        />

        <Button
          type="submit"
          fullWidth
          loading={verifyPending}
          size="lg"
          disabled={otpCode.replace(/\s/g, '').length !== 6}
        >
          Verify email
        </Button>
      </form>

      {/* ── Resend form ── */}
      <form action={resendAction} className="mt-4 text-center">
        <input type="hidden" name="email" value={email} />
        <Alert type="error" message={resendState?.error} className="mb-3 text-left" />
        <span className="text-sm text-slate-500">Didn&apos;t receive a code?{' '}</span>
        <button
          type="submit"
          disabled={resendPending}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendPending ? 'Sending…' : 'Resend code'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Spinner className="w-8 h-8 text-indigo-500" />
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
