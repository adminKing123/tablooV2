import { AuthService } from '@/lib/services/auth.service';
import { ok, error, handleServiceError } from '@/lib/utils/response';
import { sendOTPEmail } from '@/lib/email';

/**
 * POST /api/auth/resend-otp
 * Create a new OTP and resend the verification email.
 */
export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) return error('Email is required', 400);

    const user = await AuthService.findByEmail(email);
    if (!user)           return error('User not found', 404);
    if (user.isVerified) return error('Email already verified', 400);

    const otpCode = await AuthService.createOTP(user.id);

    // Fire-and-forget
    sendOTPEmail(user.email, user.firstName, otpCode).catch(err =>
      console.error('Resend OTP email failed:', err)
    );

    return ok({ message: 'OTP sent successfully! Please check your email.' });

  } catch (err) {
    console.error('Resend OTP error:', err);
    return handleServiceError(err);
  }
}
