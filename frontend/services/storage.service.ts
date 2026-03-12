/**
 * StorageService — encrypted localStorage wrapper.
 *
 * Uses a simple XOR + base64 scheme for basic obfuscation of stored data.
 * Not cryptographic-grade, but prevents plain-text PII in localStorage.
 * Replace with AES (crypto-js) in production before launch.
 *
 * Pattern inspired by Ablespace's localstorage.service.ts.
 */

const KEY_PREFIX = 'dn:';
const SALT = process.env.NEXT_PUBLIC_STORAGE_SALT ?? 'docnear_salt_2025';

function xorEncode(str: string): string {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    out += String.fromCharCode(str.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
  }
  try {
    return btoa(out);
  } catch {
    return btoa(encodeURIComponent(out));
  }
}

function xorDecode(encoded: string): string {
  try {
    const str = atob(encoded);
    let out = '';
    for (let i = 0; i < str.length; i++) {
      out += String.fromCharCode(str.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
    }
    return out;
  } catch {
    return '';
  }
}

function isClient() {
  return typeof window !== 'undefined';
}

class StorageService {
  /** Store a value (serialised to JSON, then encoded). */
  set<T>(key: string, value: T): void {
    if (!isClient()) return;
    try {
      const json = JSON.stringify(value);
      const encoded = xorEncode(json);
      localStorage.setItem(`${KEY_PREFIX}${key}`, encoded);
    } catch {
      // Ignore quota or serialisation errors
    }
  }

  /** Retrieve a stored value. Returns null if missing or corrupt. */
  get<T>(key: string): T | null {
    if (!isClient()) return null;
    try {
      const raw = localStorage.getItem(`${KEY_PREFIX}${key}`);
      if (!raw) return null;
      const json = xorDecode(raw);
      if (!json) return null;
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  }

  /** Remove a specific key. */
  remove(key: string): void {
    if (!isClient()) return;
    localStorage.removeItem(`${KEY_PREFIX}${key}`);
  }

  /** Clear all DocNear keys (on logout). */
  clearAll(): void {
    if (!isClient()) return;
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(KEY_PREFIX)) toRemove.push(k);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  }

  /** Check if a key exists. */
  has(key: string): boolean {
    if (!isClient()) return false;
    return localStorage.getItem(`${KEY_PREFIX}${key}`) !== null;
  }
}

// Singleton — one instance across the app
export const storageService = new StorageService();

// Typed keys for type-safe access
export const STORAGE_KEYS = {
  AUTH_USER: 'auth.user',
  LAST_MOBILE: 'auth.last_mobile',
  ONBOARDING_STEP: 'auth.onboarding_step',
  DOCTOR_REGISTER_DRAFT: 'auth.doctor_register_draft',
} as const;
