'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export function useAdminAuth() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmailRaw] = useState('');
  const [password, setPasswordRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setEmail = (v: string) => {
    setEmailRaw(v);
    setError('');
  };
  const setPassword = (v: string) => {
    setPasswordRaw(v);
    setError('');
  };

  const handleLogin = useCallback(async () => {
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await authService.adminLogin(email.trim(), password, { login });
      router.replace('/admin/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }, [email, password, login, router]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  };
}
