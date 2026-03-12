import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IUser, AuthTokens, UserRole } from '@/types';

interface AuthState {
  user: IUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;

  login: (user: IUser, tokens: AuthTokens) => void;
  logout: () => void;
  setTokens: (tokens: AuthTokens) => void;
  updateUser: (partial: Partial<IUser>) => void;
  setLoading: (v: boolean) => void;
  setHasHydrated: (value: boolean) => void;

  hasRole: (role: UserRole) => boolean;
  isPatient: () => boolean;
  isDoctor: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,

      login: (user, tokens) => set({ user, tokens, isAuthenticated: true, isLoading: false }),

      logout: () => {
        set({ user: null, tokens: null, isAuthenticated: false });
        // Also wipe the persisted Zustand key so user doesn't rehydrate after logout
        if (typeof window !== 'undefined') {
          localStorage.removeItem('docnear-auth');
        }
      },

      setTokens: (tokens) => set({ tokens }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      setLoading: (v) => set({ isLoading: v }),

      setHasHydrated: (value) => set({ hasHydrated: value }),

      hasRole: (role) => get().user?.role === role,
      isPatient: () => get().user?.role === 'patient',
      isDoctor: () => get().user?.role === 'doctor',
      isAdmin: () => get().user?.role === 'admin' || get().user?.role === 'super_admin',
    }),
    {
      name: 'docnear-auth',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : ({} as Storage),
      ),
      // Only persist user — NEVER persist tokens in localStorage
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        // Restore isAuthenticated based on persisted user
        if (state?.user) {
          state.isAuthenticated = true;
        }
      },
    },
  ),
);

export const useCurrentUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useAuthLoading = () => useAuthStore((s) => s.isLoading);
