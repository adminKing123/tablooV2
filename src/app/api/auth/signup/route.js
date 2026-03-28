import { Prisma } from '@prisma/client';
import { AuthService } from '@/lib/services/auth.service';
import { ok, error, handleServiceError } from '@/lib/utils/response';
import { validateSignup } from '@/lib/utils/validate';
import { sendOTPEmail } from '@/lib/email';

/**
 * POST /api/auth/signup
 * Register a new user and send OTP verification email.
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const validationError = validateSignup(body);
    if (validationError) return error(validationError, 400);

    const user = await AuthService.register(body);
    const otpCode = await AuthService.createOTP(user.id);

    // Fire-and-forget — email delivery must not block the registration response
    sendOTPEmail(user.email, user.firstName, otpCode).catch(err =>
      console.error('OTP email failed:', err)
    );

    return ok({
      message: 'Registration successful! Please check your email for the OTP code.',
      email: user.email,
    }, 201);

  } catch (err) {
    // Race-condition safety net — Prisma unique constraint
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return error('Email already registered', 409);
    }
    console.error('Signup error:', err);
    return handleServiceError(err);
  }
}
