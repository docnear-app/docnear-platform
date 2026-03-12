'use client';

import { AuthNav } from '@/components/common/nav/AuthNav';
import { AdminLoginForm } from './components/AdminLoginForm';
import { useAdminAuth } from './hooks/use-admin-auth.hook';

/**
 * Admin auth page — minimal centered form, no brand panel.
 * Uses the shared AuthNav so the logo & Find a Doctor button
 * are consistent with all other auth pages.
 */
export function AdminAuthPage() {
  const auth = useAdminAuth();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      {/* Shared nav */}
      <AuthNav />

      {/* Subtle dot grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />

      {/* Centred card */}
      <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto relative z-10">
        <div className="w-full max-w-sm py-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8">
            <AdminLoginForm
              email={auth.email}
              onEmailChange={auth.setEmail}
              password={auth.password}
              onPasswordChange={auth.setPassword}
              onSubmit={auth.handleLogin}
              loading={auth.loading}
              error={auth.error}
            />
          </div>
          <p className="text-center text-xs text-slate-400 mt-5">
            Having trouble? Contact your super-admin.
          </p>
        </div>
      </div>
    </div>
  );
}
