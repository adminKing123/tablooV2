'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import OTPInput from '@/components/ui/OTPInput';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOTP, resendOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const param = searchParams.get('email');
    if (param) setEmail(decodeURIComponent(param));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await verifyOTP(email, otpCode);
      setSuccess('Email verified! Redirecting to sign in...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setResending(true);
    try {
      await resendOTP(email);
      setSuccess('A new code has been sent to your email.');
      setOtpCode('');
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

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
      <form onSubmit={handleSubmit} className="space-y-6">
        <Alert type="error"   message={error} />
        <Alert type="success" message={success} />

        {/* 6-box OTP input */}
        <OTPInput
          value={otpCode}
          onChange={setOtpCode}
          disabled={loading || !!success}
        />

        <Button
          type="submit"
          fullWidth
          loading={loading}
          size="lg"
          disabled={otpCode.length !== 6 || !!success}
        >
          Verify email
        </Button>

        {/* Resend */}
        <div className="text-center">
          <span className="text-sm text-slate-500">Didn&apos;t receive a code?{' '}</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !!success}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? 'Sending…' : 'Resend code'}
          </button>
        </div>
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
