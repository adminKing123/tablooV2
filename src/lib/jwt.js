import { SignJWT, jwtVerify } from 'jose';

/**
 * Returns the JWT secret as a Uint8Array required by jose.
 * jose does not accept plain strings — it needs a binary key.
 */
function getSecret() {
  const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
  return new TextEncoder().encode(secret);
}

/**
 * Generate a signed JWT token.
 * @param {Object} payload - Data to encode
 * @param {string} expiresIn - Expiration time (default: 7 days)
 * @returns {Promise<string>} - Signed JWT
 */
export async function generateToken(payload, expiresIn = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns {Promise<Object|null>} - Decoded payload or null if invalid
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}
