import { api } from './client';
import type { IUser, AuthTokens } from '@/types';

// ─── Response types ───────────────────────────────────────────────────────────

export interface SendOtpResponse {
  message: string;
  devOtp?: string;
}

export interface LoginResponse {
  user: IUser;
  tokens: AuthTokens;
  isNewUser?: boolean;
  kycStatus?: 'pending' | 'under_review' | 'approved' | 'rejected';
  isListed?: boolean;
  message?: string;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface DoctorRegisterPayload {
  name: string;
  mobile: string;
  mobileOtp: string;
  email: string;
  emailOtp: string;
  password: string;
  registrationNumber: string;
  qualifications: string[];
  specializations: string[];
  experience: number;
  bio?: string;
  languages?: string[];
  clinicName?: string;
  clinicAddress?: string;
  city: string;
  pincode: string;
  consultationFee: number;
}

export interface PatientCompleteProfilePayload {
  name: string;
  dob?: string;
  email?: string;
  emailOtp?: string;
  address?: string;
  city?: string;
  password: string;
}

// ─── Dev-mode email OTP ───────────────────────────────────────────────────────
// In development (backend not required), email OTPs are generated locally.
// This mirrors the mobile OTP devOtp pattern — the code is shown in the
// DevOtpBanner, no email is actually sent. In production, real email is sent.

const DEV_EMAIL_OTP = '654321';
const IS_DEV = process.env.NODE_ENV === 'development';

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// ─── API methods ──────────────────────────────────────────────────────────────

export const authApi = {
  sendMobileOtp: (mobile: string) => api.post<SendOtpResponse>('/auth/otp/send', { mobile }),

  verifyMobileOtp: (mobile: string, otp: string) =>
    api.post<LoginResponse>('/auth/otp/verify', { mobile, otp }),

  // ── Email OTP — dev-mode skips network entirely ──────────────────────────
  sendEmailOtp: async (email: string): Promise<SendOtpResponse> => {
    if (IS_DEV) {
      await sleep(500); // realistic feel
      console.info(`[DocNear Dev] Email OTP for ${email}: ${DEV_EMAIL_OTP}`);
      return { message: 'Dev OTP generated (no email sent)', devOtp: DEV_EMAIL_OTP };
    }
    return api.post<SendOtpResponse>('/auth/email-otp/send', { email });
  },

  verifyEmailOtp: async (
    email: string,
    otp: string,
  ): Promise<{ verified: boolean; devOtp?: string }> => {
    if (IS_DEV) {
      await sleep(400);
      if (otp === DEV_EMAIL_OTP) return { verified: true };
      throw new Error(`Invalid email OTP. Dev code is ${DEV_EMAIL_OTP}`);
    }
    return api.post<{ verified: boolean; devOtp?: string }>('/auth/email-otp/verify', {
      email,
      otp,
    });
  },

  registerDoctor: (payload: DoctorRegisterPayload) =>
    api.post<LoginResponse>('/auth/doctor/register', payload),

  completePatientProfile: (payload: PatientCompleteProfilePayload) =>
    api.post<LoginResponse>('/auth/patient/complete-profile', payload),

  adminLogin: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/admin/login', { email, password }),

  doctorLoginWithEmail: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/doctor/login', { email, password }),

  refresh: (refreshToken: string) =>
    api.post<{ tokens: AuthTokens }>('/auth/refresh', { refreshToken }),

  logout: () => api.post<{ message: string }>('/auth/logout'),
};
