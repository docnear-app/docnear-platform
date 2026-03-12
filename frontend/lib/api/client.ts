/**
 * API Client — all requests to the DocNear backend go through here.
 *
 * Features:
 * - Attaches Authorization header automatically from auth store
 * - Handles 401 → auto refresh → retry once
 * - Standard error shaping
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Lazy import to avoid circular deps (store imports api, api imports store)
function getStore() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useAuthStore } = require('@/stores/auth.store') as {
    useAuthStore: {
      getState: () => {
        tokens: { accessToken: string; refreshToken: string } | null;
        logout: () => void;
        setTokens: (t: { accessToken: string; refreshToken: string; expiresIn: number }) => void;
      };
    };
  };
  return useAuthStore.getState();
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function refreshTokens(): Promise<string | null> {
  const store = getStore();
  const refreshToken = store.tokens?.refreshToken;
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      store.logout();
      return null;
    }

    const data = (await res.json()) as {
      data: { tokens: { accessToken: string; refreshToken: string; expiresIn: number } };
    };
    store.setTokens(data.data.tokens);
    return data.data.tokens.accessToken;
  } catch {
    store.logout();
    return null;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts: { auth?: boolean; formData?: boolean } = {},
): Promise<T> {
  const store = getStore();
  const token = store.tokens?.accessToken;

  const headers: Record<string, string> = {};

  if (!opts.formData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    body: opts.formData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(`${BASE_URL}${path}`, fetchOptions);

  // 401 → try refresh once
  if (res.status === 401 && token) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshTokens();
      isRefreshing = false;

      if (newToken) {
        onRefreshed(newToken);
        // Retry with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryRes = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers });
        const retryData = (await retryRes.json()) as {
          success: boolean;
          data: T;
          message?: string;
        };
        if (!retryRes.ok) {
          throw new ApiError(retryRes.status, retryData.message ?? 'Request failed', retryData);
        }
        return retryData.data;
      }
    } else {
      // Wait for refresh
      return new Promise((resolve, reject) => {
        refreshSubscribers.push(async (newToken: string) => {
          try {
            headers['Authorization'] = `Bearer ${newToken}`;
            const retryRes = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers });
            const retryData = (await retryRes.json()) as {
              success: boolean;
              data: T;
              message?: string;
            };
            resolve(retryData.data);
          } catch (err) {
            reject(err);
          }
        });
      });
    }
  }

  const data = (await res.json()) as { success: boolean; data: T; message?: string };

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data.message ?? `Request failed with status ${res.status}`,
      data,
    );
  }

  return data.data;
}

// ─── Typed API methods ────────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
  upload: <T>(path: string, formData: FormData) =>
    request<T>('POST', path, formData, { formData: true }),
};
