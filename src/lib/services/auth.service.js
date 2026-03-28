import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { generateOTP, getOTPExpiration } from '@/lib/otp';
import { generateToken } from '@/lib/jwt';

/**
 * AuthService — all authentication business logic.
 *
 * Routes act as thin controllers: parse → validate → call service → respond.
 * Named error codes are translated to HTTP responses in lib/utils/response.js.
 */
export const AuthService = {

  /** Find a user by email (returns full record or null). */
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  },

  /**
   * Register a new unverified user.
   * If an unverified user already exists for this email, it is replaced.
   * Throws 'EMAIL_TAKEN' if a verified account exists.
   */
  async register({ email, firstName, lastName, password }) {
    const normalizedEmail = email.toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, isVerified: true },
    });

    if (existing?.isVerified) throw new Error('EMAIL_TAKEN');

    // Replace unverified duplicate (cascade removes OTPs via schema)
    if (existing) {
      await prisma.user.delete({ where: { id: existing.id } });
    }

    const passwordHash = await hashPassword(password);

    return prisma.user.create({
      data: { email: normalizedEmail, firstName, lastName, passwordHash },
      select: { id: true, email: true, firstName: true },
    });
  },

  /**
   * Create an OTP record for a user and return the plain code.
   */
  async createOTP(userId) {
    const otpCode = generateOTP();
    const expiresAt = getOTPExpiration();
    await prisma.otp.create({ data: { userId, otpCode, expiresAt } });
    return otpCode;
  },

  /**
   * Verify an OTP and activate the account.
   * Deletes all OTPs for the user on success.
   * Throws a named error code string on any failure.
   */
  async verifyOTP(email, otpCode) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, firstName: true, isVerified: true },
    });

    if (!user) throw new Error('USER_NOT_FOUND');
    if (user.isVerified) throw new Error('ALREADY_VERIFIED');

    const otp = await prisma.otp.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp)               throw new Error('OTP_NOT_FOUND');
    if (otp.isUsed)         throw new Error('OTP_USED');
    if (new Date() > otp.expiresAt) throw new Error('OTP_EXPIRED');
    if (otp.otpCode !== otpCode)    throw new Error('OTP_INVALID');

    await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });
    await prisma.otp.deleteMany({ where: { userId: user.id } });

    return user;
  },

  /**
   * Authenticate a user and return { user, token }.
   * Throws 'INVALID_CREDENTIALS' or 'EMAIL_NOT_VERIFIED' on failure.
   */
  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user)            throw new Error('INVALID_CREDENTIALS');
    if (!user.isVerified) throw new Error('EMAIL_NOT_VERIFIED');

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) throw new Error('INVALID_CREDENTIALS');

    const token = await generateToken({ userId: user.id, email: user.email });
    return { user, token };
  },

  /**
   * Fetch a verified user's public profile by ID.
   * Returns null if not found or not verified.
   */
  async getUserById(id) {
    return prisma.user.findFirst({
      where: { id, isVerified: true },
      select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
    });
  },
};
