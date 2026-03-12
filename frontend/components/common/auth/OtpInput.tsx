'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  value: string[]; // array of 6 single chars
  onChange: (value: string[]) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  length?: number;
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  hasError = false,
  length = 6,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focusNext = (index: number) => {
    if (index < length - 1) refs.current[index + 1]?.focus();
  };

  const focusPrev = (index: number) => {
    if (index > 0) refs.current[index - 1]?.focus();
  };

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...value];
    next[index] = val.slice(-1); // take last char
    onChange(next);

    if (val) {
      focusNext(index);
      // Check complete
      const filled = next.filter(Boolean);
      if (filled.length === length && onComplete) {
        onComplete(next.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        const next = [...value];
        next[index] = '';
        onChange(next);
      } else {
        focusPrev(index);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusPrev(index);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusNext(index);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill('');
    pasted.split('').forEach((char, i) => {
      next[i] = char;
    });
    onChange(next);
    // Focus last filled or next empty
    const lastFilled = Math.min(pasted.length, length - 1);
    refs.current[lastFilled]?.focus();
    if (pasted.length === length && onComplete) {
      onComplete(pasted);
    }
  };

  return (
    <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          aria-label={`OTP digit ${i + 1}`}
          className={cn(
            'otp-box',
            value[i] && !hasError && 'filled',
            hasError && 'border-red-400 bg-red-50 text-red-700',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          style={{ caretColor: 'transparent' }}
        />
      ))}
    </div>
  );
}
