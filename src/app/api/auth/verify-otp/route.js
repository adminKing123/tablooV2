import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

/**
 * POST /api/auth/verify-otp
 * Verify OTP code and activate user account
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otpCode } = body;

    // Validation
    if (!email || !otpCode) {
      return NextResponse.json(
        { error: 'Email and OTP code are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, firstName: true, isVerified: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
    }

    // Fetch the most recent OTP for this user
    const otp = await prisma.otp.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new one.' },
        { status: 404 }
      );
    }

    if (otp.isUsed) {
      return NextResponse.json(
        { error: 'OTP already used. Please request a new one.' },
        { status: 400 }
      );
    }

    if (new Date() > otp.expiresAt) {
      return NextResponse.json(
        { error: 'OTP expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (otp.otpCode !== otpCode) {
      return NextResponse.json({ error: 'Invalid OTP code' }, { status: 400 });
    }

    // Verify user and delete all OTPs for this user
    await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });
    await prisma.otp.deleteMany({ where: { userId: user.id } });

    // Fire-and-forget welcome email
    sendWelcomeEmail(email, user.firstName).catch(err =>
      console.error('Welcome email failed:', err)
    );

    return NextResponse.json({
      message: 'Email verified successfully! You can now log in.',
      success: true,
    }, { status: 200 });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
