'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { AuthService } from '@/lib/services/auth.service';
import { generateToken } from '@/lib/jwt';
import { validateLogin, validateSignup } from '@/lib/utils/validate';
import { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email';

/**
 * Map AuthService named error codes to user-facing messages.
 * Mirrors what response.js does for API routes.
 */
const ERROR_MAP = {
  EMAIL_TAKEN:         'Email already registered',
  EMAIL_NOT_VERIFIED:  'Please verify your email before signing in',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND:      'No account found for that email',
  ALREADY_VERIFIED:    'Email is already verified',
  OTP_NOT_FOUND:       'No OTP found — please request a new one',
  OTP_USED:            'OTP already used — please request a new one',
  OTP_EXPIRED:         'OTP expired — please request a new one',
  OTP_INVALID:         'Incorrect code — please check and try again',
};

function toErrorMessage(err) {
  return ERROR_MAP[err.message] ?? 'Something went wrong. Please try again.';
}

/* ─────────────────────────────────────────────────────────
   loginAction
   Called by the login page form via useActionState.
   On success: sets auth cookie + redirects to /profile.
   On failure: returns { error: string }.
───────────────────────────────────────────────────────── */
export async function loginAction(prevState, formData) {
  const email    = formData.get('email')?.toString().trim()  ?? '';
  const password = formData.get('password')?.toString()      ?? '';

  const validationError = validateLogin({ email, password });
  if (validationError) return { error: validationError };

  let token;
  try {
    ({ token } = await AuthService.login(email, password));
  } catch (err) {
    console.error('loginAction:', err.message);
    return { error: toErrorMessage(err) };
  }

  // cookies() from next/headers works correctly in Server Actions
  const jar = await cookies();
  jar.set('auth_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7, // 7 days
    path:     '/',
  });

  redirect('/profile');
}

/* ─────────────────────────────────────────────────────────
   signupAction
   On success: sends OTP email + redirects to /verify-otp.
   On failure: returns { error: string }.
───────────────────────────────────────────────────────── */
export async function signupAction(prevState, formData) {
  const body = {
    email:           formData.get('email')?.toString().trim()           ?? '',
    firstName:       formData.get('firstName')?.toString().trim()       ?? '',
    lastName:        formData.get('lastName')?.toString().trim()        ?? '',
    password:        formData.get('password')?.toString()               ?? '',
    confirmPassword: formData.get('confirmPassword')?.toString()        ?? '',
  };

  const validationError = validateSignup(body);
  if (validationError) return { error: validationError };

  try {
    const user     = await AuthService.register(body);
    const otpCode  = await AuthService.createOTP(user.id);
    sendOTPEmail(user.email, user.firstName, otpCode).catch(err =>
      console.error('OTP email failed:', err)
    );
  } catch (err) {
    console.error('signupAction:', err.message);
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return { error: 'Email already registered' };
    }
    return { error: toErrorMessage(err) };
  }

  redirect(`/verify-otp?email=${encodeURIComponent(body.email)}`);
}

/* ─────────────────────────────────────────────────────────
   verifyOTPAction
   On success: sends welcome email, sets session cookie,
   and redirects straight to /profile (auto-login).
   On failure: returns { error: string }.
───────────────────────────────────────────────────────── */
export async function verifyOTPAction(prevState, formData) {
  const email   = formData.get('email')?.toString().trim()   ?? '';
  const otpCode = formData.get('otpCode')?.toString().trim() ?? '';

  if (!email || !otpCode) return { error: 'Email and OTP code are required' };

  let user;
  try {
    user = await AuthService.verifyOTP(email, otpCode);
    sendWelcomeEmail(email, user.firstName).catch(err =>
      console.error('Welcome email failed:', err)
    );
  } catch (err) {
    console.error('verifyOTPAction:', err.message);
    return { error: toErrorMessage(err) };
  }

  // Issue a session token so the user is immediately logged in
  const token = await generateToken({ userId: user.id, email });
  const jar   = await cookies();
  jar.set('auth_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7, // 7 days
    path:     '/',
  });

  redirect('/profile');
}

