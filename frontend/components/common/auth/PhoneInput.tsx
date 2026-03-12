'use client';

import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

export function PhoneInput({
  value,
  onChange,
  onEnter,
  disabled = false,
  hasError = false,
  autoFocus = false,
  placeholder = '98765 43210',
}: PhoneInputProps) {
  return (
    <div
      className={cn(
        'flex rounded-lg border bg-white transition-all duration-150',
        'focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20',
        hasError
          ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400/20'
          : 'border-gray-200',
        disabled && 'opacity-50 bg-gray-50',
      )}
    >
      <div className="phone-prefix rounded-l-lg border-r border-gray-200 bg-gray-50">
        <span className="text-base">🇮🇳</span>
        <span className="text-sm font-semibold text-gray-600">+91</span>
      </div>
      <input
        type="tel"
        inputMode="numeric"
        maxLength={10}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
        onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={cn(
          'flex-1 border-none outline-none px-3 py-2.5 bg-transparent',
          'text-base font-semibold text-gray-900 tracking-widest font-mono',
          'placeholder:text-gray-400 placeholder:font-normal placeholder:tracking-normal',
          'rounded-r-lg',
        )}
        aria-label="Mobile number"
      />
    </div>
  );
}
