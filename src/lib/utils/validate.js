/**
 * Input validation utilities for API routes.
 * Each function returns a string error message, or null if valid.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignup({ email, firstName, lastName, password, confirmPassword }) {
  if (!email || !firstName || !lastName || !password || !confirmPassword)
    return 'All fields are required';
  if (!EMAIL_RE.test(email))        return 'Invalid email format';
  if (firstName.trim().length < 1)  return 'First name is required';
  if (lastName.trim().length < 1)   return 'Last name is required';
  if (password.length < 8)          return 'Password must be at least 8 characters';
  if (password !== confirmPassword)  return 'Passwords do not match';
  return null;
}

export function validateLogin({ email, password }) {
  if (!email || !password) return 'Email and password are required';
  if (!EMAIL_RE.test(email)) return 'Invalid email format';
  return null;
}
