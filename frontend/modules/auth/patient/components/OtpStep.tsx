'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OtpInput } from '@/components/common/auth/OtpInput';
import { DevOtpBanner } from '@/components/common/auth/DevOtpBanner';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface OtpStepProps {
  mobile: string;
  otp: string[];
  onOtpChange: (v: string[]) => void;
  onVerify: (otp?: string) => void;
  onResend: () => void;
  onBack: () => void;
  resendTimer: number;
  loading: boolean;
  error: string;
  devOtp: string;
}

export function OtpStep({
  mobile,
  otp,
  onOtpChange,
  onVerify,
  onResend,
  onBack,
  resendTimer,
  loading,
  error,
  devOtp,
}: OtpStepProps) {
  const isFilled = otp.every(Boolean);

  return (
    <div className="auth-step-enter space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Verify your number</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          OTP sent to <span className="font-semibold text-gray-700">+91 {mobile}</span>
        </p>
      </div>

      {devOtp && <DevOtpBanner otp={devOtp} label="Mobile OTP" />}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* OTP boxes */}
      <div className="py-2">
        <OtpInput
          value={otp}
          onChange={onOtpChange}
          onComplete={(code) => onVerify(code)}
          hasError={!!error}
          disabled={loading}
        />
      </div>

      <Button
        onClick={() => onVerify()}
        disabled={!isFilled || loading}
        className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-sm"
        size="lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Verifying...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Verify OTP <ArrowRight size={16} />
          </span>
        )}
      </Button>

      {/* Resend */}
      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="text-sm text-gray-400">
            Resend OTP in{' '}
            <span className="font-semibold text-gray-600 tabular-nums">{resendTimer}s</span>
          </p>
        ) : (
          <button
            onClick={onResend}
            disabled={loading}
            className="text-sm font-semibold text-teal-600 hover:text-teal-700 disabled:opacity-50"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
