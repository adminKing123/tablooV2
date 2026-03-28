import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { generateOTP, getOTPExpiration } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/email';

/**
 * POST /api/auth/signup
 * Register a new user and send OTP verification email
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, password, confirmPassword } = body;

    // Validation
    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // If user exists but is unverified, delete and allow re-registration
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, isVerified: true },
    });

    if (existing) {
      if (existing.isVerified) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }
      // Cascade delete also removes associated OTPs (defined in schema)
      await prisma.user.delete({ where: { id: existing.id } });
    }

    const passwordHash = await hashPassword(password);
    const otpCode = generateOTP();
    const expiresAt = getOTPExpiration();

    // Create user first, then OTP — clean up on any failure
    // (Interactive transactions are not supported with connection pool adapters)
    const user = await prisma.user.create({
      data: { email: normalizedEmail, firstName, lastName, passwordHash },
      select: { id: true, email: true, firstName: true },
    });

    try {
      await prisma.otp.create({
        data: { userId: user.id, otpCode, expiresAt },
      });
    } catch (otpError) {
      // OTP creation failed — remove the orphaned user record
      await prisma.user.delete({ where: { id: user.id } });
      throw otpError;
    }

    // Fire-and-forget — email delivery does not block registration
    sendOTPEmail(user.email, user.firstName, otpCode).catch(err =>
      console.error('OTP email failed:', err)
    );

    return NextResponse.json(
      {
        message: 'Registration successful! Please check your email for the OTP code.',
        userId: user.id,
        email: user.email,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    // Prisma unique-constraint violation (race condition safety net)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
