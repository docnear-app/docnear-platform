'use client';

import { AuthNav } from '@/components/common/nav/AuthNav';

interface TrustPoint {
  icon: React.ReactNode;
  text: string;
}

interface AuthLayoutProps {
  children: React.ReactNode;
  brandHeading: string;
  brandSubtext: string;
  trustPoints?: TrustPoint[];
  brandNote?: string;
  variant?: 'patient' | 'doctor' | 'admin';
}

const DEFAULT_TRUST: TrustPoint[] = [
  { icon: <ShieldIcon />, text: 'KYC-verified doctors only' },
  { icon: <CalendarIcon />, text: 'Instant appointment booking' },
  { icon: <LockIcon />, text: 'Your data is always private' },
];

export function AuthLayout({
  children,
  brandHeading,
  brandSubtext,
  trustPoints = DEFAULT_TRUST,
  brandNote,
  variant = 'patient',
}: AuthLayoutProps) {
  return (
    /*
     * Full viewport height, flex-col.
     * The nav takes h-16 (64px), the body fills the rest.
     * overflow-hidden on the root prevents any page-level scrollbar.
     * Only the right form panel scrolls internally.
     */
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* ── Shared auth navbar ── */}
      <AuthNav />

      {/* ── Body: left brand + right form, fills remaining height ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ── Left brand panel — hidden on mobile, visible lg+ ── */}
        <div className="auth-brand-panel auth-grid-dots hidden lg:flex flex-col justify-between w-[420px] xl:w-[480px] shrink-0 p-10 xl:p-14 overflow-hidden">
          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Top: portal badge */}
            <div>
              {variant === 'patient' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-teal-300 bg-teal-900/60 border border-teal-700/50 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Patient Portal
                </span>
              )}
              {variant === 'doctor' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-teal-300 bg-teal-900/60 border border-teal-700/50 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Doctor Portal
                </span>
              )}
              {variant === 'admin' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-teal-300 bg-teal-900/60 border border-teal-700/50 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Admin Portal
                </span>
              )}
            </div>

            {/* Middle: heading + trust points */}
            <div className="max-w-sm">
              <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight mb-3">
                {brandHeading}
              </h2>
              <p className="text-teal-200/80 text-base leading-relaxed mb-8">{brandSubtext}</p>

              <div className="space-y-4">
                {trustPoints.map((pt, i) => (
                  <div key={i} className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-800/60 border border-teal-700/40 flex items-center justify-center shrink-0 text-teal-300">
                      {pt.icon}
                    </div>
                    <span className="text-sm text-teal-100/90 font-medium">{pt.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: note + copyright */}
            <div>
              {brandNote && (
                <p className="text-xs text-teal-400/60 leading-relaxed mb-2">{brandNote}</p>
              )}
              <p className="text-xs text-teal-500/40">
                © {new Date().getFullYear()} DocNear. Serving Madhya Pradesh.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        {/*
         * overflow-y-auto: ONLY this panel scrolls.
         * The left brand panel and navbar stay perfectly fixed.
         * min-h-0 lets flex children shrink below content size.
         */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0 bg-white">
          {/* Mobile: top gradient strip (replaces hidden brand panel) */}
          <div className="lg:hidden auth-brand-panel auth-grid-dots px-6 py-8">
            <div className="relative z-10">
              {variant === 'patient' && (
                <span className="inline-flex items-center gap-1.5 mb-3 text-xs font-semibold tracking-widest uppercase text-teal-300 bg-teal-900/60 border border-teal-700/50 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Patient Portal
                </span>
              )}
              {variant === 'doctor' && (
                <span className="inline-flex items-center gap-1.5 mb-3 text-xs font-semibold tracking-widest uppercase text-teal-300 bg-teal-900/60 border border-teal-700/50 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Doctor Portal
                </span>
              )}
              <h2 className="text-2xl font-bold text-white leading-tight">{brandHeading}</h2>
              <p className="mt-1 text-sm text-teal-200/70">{brandSubtext}</p>
            </div>
          </div>

          {/* Form body — vertically centred, grows to fill */}
          <div className="flex-1 flex items-center justify-center px-6 py-10 xl:px-12">
            <div className="w-full max-w-md">{children}</div>
          </div>

          {/* Legal footer — sticks to bottom of scroll container */}
          <div className="px-6 py-5 text-center shrink-0 border-t border-gray-50">
            <p className="text-xs text-gray-400">
              By continuing, you agree to DocNear&apos;s{' '}
              <a href="/terms" className="underline hover:text-gray-600">
                Terms
              </a>{' '}
              and{' '}
              <a href="/privacy" className="underline hover:text-gray-600">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Inline icons ─────────────────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
