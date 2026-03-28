'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(formData);
      router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started for free today"
      footer={
        <span>
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert type="error" message={error} />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="firstName"
            name="firstName"
            type="text"
            label="First name"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            autoComplete="given-name"
            required
          />
          <Input
            id="lastName"
            name="lastName"
            type="text"
            label="Last name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            autoComplete="family-name"
            required
          />
        </div>

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Min. 8 characters"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
          hint="Use 8 or more characters with a mix of letters and numbers"
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
