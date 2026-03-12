'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';
import { DocNearLogo } from '@/components/common/logo/docnear-logo';
import {
  LogOut,
  User,
  Stethoscope,
  ShieldCheck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  BadgeCheck,
  Clock,
} from 'lucide-react';

interface SimpleDashboardProps {
  portalLabel: string;
  portalVariant: 'patient' | 'doctor' | 'admin';
}

const VARIANT_CONFIG = {
  patient: {
    icon: <User size={22} />,
    bgClass: 'from-teal-600 to-teal-700',
    badgeClass: 'bg-teal-100 text-teal-700',
    quickLinks: [
      { icon: <Calendar size={16} />, label: 'Book Appointment', desc: 'Coming soon' },
      { icon: <Stethoscope size={16} />, label: 'Find Doctors', desc: 'Coming soon' },
      { icon: <MapPin size={16} />, label: 'Nearby Clinics', desc: 'Coming soon' },
    ],
  },
  doctor: {
    icon: <Stethoscope size={22} />,
    bgClass: 'from-teal-700 to-teal-800',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    quickLinks: [
      { icon: <Calendar size={16} />, label: 'Appointments', desc: 'Coming soon' },
      { icon: <BadgeCheck size={16} />, label: 'KYC Status', href: '/doctor/kyc-status' },
      { icon: <User size={16} />, label: 'My Profile', desc: 'Coming soon' },
    ],
  },
  admin: {
    icon: <ShieldCheck size={22} />,
    bgClass: 'from-gray-800 to-gray-900',
    badgeClass: 'bg-amber-100 text-amber-700',
    quickLinks: [
      { icon: <BadgeCheck size={16} />, label: 'KYC Queue', href: '/admin/kyc' },
      { icon: <User size={16} />, label: 'Manage Users', desc: 'Coming soon' },
      { icon: <Clock size={16} />, label: 'Audit Logs', desc: 'Coming soon' },
    ],
  },
};

export function SimpleDashboard({ portalLabel, portalVariant }: SimpleDashboardProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const config = VARIANT_CONFIG[portalVariant];

  const handleLogout = () => {
    authService.logout({ logout });
    router.replace('/get-started');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`bg-gradient-to-r ${config.bgClass} shadow-lg`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DocNearLogo inverted size="sm" />
            <div className="w-px h-5 bg-white/20" />
            <span className="text-white/80 text-sm font-medium">{portalLabel}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                {config.icon}
              </div>
              <span className="text-white text-sm font-medium max-w-[140px] truncate">
                {user?.name ?? user?.mobile ?? 'User'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-all border border-white/20"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Welcome card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-start gap-5">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.bgClass} flex items-center justify-center text-white shrink-0`}
          >
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-gray-900">
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
              </h1>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badgeClass}`}
              >
                {user?.role ?? portalVariant}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              You are logged into your DocNear {portalLabel.toLowerCase()}.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
              {user?.mobile && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Phone size={12} className="text-teal-500" /> +91 {user.mobile}
                </span>
              )}
              {user?.email && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Mail size={12} className="text-teal-500" /> {user.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-teal-800">Dashboard under construction</p>
            <p className="text-xs text-teal-600 mt-0.5">
              Full features are being built. Use the logout button to test the auth flow.
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {config.quickLinks.map((link) => (
              <div
                key={link.label}
                onClick={() => ('href' in link && link.href ? router.push(link.href) : undefined)}
                className={`bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-3 shadow-sm transition-all ${
                  'href' in link && link.href
                    ? 'cursor-pointer hover:border-teal-300 hover:shadow-md'
                    : 'opacity-50 cursor-default'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  {link.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{link.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {'href' in link && link.href ? 'Click to open' : link.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">Sign out of DocNear</h2>
          <p className="text-sm text-gray-500 mb-4">
            Clears your session, tokens, and role cookie. Use to test the complete auth flow.
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm px-5 py-2.5 rounded-xl border border-red-200 transition-all"
          >
            <LogOut size={16} />
            Logout &amp; Clear Session
          </button>
        </div>
      </main>
    </div>
  );
}
