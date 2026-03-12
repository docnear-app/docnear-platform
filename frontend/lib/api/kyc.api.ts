import { api } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export type KycStatus = 'pending' | 'under_review' | 'approved' | 'rejected';
export type KycDecision = 'approved' | 'rejected';

export interface KycDoctorUser {
  id: string;
  name: string | null;
  mobile: string;
  email: string | null;
}

export interface KycDoctorProfile {
  id: string;
  registrationNumber: string;
  qualifications: string[];
  specializations: string[];
  clinicName: string | null;
  city: string;
  consultationFee: number;
  user: KycDoctorUser;
}

export interface KycSubmission {
  id: string;
  doctorProfileId: string;
  doctor: KycDoctorProfile;
  medicalLicenseKey: string | null;
  degreeCertificateKey: string | null;
  govtIdKey: string | null;
  selfieKey: string | null;
  status: KycStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  adminNotes: string | null;
  submittedAt: string;
  updatedAt: string;
}

export interface ReviewKycPayload {
  decision: KycDecision;
  rejectionReason?: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/** Pending KYC queue — admin review list */
export const kycApi = {
  getPending: () => api.get<KycSubmission[]>('/kyc/pending'),

  getPendingCount: () => api.get<{ count: number }>('/kyc/pending/count'),

  getById: (id: string) => api.get<KycSubmission>(`/kyc/${id}`),

  getRecentlyReviewed: () => api.get<KycSubmission[]>('/kyc/recent'),

  review: (id: string, payload: ReviewKycPayload) =>
    api.post<KycSubmission>(`/kyc/${id}/review`, payload),
};
