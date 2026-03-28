'use client';

import { useRef } from 'react';

/**
 * OTPInput — 6-box one-time password input.
 *
 * @param {string}   value    — current OTP string (1–6 chars)
 * @param {Function} onChange — called with the new OTP string
 * @param {boolean}  disabled
 */
export default function OTPInput({ value = '', onChange, disabled = false }) {
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
    } else if (e.key === 'ArrowLeft' && i > 0) {
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

  return (
    <div className="flex gap-3 justify-center" role="group" aria-label="OTP input">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          className="w-11 h-14 text-center text-2xl font-bold text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 transition-all duration-150 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 disabled:bg-slate-100 dark:disabled:bg-slate-800/80 disabled:cursor-not-allowed caret-transparent"
        />
      ))}
    </div>
  );
}
