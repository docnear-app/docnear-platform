'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import type { IUser, AuthTokens } from '@/types';

export type DoctorLoginMethod = 'otp' | 'email';

export function useDoctorAuth() {
  const router = useRouter();
  const { login } = useAuthStore();

  // ── Shared ─────────────────────────────────────────────────────────────────
  const [loginMethod, setLoginMethod] = useState<DoctorLoginMethod>('otp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Mobile OTP ─────────────────────────────────────────────────────────────
  const [mobile, setMobileRaw] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState('');

  // ── Email + Password ───────────────────────────────────────────────────────
  const [emailLogin, setEmailLoginRaw] = useState('');
  const [passwordLogin, setPasswordLoginRaw] = useState('');

  const setMobile = (v: string) => {
    setMobileRaw(v);
    setError('');
  };
  const setEmailLogin = (v: string) => {
    setEmailLoginRaw(v);
    setError('');
  };
  const setPasswordLogin = (v: string) => {
    setPasswordLoginRaw(v);
    setError('');
  };

  // ── Redirect helper ────────────────────────────────────────────────────────
  const redirectAfterLogin = useCallback(
    (kycStatus?: string, isListed?: boolean) => {
      if (kycStatus === 'approved' && isListed) {
        router.replace('/doctor/dashboard');
      } else {
        router.replace('/doctor/kyc-status');
      }
    },
    [router],
  );

  // ── OTP: send ──────────────────────────────────────────────────────────────
  const sendOtp = useCallback(async () => {
    if (mobile.length !== 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authService.sendMobileOtp(mobile);
      if (res.devOtp) setDevOtp(res.devOtp);
      setOtpSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  }, [mobile]);

  // ── OTP: verify ────────────────────────────────────────────────────────────
  const verifyOtp = useCallback(
    async (otpValue?: string) => {
      const code = otpValue ?? otp.join('');
      if (code.length !== 6) {
        setError('Enter the complete 6-digit OTP.');
        return;
      }
      setError('');
      setLoading(true);
      try {
        const res = await authService.verifyMobileOtp(mobile, code);

        if (res.user.role !== 'doctor') {
          setError('No doctor account found for this number. Please register instead.');
          setLoading(false);
          return;
        }

        authService.setRoleCookie(res.user.role);
        login(res.user as IUser, res.tokens as AuthTokens);
        redirectAfterLogin(res.kycStatus, res.isListed);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Invalid OTP. Try again.');
        setOtp(Array(6).fill(''));
      } finally {
        setLoading(false);
      }
    },
    [mobile, otp, login, redirectAfterLogin],
  );

  // ── Email+Password: login ──────────────────────────────────────────────────
  const loginWithEmail = useCallback(async () => {
    if (!emailLogin.trim()) {
      setError('Email is required.');
      return;
    }
    if (!passwordLogin) {
      setError('Password is required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authService.doctorLoginWithEmail(emailLogin.trim(), passwordLogin, {
        login,
      });

      if (res.user.role !== 'doctor') {
        setError('No doctor account found for this email.');
        setLoading(false);
        return;
      }

      redirectAfterLogin(res.kycStatus, res.isListed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }, [emailLogin, passwordLogin, login, redirectAfterLogin]);

  const reset = useCallback(() => {
    setMobileRaw('');
    setOtp(Array(6).fill(''));
    setOtpSent(false);
    setDevOtp('');
    setEmailLoginRaw('');
    setPasswordLoginRaw('');
    setError('');
  }, []);

  return {
    loginMethod,
    setLoginMethod,
    // OTP
    mobile,
    setMobile,
    otp,
    setOtp,
    otpSent,
    devOtp,
    sendOtp,
    verifyOtp,
    // Email+Password
    emailLogin,
    setEmailLogin,
    passwordLogin,
    setPasswordLogin,
    loginWithEmail,
    // Shared
    loading,
    error,
    setError,
    reset,
  };
}
