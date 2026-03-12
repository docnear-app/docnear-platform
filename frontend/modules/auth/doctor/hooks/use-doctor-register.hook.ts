'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { storageService, STORAGE_KEYS } from '@/services/storage.service';
import { useAuthStore } from '@/stores/auth.store';

export type RegisterStep = 1 | 2 | 3;

export interface DoctorRegisterForm {
  // Step 1 — Personal
  name: string;
  mobile: string;
  mobileOtp: string[];
  mobileVerified: boolean;
  showMobileOtp: boolean;
  mobileDevOtp: string;
  email: string;
  emailOtp: string[];
  emailVerified: boolean;
  showEmailOtp: boolean;
  emailDevOtp: string;
  password: string;
  confirmPassword: string;
  // Step 2 — Professional
  registrationNumber: string;
  qualifications: string[];
  specializations: string[];
  experience: string;
  bio: string;
  languages: string[];
  // Step 3 — Clinic
  clinicName: string;
  clinicAddress: string;
  city: string;
  pincode: string;
  consultationFee: string;
}

const INITIAL_FORM: DoctorRegisterForm = {
  name: '',
  mobile: '',
  mobileOtp: Array(6).fill(''),
  mobileVerified: false,
  showMobileOtp: false,
  mobileDevOtp: '',
  email: '',
  emailOtp: Array(6).fill(''),
  emailVerified: false,
  showEmailOtp: false,
  emailDevOtp: '',
  password: '',
  confirmPassword: '',
  registrationNumber: '',
  qualifications: [],
  specializations: [],
  experience: '',
  bio: '',
  languages: ['Hindi', 'English'],
  clinicName: '',
  clinicAddress: '',
  city: 'Nagda',
  pincode: '',
  consultationFee: '',
};

export function useDoctorRegister() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [step, setStep] = useState<RegisterStep>(1);
  const [form, setForm] = useState<DoctorRegisterForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generic field setter
  const setField = useCallback(
    <K extends keyof DoctorRegisterForm>(key: K, value: DoctorRegisterForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setError('');
    },
    [],
  );

  const toggleList = useCallback(
    (field: 'qualifications' | 'specializations' | 'languages', val: string) => {
      setForm((prev) => {
        const current = prev[field] as string[];
        return {
          ...prev,
          [field]: current.includes(val) ? current.filter((v) => v !== val) : [...current, val],
        };
      });
    },
    [],
  );

  // ── Step 1: Mobile OTP ────────────────────────────────────────────────────

  const sendMobileOtp = useCallback(async () => {
    if (form.mobile.length !== 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authService.sendMobileOtp(form.mobile);
      if (res.devOtp) setField('mobileDevOtp', res.devOtp);
      setField('showMobileOtp', true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  }, [form.mobile, setField]);

  const verifyMobileOtp = useCallback(async () => {
    const code = form.mobileOtp.join('');
    if (code.length !== 6) {
      setError('Enter the complete 6-digit OTP.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.verifyMobileOtp(form.mobile, code);
      setField('mobileVerified', true);
      setField('showMobileOtp', false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid OTP.');
      setField('mobileOtp', Array(6).fill(''));
    } finally {
      setLoading(false);
    }
  }, [form.mobile, form.mobileOtp, setField]);

  // ── Step 1: Email OTP ─────────────────────────────────────────────────────

  const sendEmailOtp = useCallback(async () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authService.sendEmailOtp(form.email);
      if (res.devOtp) setField('emailDevOtp', res.devOtp);
      setField('showEmailOtp', true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send email OTP.');
    } finally {
      setLoading(false);
    }
  }, [form.email, setField]);

  const verifyEmailOtp = useCallback(async () => {
    const code = form.emailOtp.join('');
    if (code.length !== 6) {
      setError('Enter the complete 6-digit email OTP.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const verified = await authService.verifyEmailOtp(form.email, code);
      if (!verified) {
        setError('Email OTP verification failed. Please try again.');
        setField('emailOtp', Array(6).fill(''));
        return;
      }
      setField('emailVerified', true);
      setField('showEmailOtp', false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email OTP.');
      setField('emailOtp', Array(6).fill(''));
    } finally {
      setLoading(false);
    }
  }, [form.email, form.emailOtp, setField]);

  // ── Step 1 validation ────────────────────────────────────────────────────

  const step1Valid =
    form.name.trim().length >= 2 &&
    form.mobileVerified &&
    form.emailVerified &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword;

  // ── Step 2 validation ─────────────────────────────────────────────────────

  const step2Valid =
    form.registrationNumber.trim().length >= 5 &&
    form.qualifications.length > 0 &&
    form.specializations.length > 0 &&
    form.experience.length > 0;

  // ── Step 3: Submit ────────────────────────────────────────────────────────

  const submitRegistration = useCallback(async () => {
    if (!form.city || form.pincode.length !== 6) {
      setError('City and a valid 6-digit pincode are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.registerDoctor(
        {
          name: form.name.trim(),
          mobile: form.mobile,
          mobileOtp: form.mobileOtp.join(''),
          email: form.email,
          emailOtp: form.emailOtp.join(''),
          password: form.password,
          registrationNumber: form.registrationNumber.trim(),
          qualifications: form.qualifications,
          specializations: form.specializations,
          experience: parseInt(form.experience, 10) || 0,
          bio: form.bio || undefined,
          languages: form.languages,
          clinicName: form.clinicName || undefined,
          clinicAddress: form.clinicAddress || undefined,
          city: form.city,
          pincode: form.pincode,
          consultationFee: parseInt(form.consultationFee, 10) || 0,
        },
        { login },
      );
      storageService.remove(STORAGE_KEYS.DOCTOR_REGISTER_DRAFT);
      router.replace('/doctor/kyc-status');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [form, login, router]);

  const nextStep = useCallback(() => {
    if (step === 1 && !step1Valid) return;
    if (step === 2 && !step2Valid) return;
    setStep((s) => Math.min(s + 1, 3) as RegisterStep);
    setError('');
  }, [step, step1Valid, step2Valid]);

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1) as RegisterStep);
    setError('');
  }, []);

  return {
    step,
    setStep,
    form,
    setField,
    toggleList,
    loading,
    error,
    setError,
    // Mobile OTP
    sendMobileOtp,
    verifyMobileOtp,
    // Email OTP
    sendEmailOtp,
    verifyEmailOtp,
    // Validation
    step1Valid,
    step2Valid,
    // Navigation
    nextStep,
    prevStep,
    submitRegistration,
  };
}
