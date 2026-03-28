import { AuthService } from '@/lib/services/auth.service';
import { ok, error, handleServiceError } from '@/lib/utils/response';
import { sendWelcomeEmail } from '@/lib/email';

/**
 * POST /api/auth/verify-otp
 * Verify OTP and activate the user account.
 */
export async function POST(request) {
  try {
    const { email, otpCode } = await request.json();

    if (!email || !otpCode) return error('Email and OTP code are required', 400);

    const user = await AuthService.verifyOTP(email, otpCode);

    // Fire-and-forget welcome email
    sendWelcomeEmail(email, user.firstName).catch(err =>
      console.error('Welcome email failed:', err)
    );

    return ok({ message: 'Email verified successfully! You can now log in.', success: true });

  } catch (err) {
    console.error('Verify OTP error:', err);
    return handleServiceError(err);
  }
}
