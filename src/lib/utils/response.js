import { NextResponse } from 'next/server';

/**
 * Standardised API response helpers.
 * All routes should use these instead of calling NextResponse.json directly.
 */

/** 2xx success */
export const ok = (data, status = 200) => NextResponse.json(data, { status });

/** 4xx / 5xx error */
export const error = (message, status) => NextResponse.json({ error: message }, { status });

/**
 * Map AuthService error codes to HTTP responses.
 * Any unknown error falls back to 500.
 */
const ERROR_MAP = {
  EMAIL_TAKEN:          [409, 'Email already registered'],
  EMAIL_NOT_VERIFIED:   [403, 'Please verify your email before logging in'],
  INVALID_CREDENTIALS:  [401, 'Invalid email or password'],
  USER_NOT_FOUND:       [404, 'User not found'],
  ALREADY_VERIFIED:     [400, 'Email already verified'],
  OTP_NOT_FOUND:        [404, 'No OTP found. Please request a new one.'],
  OTP_USED:             [400, 'OTP already used. Please request a new one.'],
  OTP_EXPIRED:          [400, 'OTP expired. Please request a new one.'],
  OTP_INVALID:          [400, 'Invalid OTP code'],
};

export function handleServiceError(err) {
  const entry = ERROR_MAP[err.message];
  if (entry) return error(entry[1], entry[0]);
  // Unknown / unhandled error — log server-side, return generic message
  console.error('Unhandled service error:', err);
  return error('Something went wrong. Please try again.', 500);
}
