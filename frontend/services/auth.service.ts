/**
 * AuthService — orchestrates authentication flows.
 *
 * Sits between UI hooks and authApi. Handles:
 * - Role cookie management
 * - Zustand store updates
 * - Error normalisation
 * - Route cookie for proxy.ts middleware
 */

import { authApi } from '@/lib/api/auth.api';
import type { DoctorRegisterPayload, PatientCompleteProfilePayload } from '@/lib/api/auth.api';
import { storageService, STORAGE_KEYS } from './storage.service';
import type { IUser, AuthTokens } from '@/types';

// ─── Helper: set role cookie for proxy.ts middleware ─────────────────────────

function setRoleCookie(role: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `docnear-role=${role}; path=/; max-age=604800; SameSite=Lax`;
}

function clearRoleCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = 'docnear-role=; path=/; max-age=0';
}

// ─── Error normalisation ──────────────────────────────────────────────────────

function extractMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  return fallback;
}

// ─── AuthService class ────────────────────────────────────────────────────────

class AuthService {
  // ── Cookie helpers (public so hooks can call without duplicating) ───────────

  setRoleCookie(role: string) {
    setRoleCookie(role);
  }

  clearRoleCookie() {
    clearRoleCookie();
  }

  // ── Mobile OTP ─────────────────────────────────────────────────────────────

  async sendMobileOtp(mobile: string): Promise<{ devOtp?: string }> {
    try {
      const res = await authApi.sendMobileOtp(mobile);
      storageService.set(STORAGE_KEYS.LAST_MOBILE, mobile);
      return { devOtp: res.devOtp };
    } catch (err) {
      throw new Error(extractMessage(err, 'Failed to send OTP. Please try again.'));
    }
  }

  async verifyMobileOtp(mobile: string, otp: string) {
    try {
      const res = await authApi.verifyMobileOtp(mobile, otp);
      return res;
    } catch (err) {
      throw new Error(extractMessage(err, 'Invalid OTP. Please try again.'));
    }
  }

  // ── Email OTP ──────────────────────────────────────────────────────────────

  async sendEmailOtp(email: string): Promise<{ devOtp?: string }> {
    try {
      const res = await authApi.sendEmailOtp(email);
      return { devOtp: res.devOtp };
    } catch (err) {
      throw new Error(extractMessage(err, 'Failed to send email OTP. Check email address.'));
    }
  }

  async verifyEmailOtp(email: string, otp: string): Promise<boolean> {
    try {
      const res = await authApi.verifyEmailOtp(email, otp);
      return res.verified;
    } catch (err) {
      throw new Error(extractMessage(err, 'Invalid email OTP. Please try again.'));
    }
  }

  // ── Patient ────────────────────────────────────────────────────────────────

  async completePatientProfile(
    payload: PatientCompleteProfilePayload,
    callbacks: { login: (user: IUser, tokens: AuthTokens) => void },
  ) {
    try {
      const res = await authApi.completePatientProfile(payload);
      setRoleCookie(res.user.role);
      callbacks.login(res.user as IUser, res.tokens as AuthTokens);
      return res;
    } catch (err) {
      throw new Error(extractMessage(err, 'Could not save profile. Please try again.'));
    }
  }

  // ── Doctor ────────────────────────────────────────────────────────────────

  async registerDoctor(
    payload: DoctorRegisterPayload,
    callbacks: { login: (user: IUser, tokens: AuthTokens) => void },
  ) {
    try {
      const res = await authApi.registerDoctor(payload);
      setRoleCookie(res.user.role);
      callbacks.login(res.user as IUser, res.tokens as AuthTokens);
      storageService.remove(STORAGE_KEYS.DOCTOR_REGISTER_DRAFT);
      return res;
    } catch (err) {
      throw new Error(extractMessage(err, 'Registration failed. Please check your details.'));
    }
  }

  async doctorLoginWithEmail(
    email: string,
    password: string,
    callbacks: { login: (user: IUser, tokens: AuthTokens) => void },
  ) {
    try {
      const res = await authApi.doctorLoginWithEmail(email, password);
      setRoleCookie(res.user.role);
      callbacks.login(res.user as IUser, res.tokens as AuthTokens);
      return res;
    } catch (err) {
      throw new Error(extractMessage(err, 'Invalid email or password. Please try again.'));
    }
  }

  // ── Admin ─────────────────────────────────────────────────────────────────

  async adminLogin(
    email: string,
    password: string,
    callbacks: { login: (user: IUser, tokens: AuthTokens) => void },
  ) {
    try {
      const res = await authApi.adminLogin(email, password);
      setRoleCookie(res.user.role);
      callbacks.login(res.user as IUser, res.tokens as AuthTokens);
      return res;
    } catch (err) {
      throw new Error(extractMessage(err, 'Invalid credentials. Please try again.'));
    }
  }

  // ── Logout ─────────────────────────────────────────────────────────────────

  logout(callbacks: { logout: () => void }) {
    clearRoleCookie();
    storageService.clearAll();
    callbacks.logout();
    // Fire-and-forget backend logout
    void authApi.logout().catch(() => null);
  }
}

export const authService = new AuthService();