/* ─────────────────────────────────────────────────────────
   resendOTPAction
   Returns { error } | { success }.
   Never redirects — stays on the verify-otp page.
───────────────────────────────────────────────────────── */
export async function resendOTPAction(prevState, formData) {
  const email = formData.get('email')?.toString().trim() ?? '';
  if (!email) return { error: 'Email is required' };

  try {
    const user = await AuthService.findByEmail(email);
    if (!user)           return { error: 'No account found for that email' };
    if (user.isVerified) return { error: 'Email is already verified' };

    const otpCode = await AuthService.createOTP(user.id);
    sendOTPEmail(user.email, user.firstName, otpCode).catch(err =>
      console.error('Resend OTP email failed:', err)
    );
    return { success: 'A new code has been sent to your email.' };
  } catch (err) {
    console.error('resendOTPAction:', err.message);
    return { error: toErrorMessage(err) };
  }
}

/* ─────────────────────────────────────────────────────────
   logoutAction
   Deletes the auth cookie and redirects to /login.
───────────────────────────────────────────────────────── */
export async function logoutAction() {
  const jar = await cookies();
  jar.delete('auth_token');
  redirect('/login');
}
/* ─────────────────────────────────────────────────────
   forgotPasswordAction
   Looks up the email and—if found—sends a PASSWORD_RESET OTP.
   Always redirects to /reset-password (no email-enumeration leak).
──────────────────────────────────────────────────── */
export async function forgotPasswordAction(prevState, formData) {
  const email = formData.get('email')?.toString().trim() ?? '';
  if (!email) return { error: 'Email address is required' };

  // Attempt to create a reset OTP — silently ignore if user not found
  const result = await AuthService.forgotPassword(email).catch((err) => {
    console.error('forgotPasswordAction:', err.message);
    return null;
  });

  if (result) {
    sendPasswordResetEmail(result.user.email, result.user.firstName, result.otpCode)
      .catch(err => console.error('Password reset email failed:', err));
  }

  // Always redirect — never reveal whether the email is registered
  redirect(`/reset-password?email=${encodeURIComponent(email)}`);
}

/* ─────────────────────────────────────────────────────
   resetPasswordAction
   Verifies the PASSWORD_RESET OTP and updates the user’s password.
   On success: redirects to /login?reset=1.
   On failure: returns { error: string }.
──────────────────────────────────────────────────── */
export async function resetPasswordAction(prevState, formData) {
  const email           = formData.get('email')?.toString().trim()  ?? '';
  const otpCode         = formData.get('otpCode')?.toString().trim() ?? '';
  const newPassword     = formData.get('newPassword')?.toString()    ?? '';
  const confirmPassword = formData.get('confirmPassword')?.toString() ?? '';

  if (!otpCode)                           return { error: 'Please enter the 6-digit reset code' };
  if (otpCode.replace(/\s/g, '').length !== 6) return { error: 'The reset code must be 6 digits' };
  if (!newPassword)                       return { error: 'New password is required' };
  if (newPassword.length < 8)             return { error: 'Password must be at least 8 characters' };
  if (newPassword !== confirmPassword)    return { error: 'Passwords do not match' };

  try {
    await AuthService.verifyAndResetPassword(email, otpCode, newPassword);
  } catch (err) {
    console.error('resetPasswordAction:', err.message);
    return { error: toErrorMessage(err) };
  }

  redirect('/login?reset=1');
}

/* ─────────────────────────────────────────────────────
   resendResetOTPAction
   Resends a PASSWORD_RESET OTP for the /reset-password page.
   Returns { error } | { success }.
──────────────────────────────────────────────────── */
export async function resendResetOTPAction(prevState, formData) {
  const email = formData.get('email')?.toString().trim() ?? '';
  if (!email) return { error: 'Email is required' };

  const result = await AuthService.forgotPassword(email).catch((err) => {
    console.error('resendResetOTPAction:', err.message);
    return null;
  });

  if (result) {
    sendPasswordResetEmail(result.user.email, result.user.firstName, result.otpCode)
      .catch(err => console.error('Resend reset email failed:', err));
  }

  // Generic message — no enumeration
  return { success: 'A new reset code has been sent if that email is registered.' };
}