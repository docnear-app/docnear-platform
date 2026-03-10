import type { RxJsonSchema } from 'rxdb';

interface Appointment {
  id: string;
  patientId?: string;
  doctorProfileId?: string;
  offlinePatientName?: string;
  offlinePatientMobile?: string;
  appointmentDate: string;
  slotTime: string;
  type?: 'online' | 'offline';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  paymentMode?: 'online' | 'at_clinic';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  amount?: number;
  symptoms?: string;
  notes?: string;
  tokenNumber?: number;
  doctorName?: string;
  patientName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MedicalReport {
  id: string;
  patientId: string;
  appointmentId?: string;
  type: 'lab_report' | 'imaging' | 'prescription' | 'discharge_summary' | 'other';
  title: string;
  fileUrl: string;
  fileKey: string;
  mimeType?: string;
  uploadedAt?: string;
}

interface DoctorCache {
  id: string;
  name?: string;
  specializations?: string[];
  city: string;
  consultationFee?: number;
  averageRating?: number;
  totalReviews?: number;
  isListed?: boolean;
  kycStatus?: string;
  avatar?: string;
  cachedAt?: string;
}

interface OfflinePatient {
  id: string;
  doctorProfileId: string;
  name: string;
  mobile: string;
  age?: number;
  gender?: string;
  date: string;
  tokenNumber?: number;
  symptoms?: string;
  isSynced?: boolean;
  createdAt?: string;
}

// ─── Appointment Schema (shared across doctor/patient routes) ─────────────────

export const appointmentSchema: RxJsonSchema<Appointment> = {
  title: 'appointment',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', maxLength: 100 },
    patientId: { type: 'string' },
    doctorProfileId: { type: 'string' },
    offlinePatientName: { type: 'string' },
    offlinePatientMobile: { type: 'string' },
    appointmentDate: { type: 'string' },
    slotTime: { type: 'string' },
    type: { type: 'string', enum: ['online', 'offline'] },
    status: {
      type: 'string',
      enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
    },
    paymentMode: { type: 'string', enum: ['online', 'at_clinic'] },
    paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'] },
    amount: { type: 'number' },
    symptoms: { type: 'string' },
    notes: { type: 'string' },
    tokenNumber: { type: 'number' },
    doctorName: { type: 'string' },
    patientName: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  required: ['id', 'appointmentDate', 'slotTime', 'status'],
  indexes: ['appointmentDate', 'patientId', 'doctorProfileId', 'status'],
};

// ─── Medical Report Schema (patient routes) ───────────────────────────────────

export const medicalReportSchema: RxJsonSchema<MedicalReport> = {
  title: 'medical_report',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', maxLength: 100 },
    patientId: { type: 'string' },
    appointmentId: { type: 'string' },
    type: {
      type: 'string',
      enum: ['lab_report', 'imaging', 'prescription', 'discharge_summary', 'other'],
    },
    title: { type: 'string' },
    fileUrl: { type: 'string' },
    fileKey: { type: 'string' },
    mimeType: { type: 'string' },
    uploadedAt: { type: 'string' },
  },
  required: ['id', 'patientId', 'type', 'title', 'fileUrl', 'fileKey'],
  indexes: ['patientId', 'uploadedAt'],
};

// ─── Doctor Cache Schema (patient routes, offline search) ────────────────────

export const doctorCacheSchema: RxJsonSchema<DoctorCache> = {
  title: 'doctor_cache',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
    specializations: { type: 'array', items: { type: 'string' } },
    city: { type: 'string' },
    consultationFee: { type: 'number' },
    averageRating: { type: 'number' },
    totalReviews: { type: 'number' },
    isListed: { type: 'boolean' },
    kycStatus: { type: 'string' },
    avatar: { type: 'string' },
    cachedAt: { type: 'string' },
  },
  required: ['id', 'city'],
  indexes: ['city', 'averageRating'],
};

// ─── Offline Patient Queue (doctor routes, walk-in patients) ─────────────────

export const offlinePatientSchema: RxJsonSchema<OfflinePatient> = {
  title: 'offline_patient',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', maxLength: 100 },
    doctorProfileId: { type: 'string' },
    name: { type: 'string' },
    mobile: { type: 'string' },
    age: { type: 'number' },
    gender: { type: 'string' },
    date: { type: 'string' },
    tokenNumber: { type: 'number' },
    symptoms: { type: 'string' },
    isSynced: { type: 'boolean' }, // false until pushed to server
    createdAt: { type: 'string' },
  },
  required: ['id', 'doctorProfileId', 'name', 'mobile', 'date'],
  indexes: ['doctorProfileId', 'date', 'isSynced'],
};
