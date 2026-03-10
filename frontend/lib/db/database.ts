/**
 * RxDB offline-first client-side database
 *
 * Single-app architecture:
 *  - doctor routes:  sync appointments (today) + offline patient queue
 *  - patient routes: sync appointments (upcoming) + medical report list + doctor cache
 *  - admin routes:   no RxDB sync by default (prefer real-time server data)
 *
 * Sync strategy:
 *  - Pull replication: server → client (CouchDB-compatible endpoint from NestJS)
 *  - Push replication: client → server (for offline patient queue only)
 *
 * Usage in frontend app:
 *   import { initDb, getDb } from '@/lib/db/database';
 *   await initDb('doctor');
 *   const db = getDb();
 */

import { createRxDatabase, addRxPlugin, type RxDatabase, type RxCollection } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import {
  appointmentSchema,
  doctorCacheSchema,
  medicalReportSchema,
  offlinePatientSchema,
} from '../schemas/schemas';

// Register plugins
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationPlugin);

// ─── Database Types ────────────────────────────────────────────────────────────

export type AppRole = 'doctor' | 'patient';

export type DocNearDoctorDB = RxDatabase<{
  appointments: RxCollection;
  offlinePatients: RxCollection;
}>;

export type DocNearPatientDB = RxDatabase<{
  appointments: RxCollection;
  medicalReports: RxCollection;
  doctorCache: RxCollection;
}>;

// ─── Singleton instance ────────────────────────────────────────────────────────

let dbInstance: DocNearDoctorDB | DocNearPatientDB | null = null;

function resolveApiBase(): string {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;

  const fromEnv = env?.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv;

  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:5000/api/v1`;
  }

  return 'http://localhost:5000/api/v1';
}

// ─── Init DB ───────────────────────────────────────────────────────────────────

export async function initDb(role: AppRole): Promise<void> {
  if (dbInstance) return; // already initialized

  if (typeof window === 'undefined') {
    throw new Error('RxDB must only be initialized on the client side.');
  }

  if (role === 'doctor') {
    const db = await createRxDatabase<DocNearDoctorDB['collections']>({
      name: 'docnear_doctor',
      storage: getRxStorageDexie(),
      ignoreDuplicate: true,
    });

    await db.addCollections({
      appointments: { schema: appointmentSchema },
      offlinePatients: { schema: offlinePatientSchema },
    });

    dbInstance = db as unknown as DocNearDoctorDB;
  } else {
    const db = await createRxDatabase<DocNearPatientDB['collections']>({
      name: 'docnear_patient',
      storage: getRxStorageDexie(),
      ignoreDuplicate: true,
    });

    await db.addCollections({
      appointments: { schema: appointmentSchema },
      medicalReports: { schema: medicalReportSchema },
      doctorCache: { schema: doctorCacheSchema },
    });

    dbInstance = db as unknown as DocNearPatientDB;
  }
}

export async function closeDb(): Promise<void> {
  if (!dbInstance) return;
  await dbInstance.close();
  dbInstance = null;
}

export function getDb(): DocNearDoctorDB | DocNearPatientDB {
  if (!dbInstance) throw new Error('DB not initialized. Call initDb() first.');
  return dbInstance;
}

export function getDoctorDb(): DocNearDoctorDB {
  return getDb() as DocNearDoctorDB;
}

export function getPatientDb(): DocNearPatientDB {
  return getDb() as DocNearPatientDB;
}

// ─── Sync Manager ─────────────────────────────────────────────────────────────

const API_BASE = resolveApiBase();

function authFetch(authToken: string): typeof fetch {
  return (input, init) =>
    fetch(input, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${authToken}`,
      },
    });
}

/**
 * startSync — Starts pull replication for the given collection.
 * The NestJS backend exposes a CouchDB-compatible replication endpoint.
 *
 * Call this after initDb() with the user's auth token.
 */
export async function startDoctorSync(doctorId: string, authToken: string) {
  if (!authToken?.trim()) {
    throw new Error('Cannot start doctor sync without an auth token.');
  }

  const db = getDoctorDb();

  // Pull appointments for doctor. Fine-grained filtering should be done at endpoint level.
  replicateCouchDB({
    replicationIdentifier: `doctor-appointments-${doctorId}`,
    collection: db.appointments,
    url: `${API_BASE}/replication/appointments/doctor/${doctorId}/`,
    fetch: authFetch(authToken),
    live: true,
    waitForLeadership: false,
    retryTime: 15_000,
    pull: { batchSize: 60 },
  });

  // Push offline patients when network comes back
  replicateCouchDB({
    replicationIdentifier: `doctor-offline-patients-${doctorId}`,
    collection: db.offlinePatients,
    url: `${API_BASE}/replication/offline-patients/${doctorId}/`,
    fetch: authFetch(authToken),
    live: true,
    waitForLeadership: false,
    retryTime: 15_000,
    push: { batchSize: 60 },
  });
}

export async function startPatientSync(patientId: string, authToken: string) {
  if (!authToken?.trim()) {
    throw new Error('Cannot start patient sync without an auth token.');
  }

  const db = getPatientDb();

  // Pull upcoming appointments
  replicateCouchDB({
    replicationIdentifier: `patient-appointments-${patientId}`,
    collection: db.appointments,
    url: `${API_BASE}/replication/appointments/patient/${patientId}/`,
    fetch: authFetch(authToken),
    live: true,
    waitForLeadership: false,
    retryTime: 15_000,
    pull: { batchSize: 60 },
  });

  // Pull medical reports list (not the files — just metadata)
  replicateCouchDB({
    replicationIdentifier: `patient-reports-${patientId}`,
    collection: db.medicalReports,
    url: `${API_BASE}/replication/reports/${patientId}/`,
    fetch: authFetch(authToken),
    live: true,
    waitForLeadership: false,
    retryTime: 15_000,
    pull: { batchSize: 60 },
  });
}
