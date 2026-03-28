import { AuthService } from '@/lib/services/auth.service';
import { ok, error } from '@/lib/utils/response';
import { verifyToken } from '@/lib/jwt';

/**
 * GET /api/auth/me
 * Return the current user based on auth_token cookie.
 */
export async function GET(request) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) return error('Not authenticated', 401);

    const payload = await verifyToken(token);
    if (!payload) return error('Invalid token', 401);

    const user = await AuthService.getUserById(payload.userId);
    if (!user) return error('User not found', 404);

    return ok({ user });

  } catch (err) {
    console.error('Get user error:', err);
    return error('Failed to get user', 500);
  }
}
