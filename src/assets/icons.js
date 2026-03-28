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

// ─────────────────────────────────────────────────────────────────────────────
// Onboarding / extended UI icons
// ─────────────────────────────────────────────────────────────────────────────

export function BriefcaseIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

export function AcademicCapIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
      />
    </svg>
  );
}

export function UsersIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

export function BuildingOfficeIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
}

export function ArrowRightIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

export function SparklesIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Action / utility icons
// ─────────────────────────────────────────────────────────────────────────────

/** Plus / add icon — use strokeWidth prop to override the default 2 */
export function PlusIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/** X / close / dismiss icon */
export function XMarkIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  );
}

/** Bare checkmark (no circle) — e.g. for selected-state indicators */
export function CheckIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <polyline points="4 12 9 18 20 6" />
    </svg>
  );
}

/** Clipboard with checklist lines — Tasks section */
export function ClipboardListIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );
}

/** Three vertical columns — Board / Kanban section */
export function ViewColumnsIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
      />
    </svg>
  );
}

/** Gear / cog — Settings section */
export function CogIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

/** Trash / delete icon */
export function TrashIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

/** Paper airplane / send invitation */
export function PaperAirplaneIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );
}

/** Clock / time remaining */
export function ClockIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

/** Shield with a person — role / permissions */
export function ShieldPersonIcon({ className = '', ...props }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}
