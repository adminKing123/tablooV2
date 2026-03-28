import { AuthService } from '@/lib/services/auth.service';
import { ok, error, handleServiceError } from '@/lib/utils/response';
import { validateLogin } from '@/lib/utils/validate';

/**
 * POST /api/auth/login
 * Authenticate user and set auth_token cookie.
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const validationError = validateLogin(body);
    if (validationError) return error(validationError, 400);

    const { user, token } = await AuthService.login(body.email, body.password);

    // Set httpOnly cookie directly on the response (avoids RSC coordination issue)
    const response = ok({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (err) {
    console.error('Login error:', err);
    return handleServiceError(err);
  }
}
