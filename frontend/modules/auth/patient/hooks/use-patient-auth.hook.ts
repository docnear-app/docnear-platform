'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import type { IUser, AuthTokens } from '@/types';

export type PatientStep = 'mobile' | 'otp' | 'profile';

export interface PatientProfileForm {
  name: string;
  dob: string;
  email: string;
  emailOtp: string[];
  emailVerified: boolean;
  showEmailOtp: boolean;
  emailDevOtp: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

function getRoleDashboard(role: string, kycStatus?: string, isListed?: boolean): string {
  switch (role) {
    case 'doctor':
      return kycStatus === 'approved' && isListed ? '/doctor/dashboard' : '/doctor/kyc-status';
    case 'admin':
    case 'super_admin':
      return '/admin/dashboard';
    default:
      return '/patient/dashboard';
  }
}

export function usePatientAuth() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [step, setStep] = useState<PatientStep>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [devOtp, setDevOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const [profile, setProfile] = useState<PatientProfileForm>({
    name: '',
    dob: '',
    email: '',
    emailOtp: Array(6).fill(''),
    emailVerified: false,
    showEmailOtp: false,
    emailDevOtp: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setProfileField = useCallback(
    <K extends keyof PatientProfileForm>(key: K, value: PatientProfileForm[K]) => {
      setProfile((prev) => ({ ...prev, [key]: value }));
      setError('');
    },
    [],
  );

  const startResendTimer = useCallback((seconds = 30) => {
    setResendTimer(seconds);
    timerRef.current = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const sendOtp = useCallback(async () => {
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authService.sendMobileOtp(mobile);
      if (res.devOtp) setDevOtp(res.devOtp);
      setStep('otp');
      startResendTimer();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  }, [mobile, startResendTimer]);

  const verifyOtp = useCallback(
    async (otpValue?: string) => {
      const code = otpValue ?? otp.join('');
      if (code.length !== 6) {
        setError('Please enter the complete 6-digit OTP.');
        return;
      }
      setError('');
      setLoading(true);
      try {
        const res = await authService.verifyMobileOtp(mobile, code);
        authService.setRoleCookie(res.user.role);
        login(res.user as IUser, res.tokens as AuthTokens);

        if (res.isNewUser && res.user.role === 'patient') {
          setStep('profile');
        } else {
          router.replace(getRoleDashboard(res.user.role, res.kycStatus, res.isListed));
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Invalid OTP.');
        setOtp(Array(6).fill(''));
      } finally {
        setLoading(false);
      }
    },
    [mobile, otp, login, router],
  );

  const sendEmailOtp = useCallback(async () => {
    if (!profile.email || !/\S+@\S+\.\S+/.test(profile.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authService.sendEmailOtp(profile.email);
      if (res.devOtp) setProfileField('emailDevOtp', res.devOtp);
      setProfileField('showEmailOtp', true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send email OTP.');
    } finally {
      setLoading(false);
    }
  }, [profile.email, setProfileField]);

  const verifyEmailOtp = useCallback(async () => {
    const code = profile.emailOtp.join('');
    if (code.length !== 6) {
      setError('Enter the 6-digit email OTP.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const verified = await authService.verifyEmailOtp(profile.email, code);
      if (!verified) {
        setError('Email OTP verification failed. Please try again.');
        setProfileField('emailOtp', Array(6).fill(''));
        return;
      }
      setProfileField('emailVerified', true);
      setProfileField('showEmailOtp', false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email OTP.');
      setProfileField('emailOtp', Array(6).fill(''));
    } finally {
      setLoading(false);
    }
  }, [profile.email, profile.emailOtp, setProfileField]);

  const completeProfile = useCallback(async () => {
    if (!profile.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!profile.password || profile.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (profile.password !== profile.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (profile.email && !profile.emailVerified) {
      setError('Please verify your email before continuing.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await authService.completePatientProfile(
        {
          name: profile.name.trim(),
          dob: profile.dob || undefined,
          email: profile.email || undefined,
          emailOtp: profile.email && profile.emailVerified ? profile.emailOtp.join('') : undefined,
          address: profile.address || undefined,
          city: profile.city || undefined,
          password: profile.password,
        },
        { login },
      );
      router.replace('/patient/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not save profile.');
    } finally {
      setLoading(false);
    }
  }, [profile, login, router]);

  const skipProfile = useCallback(() => {
    router.replace('/patient/dashboard');
  }, [router]);

  return {
    step,
    setStep,
    mobile,
    setMobile: (v: string) => {
      setMobile(v);
      setError('');
    },
    otp,
    setOtp,
    devOtp,
    resendTimer,
    profile,
    setProfileField,
    loading,
    error,
    setError,
    sendOtp,
    verifyOtp,
    sendEmailOtp,
    verifyEmailOtp,
    completeProfile,
    skipProfile,
  };
}
