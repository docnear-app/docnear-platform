'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PhoneInput } from '@/components/common/auth/PhoneInput';
import { PasswordInput } from '@/components/common/auth/PasswordInput';
import { OtpInput } from '@/components/common/auth/OtpInput';
import { DevOtpBanner } from '@/components/common/auth/DevOtpBanner';
import { FormField } from '@/components/common/auth/FormField';
import { ArrowLeft, ArrowRight, Smartphone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DoctorLoginMethod } from '../hooks/use-doctor-auth.hook';

interface DoctorLoginFlowProps {
  // Shared
  loginMethod: DoctorLoginMethod;
  onMethodChange: (m: DoctorLoginMethod) => void;
  loading: boolean;
  error: string;
  onBack: () => void;
  footerSlot?: React.ReactNode;
  // OTP
  mobile: string;
  onMobileChange: (v: string) => void;
  otp: string[];
  onOtpChange: (v: string[]) => void;
  otpSent: boolean;
  devOtp: string;
  onSendOtp: () => void;
  onVerifyOtp: (otp?: string) => void;
  // Email+Password
  emailLogin: string;
  onEmailLoginChange: (v: string) => void;
  passwordLogin: string;
  onPasswordLoginChange: (v: string) => void;
  onLoginWithEmail: () => void;
}

export function DoctorLoginFlow({
  loginMethod,
  onMethodChange,
  loading,
  error,
  onBack,
  footerSlot,
  mobile,
  onMobileChange,
  otp,
  onOtpChange,
  otpSent,
  devOtp,
  onSendOtp,
  onVerifyOtp,
  emailLogin,
  onEmailLoginChange,
  passwordLogin,
  onPasswordLoginChange,
  onLoginWithEmail,
}: DoctorLoginFlowProps) {
  return (
    <div className="auth-step-enter space-y-5">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Doctor Login</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to your DocNear doctor account.</p>
      </div>

      {/* Method tabs */}
      <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1">
        <button
          onClick={() => onMethodChange('otp')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all',
            loginMethod === 'otp'
              ? 'bg-white shadow-sm text-gray-900 border border-gray-200'
              : 'text-gray-500 hover:text-gray-700',
          )}
        >
          <Smartphone size={14} />
          Mobile OTP
        </button>
        <button
          onClick={() => onMethodChange('email')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all',
            loginMethod === 'email'
              ? 'bg-white shadow-sm text-gray-900 border border-gray-200'
              : 'text-gray-500 hover:text-gray-700',
          )}
        >
          <Mail size={14} />
          Email & Password
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ── Mobile OTP flow ── */}
      {loginMethod === 'otp' && (
        <div className="space-y-4">
          {!otpSent ? (
            <>
              <FormField label="Registered Mobile Number" htmlFor="doc-login-mobile">
                <PhoneInput
                  value={mobile}
                  onChange={onMobileChange}
                  onEnter={mobile.length === 10 ? onSendOtp : undefined}
                  autoFocus
                  hasError={!!error}
                />
              </FormField>
              <Button
                onClick={onSendOtp}
                disabled={mobile.length !== 10 || loading}
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
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                OTP sent to <span className="font-semibold text-gray-700">+91 {mobile}</span>
              </p>
              {devOtp && <DevOtpBanner otp={devOtp} label="Login OTP" />}
              <div className="py-1">
                <OtpInput
                  value={otp}
                  onChange={onOtpChange}
                  onComplete={(code) => onVerifyOtp(code)}
                  hasError={!!error}
                  disabled={loading}
                />
              </div>
              <Button
                onClick={() => onVerifyOtp()}
                disabled={!otp.every(Boolean) || loading}
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
                    Verify & Login <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </>
          )}
        </div>
      )}

      {/* ── Email + Password flow ── */}
      {loginMethod === 'email' && (
        <div className="space-y-4">
          <FormField label="Email Address" htmlFor="doc-email-login">
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                id="doc-email-login"
                type="email"
                value={emailLogin}
                onChange={(e) => onEmailLoginChange(e.target.value)}
                placeholder="doctor@gmail.com"
                className="pl-8"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && onLoginWithEmail()}
              />
            </div>
          </FormField>

          <FormField label="Password" htmlFor="doc-password-login">
            <PasswordInput
              id="doc-password-login"
              value={passwordLogin}
              onChange={(e) => onPasswordLoginChange((e.target as HTMLInputElement).value)}
              placeholder="Your password"
              hasError={!!error && error.toLowerCase().includes('password')}
              onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && onLoginWithEmail()}
            />
          </FormField>

          <Button
            onClick={onLoginWithEmail}
            disabled={!emailLogin || !passwordLogin || loading}
            className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-sm"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In <ArrowRight size={16} />
              </span>
            )}
          </Button>
        </div>
      )}

      {footerSlot && <div className="mt-2">{footerSlot}</div>}
    </div>
  );
}
