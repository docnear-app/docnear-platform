'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PhoneInput } from '@/components/common/auth/PhoneInput';
import { FormField } from '@/components/common/auth/FormField';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface MobileStepProps {
  mobile: string;
  onMobileChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}

export function MobileStep({ mobile, onMobileChange, onSubmit, loading, error }: MobileStepProps) {
  const isValid = mobile.length === 10;

  return (
    <div className="auth-fade-in space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Book your appointment</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Enter your mobile number — we&apos;ll send you a quick OTP.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FormField label="Mobile Number" htmlFor="mobile">
        <PhoneInput
          value={mobile}
          onChange={onMobileChange}
          onEnter={isValid ? onSubmit : undefined}
          autoFocus
          hasError={!!error}
        />
      </FormField>

      <Button
        onClick={onSubmit}
        disabled={!isValid || loading}
        className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-sm"
        size="lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending OTP...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Get OTP <ArrowRight size={16} />
          </span>
        )}
      </Button>

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="flex-1 border-t border-gray-100" />
        <span className="px-3 text-xs text-gray-400">or</span>
        <div className="flex-1 border-t border-gray-100" />
      </div>

      {/* Doctor cross-link */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-700">Are you a doctor?</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Join free, get verified, grow your practice.
          </p>
        </div>
        <Link
          href="/auth/doctor"
          className="shrink-0 text-sm font-semibold text-teal-600 hover:text-teal-700 whitespace-nowrap flex items-center gap-1"
        >
          Register <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
