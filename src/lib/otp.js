/**
 * Generate a random 6-digit OTP
 * @returns {string} - 6-digit OTP code
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Get OTP expiration time (10 minutes from now)
 * @returns {Date} - Expiration timestamp
 */
export function getOTPExpiration() {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 10);
  return expiration;
}
