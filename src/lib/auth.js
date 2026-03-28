import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { AuthService } from '@/lib/services/auth.service';

/**
 * Server-side auth helper — safe to call in any Server Component or Server Action.
 *
 * Reads the httpOnly auth_token cookie, verifies the JWT, then returns the
 * matching verified user record. Returns null when unauthenticated or the
 * token is invalid/expired.
 */
export async function getServerUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return AuthService.getUserById(payload.userId);
}
