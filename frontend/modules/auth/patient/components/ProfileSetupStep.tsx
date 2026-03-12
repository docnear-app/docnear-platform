'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField } from '@/components/common/auth/FormField';
import { PasswordInput } from '@/components/common/auth/PasswordInput';
import { OtpInput } from '@/components/common/auth/OtpInput';
import { DevOtpBanner } from '@/components/common/auth/DevOtpBanner';
import { Check, Mail, MapPin, Building2 } from 'lucide-react';
import type { PatientProfileForm } from '../hooks/use-patient-auth.hook';

interface ProfileSetupStepProps {
  profile: PatientProfileForm;
  onFieldChange: <K extends keyof PatientProfileForm>(key: K, value: PatientProfileForm[K]) => void;
  onSendEmailOtp: () => void;
  onVerifyEmailOtp: () => void;
  onSubmit: () => void;
  onSkip: () => void;
  loading: boolean;
  error: string;
}

export function ProfileSetupStep({
  profile,
  onFieldChange,
  onSendEmailOtp,
  onVerifyEmailOtp,
  onSubmit,
  onSkip,
  loading,
  error,
}: ProfileSetupStepProps) {
  const canSubmit =
    profile.name.trim().length >= 2 &&
    profile.password.length >= 8 &&
    profile.password === profile.confirmPassword &&
    (!profile.email || profile.emailVerified);

  return (
    <div className="auth-step-enter space-y-5">
      {/* Heading */}
      <div>
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 mb-4">
          <span className="text-2xl">👋</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Complete your profile</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Help us personalise your experience. Fields marked optional can be filled later.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ── Required ── */}
      <div className="space-y-4 pb-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Required</p>

        {/* Full Name */}
        <FormField label="Full Name" htmlFor="name">
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
            placeholder="e.g. Rahul Sharma"
            autoFocus
          />
        </FormField>

        {/* Password */}
        <FormField label="Set Password" htmlFor="password" hint="Min 8 characters">
          <PasswordInput
            id="password"
            value={profile.password}
            onChange={(e) => onFieldChange('password', (e.target as HTMLInputElement).value)}
            placeholder="Create a strong password"
            hasError={!!error && error.toLowerCase().includes('password')}
          />
        </FormField>

        {/* Confirm password */}
        <FormField label="Confirm Password" htmlFor="confirmPassword">
          <PasswordInput
            id="confirmPassword"
            value={profile.confirmPassword}
            onChange={(e) => onFieldChange('confirmPassword', (e.target as HTMLInputElement).value)}
            placeholder="Repeat your password"
            hasError={!!profile.confirmPassword && profile.password !== profile.confirmPassword}
          />
          {profile.confirmPassword && profile.password !== profile.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords don&apos;t match</p>
          )}
        </FormField>
      </div>

      {/* ── Optional ── */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Optional — helps us show better doctors
        </p>

        {/* City */}
        <FormField label="Your City" htmlFor="city" optional>
          <div className="relative">
            <Building2
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              id="city"
              value={profile.city}
              onChange={(e) => onFieldChange('city', e.target.value)}
              placeholder="e.g. Nagda, Ratlam, Ujjain"
              className="pl-8"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">We use this to show doctors near you</p>
        </FormField>

        {/* DOB */}
        <FormField label="Date of Birth" htmlFor="dob" optional>
          <Input
            id="dob"
            type="date"
            value={profile.dob}
            onChange={(e) => onFieldChange('dob', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </FormField>

        {/* Email with inline OTP verify */}
        <FormField label="Email Address" htmlFor="email" optional>
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => {
                    onFieldChange('email', e.target.value);
                    onFieldChange('emailVerified', false);
                    onFieldChange('showEmailOtp', false);
                  }}
                  placeholder="you@example.com"
                  className="pl-8"
                  disabled={profile.emailVerified}
                />
              </div>
              {!profile.emailVerified && profile.email && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onSendEmailOtp}
                  disabled={loading}
                  className="shrink-0 border-teal-200 text-teal-700 hover:bg-teal-50"
                >
                  Verify
                </Button>
              )}
              {profile.emailVerified && (
                <div className="verified-badge shrink-0">
                  <Check size={11} strokeWidth={2.5} /> Verified
                </div>
              )}
            </div>

            {profile.showEmailOtp && !profile.emailVerified && (
              <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4 space-y-3">
                <p className="text-xs text-teal-700 font-medium">
                  Enter the 6-digit code sent to <strong>{profile.email}</strong>
                </p>
                {profile.emailDevOtp && (
                  <DevOtpBanner otp={profile.emailDevOtp} label="Email OTP" />
                )}
                <OtpInput
                  value={profile.emailOtp}
                  onChange={(v) => onFieldChange('emailOtp', v)}
                  onComplete={onVerifyEmailOtp}
                  disabled={loading}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={onVerifyEmailOtp}
                  disabled={loading || !profile.emailOtp.every(Boolean)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </Button>
              </div>
            )}
          </div>
        </FormField>

        {/* Address */}
        <FormField label="Address" htmlFor="address" optional>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => onFieldChange('address', e.target.value)}
              placeholder="e.g. Station Road, Nagda"
              className="pl-8"
            />
          </div>
        </FormField>
      </div>

      {/* Actions */}
      <div className="pt-1 space-y-3">
        <Button
          onClick={onSubmit}
          disabled={loading || !canSubmit}
          className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-sm disabled:opacity-50"
          size="lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            'Complete Registration →'
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onSkip}
          disabled={loading}
          className="w-full text-gray-400 hover:text-gray-500 text-sm"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}
