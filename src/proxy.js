import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * Edge-compatible proxy for route protection.
 * Uses jose for JWT verification (jsonwebtoken does not run on the Edge runtime).
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/profile'];
  const authRoutes = ['/login', '/signup', '/verify-otp'];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Only run verification if the route is relevant
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;
  let user = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback-secret-change-in-production'
      );
      const { payload } = await jwtVerify(token, secret);
      user = payload;
    } catch {
      // Token invalid or expired — treat as unauthenticated
    }
  }

  // Unauthenticated user hitting a protected route
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Authenticated user hitting a login/signup page
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
  ],
};
