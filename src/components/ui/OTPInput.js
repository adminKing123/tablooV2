'use client';

import { useRef, useEffect } from 'react';

/**
 * OTPInput — professional 6-digit one-time password input.
 *
 * Two groups of 3 boxes separated by a dash for easier reading.
 * - Empty boxes: subtle background, light border
 * - Filled boxes: white bg, indigo border — clearly distinguishable
 * - Focused box: ring + indigo border
 * - Supports keyboard navigation, backspace, paste, and autoFocus
 *
 * @param {string}   value      — current OTP string (up to 6 digits)
 * @param {Function} onChange   — called with new OTP string on every change
 * @param {boolean}  disabled   — disables all boxes
 * @param {boolean}  autoFocus  — focus first empty box on mount (default true)
 */
export default function OTPInput({ value = '', onChange, disabled = false, autoFocus = true }) {
  const refs = useRef([]);

  // On mount: focus the first empty slot (or the last if fully filled)
  useEffect(() => {
    if (!autoFocus || disabled) return;
    const firstEmpty = Array.from({ length: 6 }).findIndex((_, i) => {
      const ch = value[i];
      return !ch || ch === ' ';
    });
    refs.current[firstEmpty === -1 ? 5 : firstEmpty]?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Returns the display digit at position i, or '' if empty. */
  const getDigit = (i) => {
    const ch = value[i];
    return ch && ch !== ' ' ? ch : '';
  };

  const handleChange = (i, e) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = value.padEnd(6, ' ').split('');
    arr[i] = digit || ' ';
    onChange(arr.join('').trimEnd());
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const arr = value.padEnd(6, ' ').split('');
      if (arr[i].trim()) {
        arr[i] = ' ';
      } else if (i > 0) {
        arr[i - 1] = ' ';
        refs.current[i - 1]?.focus();
      }
      onChange(arr.join('').trimEnd());
    } else if (e.key === 'ArrowLeft'  && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < 5) {
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // Select existing content on focus so typing immediately replaces the digit
  const handleFocus = (e) => e.target.select();

  /** Render `count` boxes starting at index `from`. */
  const renderGroup = (from, count) =>
    Array.from({ length: count }, (_, idx) => {
      const i      = from + idx;
      const digit  = getDigit(i);
      const filled = digit !== '';

      return (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of 6`}
          className={[
            // Layout & typography
            'w-11 h-14 sm:w-12 sm:h-[3.75rem]',
            'text-center text-xl sm:text-2xl font-mono font-bold',
            'rounded-xl border-2 transition-all duration-150',
            'focus:outline-none focus:ring-4',
            'caret-transparent select-none',
            // State-dependent styles
            disabled
              ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : filled
                ? 'bg-white dark:bg-slate-800 border-indigo-400 dark:border-indigo-500 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/10'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/10',
          ].join(' ')}
        />
      );
    });

  return (
    <div role="group" aria-label="One-time password input" className="space-y-3">
      {/* Boxes: 3 — separator — 3 */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5">
        {renderGroup(0, 3)}

        {/* Separator */}
        <span
          className="text-slate-300 dark:text-slate-600 text-2xl font-light select-none px-0.5"
          aria-hidden="true"
        >
          —
        </span>

        {renderGroup(3, 3)}
      </div>

      {/* Progress indicator dots */}
      <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span
            key={i}
            className={[
              'w-1.5 h-1.5 rounded-full transition-colors duration-150',
              getDigit(i)
                ? 'bg-indigo-500 dark:bg-indigo-400'
                : 'bg-slate-200 dark:bg-slate-700',
            ].join(' ')}
          />
        ))}
      </div>

      {/* Hint */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        You can paste the code directly
      </p>
    </div>
  );
}

  const refs = useRef([]);

  const handleChange = (i, e) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = (value + '      ').slice(0, 6).split('');
    arr[i] = digit || ' ';
    const next = arr.join('').trimEnd();
    onChange(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const arr = (value + '      ').slice(0, 6).split('');
      if (arr[i].trim()) {
        arr[i] = ' ';
      } else if (i > 0) {
        arr[i - 1] = ' ';
        refs.current[i - 1]?.focus();
      }
      onChange(arr.join('').trimEnd());
    } else if (e.key === 'ArrowLeft'  && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < 5) {
      refs.current[i + 1]?.focus();
    }
  };
