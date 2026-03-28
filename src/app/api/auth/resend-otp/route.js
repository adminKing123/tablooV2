import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOTP, getOTPExpiration } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/email';

/**
 * POST /api/auth/resend-otp
 * Resend OTP verification email
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, firstName: true, isVerified: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
    }

    const otpCode = generateOTP();
    const expiresAt = getOTPExpiration();

    await prisma.otp.create({
      data: { userId: user.id, otpCode, expiresAt },
    });

    // Fire-and-forget — email delivery does not block the response
    sendOTPEmail(user.email, user.firstName, otpCode).catch(err =>
      console.error('Resend OTP email failed:', err)
    );

    return NextResponse.json({
      message: 'OTP sent successfully! Please check your email.',
    }, { status: 200 });

  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to resend OTP. Please try again.' },
      { status: 500 }
    );
  }
}
