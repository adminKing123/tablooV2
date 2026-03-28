import { SpinnerIcon } from '@/assets/icons';

/**
 * Spinner — animated loading indicator.
 * Accepts any Tailwind size/color via className.
 */
export default function Spinner({ className = 'w-5 h-5' }) {
  return <SpinnerIcon className={`animate-spin ${className}`} />;
}
