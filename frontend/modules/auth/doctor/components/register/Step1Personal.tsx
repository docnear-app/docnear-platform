'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField } from '@/components/common/auth/FormField';
import { PhoneInput } from '@/components/common/auth/PhoneInput';
import { PasswordInput } from '@/components/common/auth/PasswordInput';
import { OtpInput } from '@/components/common/auth/OtpInput';
import { DevOtpBanner } from '@/components/common/auth/DevOtpBanner';
import { Check, Mail, SmartphoneIcon } from 'lucide-react';
import { DoctorRegisterForm } from '../../hooks/use-doctor-register.hook';

interface Step1PersonalProps {
  form: DoctorRegisterForm;
  onFieldChange: <K extends keyof DoctorRegisterForm>(key: K, value: DoctorRegisterForm[K]) => void;
  onSendMobileOtp: () => void;
  onVerifyMobileOtp: () => void;
  onSendEmailOtp: () => void;
  onVerifyEmailOtp: () => void;
  loading: boolean;
  error: string;
  isValid: boolean;
  onNext: () => void;
}

export function Step1Personal({
  form,
  onFieldChange,
  onSendMobileOtp,
  onVerifyMobileOtp,
  onSendEmailOtp,
  onVerifyEmailOtp,
  loading,
  error,
  isValid,
  onNext,
}: Step1PersonalProps) {
  return (
    <div className="auth-step-enter space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-sm text-gray-500 mt-1">Your identity — name, mobile, email.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Full Name */}
      <FormField label="Full Name (with Dr.)" htmlFor="doc-name">
        <Input
          id="doc-name"
          value={form.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          placeholder="Dr. Suresh Patel"
          autoFocus
        />
      </FormField>

      {/* Mobile + verify */}
      <FormField label="Mobile Number">
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <PhoneInput
                value={form.mobile}
                onChange={(v) => {
                  onFieldChange('mobile', v);
                  onFieldChange('mobileVerified', false);
                  onFieldChange('showMobileOtp', false);
                }}
                disabled={form.mobileVerified}
                hasError={!!error && error.toLowerCase().includes('mobile')}
              />
            </div>
            {!form.mobileVerified && (
              <Button
                type="button"
                variant="outline"
                onClick={onSendMobileOtp}
                disabled={form.mobile.length !== 10 || loading}
                className="shrink-0 border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                <SmartphoneIcon size={14} className="mr-1.5" />
                {form.showMobileOtp ? 'Resend' : 'Verify'}
              </Button>
            )}
            {form.mobileVerified && (
              <div className="verified-badge shrink-0">
                <Check size={11} strokeWidth={2.5} /> Verified
              </div>
            )}
          </div>

          {form.showMobileOtp && !form.mobileVerified && (
            <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4 space-y-3">
              <p className="text-xs text-teal-700 font-medium">
                Enter the 6-digit code sent to +91 {form.mobile}
              </p>
              {form.mobileDevOtp && <DevOtpBanner otp={form.mobileDevOtp} label="Mobile OTP" />}
              <OtpInput
                value={form.mobileOtp}
                onChange={(v) => onFieldChange('mobileOtp', v)}
                onComplete={onVerifyMobileOtp}
                disabled={loading}
              />
              <Button
                type="button"
                size="sm"
                onClick={onVerifyMobileOtp}
                disabled={loading || !form.mobileOtp.every(Boolean)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                {loading ? 'Verifying...' : 'Verify Mobile'}
              </Button>
            </div>
          )}
        </div>
      </FormField>

      {/* Email + verify */}
      <FormField label="Email Address">
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                value={form.email}
                onChange={(e) => {
                  onFieldChange('email', e.target.value);
                  onFieldChange('emailVerified', false);
                  onFieldChange('showEmailOtp', false);
                }}
                placeholder="doctor@gmail.com"
                className="pl-8"
                disabled={form.emailVerified}
              />
            </div>
            {!form.emailVerified && (
              <Button
                type="button"
                variant="outline"
                onClick={onSendEmailOtp}
                disabled={!form.email || loading}
                className="shrink-0 border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                <Mail size={14} className="mr-1.5" />
                {form.showEmailOtp ? 'Resend' : 'Verify'}
              </Button>
            )}
            {form.emailVerified && (
              <div className="verified-badge shrink-0">
                <Check size={11} strokeWidth={2.5} /> Verified
              </div>
            )}
          </div>

          {form.showEmailOtp && !form.emailVerified && (
            <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4 space-y-3">
              <p className="text-xs text-teal-700 font-medium">
                Enter the 6-digit code sent to <strong>{form.email}</strong>
              </p>
              {form.emailDevOtp && <DevOtpBanner otp={form.emailDevOtp} label="Email OTP" />}
              <OtpInput
                value={form.emailOtp}
                onChange={(v) => onFieldChange('emailOtp', v)}
                onComplete={onVerifyEmailOtp}
                disabled={loading}
              />
              <Button
                type="button"
                size="sm"
                onClick={onVerifyEmailOtp}
                disabled={loading || !form.emailOtp.every(Boolean)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>
            </div>
          )}
        </div>
      </FormField>

      {/* Password */}
      <FormField label="Password" hint="Min 8 characters">
        <PasswordInput
          value={form.password}
          onChange={(e) => onFieldChange('password', (e.target as HTMLInputElement).value)}
          placeholder="Create a strong password"
        />
      </FormField>

      {/* Confirm */}
      <FormField label="Confirm Password">
        <PasswordInput
          value={form.confirmPassword}
          onChange={(e) => onFieldChange('confirmPassword', (e.target as HTMLInputElement).value)}
          placeholder="Repeat your password"
          hasError={!!form.confirmPassword && form.password !== form.confirmPassword}
        />
        {form.confirmPassword && form.password !== form.confirmPassword && (
          <p className="text-xs text-red-500">Passwords don&apos;t match</p>
        )}
      </FormField>

      <Button
        onClick={onNext}
        disabled={!isValid || loading}
        className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-sm mt-2"
        size="lg"
      >
        Continue to Professional Details →
      </Button>
    </div>
  );
}
