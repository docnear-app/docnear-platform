import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Route config ──────────────────────────────────────────────────────────────
const PATIENT_ROUTES = ['/patient'];
const DOCTOR_ROUTES = ['/doctor'];
const ADMIN_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/auth', '/get-started'];

type UserRole = 'patient' | 'doctor' | 'admin' | 'super_admin';

function getRole(request: NextRequest): UserRole | null {
  // Auth store sets `docnear-role` cookie on login, clears on logout.
  // Middleware can't access localStorage — this cookie is the bridge.
  const role = request.cookies.get('docnear-role')?.value;
  return role ? (role as UserRole) : null;
}

function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case 'doctor':
      return '/doctor/dashboard';
    case 'admin':
    case 'super_admin':
      return '/admin/dashboard';
    default:
      return '/patient/dashboard';
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = getRole(request);
  const isAuthenticated = !!role;

  // ── Authenticated user hitting an auth page → send to their dashboard ──────
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(getDashboardUrl(role!), request.url));
    }
    return NextResponse.next();
  }

  // ── Protect patient routes ─────────────────────────────────────────────────
  if (PATIENT_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isAuthenticated) return NextResponse.redirect(new URL('/auth/patient', request.url));
    if (role !== 'patient')
      return NextResponse.redirect(new URL(getDashboardUrl(role!), request.url));
  }

  // ── Protect doctor routes ──────────────────────────────────────────────────
  if (DOCTOR_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isAuthenticated) return NextResponse.redirect(new URL('/auth/doctor', request.url));
    if (role !== 'doctor')
      return NextResponse.redirect(new URL(getDashboardUrl(role!), request.url));
  }

  // ── Protect admin routes ───────────────────────────────────────────────────
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isAuthenticated) return NextResponse.redirect(new URL('/auth/admin', request.url));
    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.redirect(new URL(getDashboardUrl(role!), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/patient/:path*', '/doctor/:path*', '/admin/:path*', '/auth/:path*', '/get-started'],
};
