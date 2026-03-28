/**
 * Central icon library.
 *
 * Every SVG used in the app is exported from here as a named React component.
 * Each icon accepts a `className` prop (for Tailwind sizing / colour) and
 * forwards any additional SVG attributes via `...props`.
 *
 * Usage:
 *   import { ChevronDownIcon, UserIcon } from '@/assets/icons';
 *   <ChevronDownIcon className="w-4 h-4 text-slate-400" />
 *
 * Outline icons  — viewBox="0 0 24 24"  stroke="currentColor"
 * Filled icons   — viewBox="0 0 20 20"  fill="currentColor"
 * Spinner        — special animated icon (use Spinner component for full effect)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Theme toggle
// ─────────────────────────────────────────────────────────────────────────────

export function SunIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"
      />
    </svg>
  );
}

export function MoonIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  );
}

export function MonitorIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation / UI
// ─────────────────────────────────────────────────────────────────────────────

export function ChevronDownIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function UserIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

export function SignOutIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature / content icons
// ─────────────────────────────────────────────────────────────────────────────

export function LockClosedIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

export function MailIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

export function ShieldCheckIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

export function DatabaseIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
      />
    </svg>
  );
}

export function PaintBrushIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>
  );
}

export function BoltIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Status / feedback icons  (filled, viewBox 0 0 20 20)
// ─────────────────────────────────────────────────────────────────────────────

export function XCircleIcon({ className = '', ...props }) {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20" className={className} aria-hidden="true" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      />
    </svg>
  );
}

export function CheckCircleIcon({ className = '', ...props }) {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20" className={className} aria-hidden="true" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      />
    </svg>
  );
}

export function ExclamationTriangleIcon({ className = '', ...props }) {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20" className={className} aria-hidden="true" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      />
    </svg>
  );
}

export function InformationCircleIcon({ className = '', ...props }) {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20" className={className} aria-hidden="true" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Spinner  (used by the Spinner component — use animate-spin on the wrapper)
// ─────────────────────────────────────────────────────────────────────────────

export function SpinnerIcon({ className = '', ...props }) {
  return (
    <svg fill="none" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
