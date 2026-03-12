'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthNav } from '@/components/common/nav/AuthNav';
import {
  User,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Calendar,
  ShieldCheck,
  BadgeCheck,
  Clock,
  IndianRupee,
} from 'lucide-react';

const PATIENT_BULLETS = [
  { icon: <MapPin size={14} />, text: 'Find verified doctors near you' },
  { icon: <Calendar size={14} />, text: 'Book same-day appointments' },
  { icon: <ShieldCheck size={14} />, text: 'KYC-verified only — no fakes' },
  { icon: <CheckCircle2 size={14} />, text: 'Always free for patients' },
];

const DOCTOR_BULLETS = [
  { icon: <BadgeCheck size={14} />, text: 'Free listing, no commission' },
  { icon: <Clock size={14} />, text: 'Go live in 24–48 hours' },
  { icon: <IndianRupee size={14} />, text: 'Earn more with local patients' },
  { icon: <ShieldCheck size={14} />, text: 'KYC-verified badge builds trust' },
];

export function GetStartedPage() {
  const router = useRouter();

  return (
    /* Full viewport — flex column so nav + panels stack with no overflow */
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* ── Navbar ── */}
      <AuthNav />

      {/* ── Two-panel body — fills everything below nav ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ── LEFT: Patient panel (white) ── */}
        <div
          className="group relative flex-1 flex flex-col items-center justify-center px-8 py-10 lg:py-0 bg-white border-b lg:border-b-0 lg:border-r border-gray-100 cursor-pointer overflow-hidden transition-colors duration-300 hover:bg-teal-50/30"
          onClick={() => router.push('/auth/patient')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && router.push('/auth/patient')}
          aria-label="Continue as patient"
        >
          {/* Hover glow circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-teal-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Badge — top-left */}
          <div className="absolute top-5 left-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              For Patients · Free
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-xs space-y-5">
            {/* Icon tile */}
            <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-200 group-hover:scale-105 group-hover:shadow-teal-300 transition-all duration-300">
              <User size={32} strokeWidth={1.6} />
            </div>

            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                I&apos;m looking
                <br />
                for a doctor
              </h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Book appointments with verified local doctors in minutes.
              </p>
            </div>

            <ul className="space-y-2 text-left w-full">
              {PATIENT_BULLETS.map((b) => (
                <li key={b.text} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="text-teal-500 shrink-0">{b.icon}</span>
                  {b.text}
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center gap-2.5 w-full pt-1">
              <button
                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm py-3 px-6 rounded-2xl shadow-md shadow-teal-200 group-hover:shadow-teal-300 transition-all duration-200 active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/auth/patient');
                }}
              >
                Get Started <ArrowRight size={16} />
              </button>
              <Link
                href="/auth/patient"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-gray-400 hover:text-teal-600 transition-colors"
              >
                Already registered? <span className="text-teal-600 font-semibold">Login →</span>
              </Link>
            </div>
          </div>

          {/* Bottom note */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <span className="flex items-center gap-1 text-xs text-gray-300">
              <MapPin size={10} /> Serving Nagda, Ratlam, Ujjain &amp; expanding
            </span>
          </div>
        </div>

        {/* ── RIGHT: Doctor panel (dark teal) ── */}
        <div
          className="group relative flex-1 flex flex-col items-center justify-center px-8 py-10 lg:py-0 cursor-pointer overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: '#042f2e',
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(160deg, #042f2e 0%, #0f766e 60%, #042f2e 100%)',
            backgroundSize: '28px 28px, 100% 100%',
          }}
          onClick={() => router.push('/auth/doctor')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && router.push('/auth/doctor')}
          aria-label="Continue as doctor"
        >
          {/* Ambient glows */}
          <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-0 w-48 h-48 rounded-full bg-cyan-400/8 blur-2xl pointer-events-none" />

          {/* Badge — top-left */}
          <div className="absolute top-5 left-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-teal-300 bg-teal-900/60 border border-teal-700/50 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              For Doctors · Free
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-xs space-y-5">
            {/* Icon tile */}
            <div className="w-[72px] h-[72px] rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-lg group-hover:bg-teal-500/30 group-hover:scale-105 transition-all duration-300">
              <Stethoscope size={32} strokeWidth={1.6} />
            </div>

            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
                I&apos;m a doctor
              </h2>
              <p className="mt-2 text-sm text-teal-200/70 leading-relaxed">
                List your practice and reach patients in your city for free.
              </p>
            </div>

            <ul className="space-y-2 text-left w-full">
              {DOCTOR_BULLETS.map((b) => (
                <li key={b.text} className="flex items-center gap-2.5 text-sm text-teal-100/80">
                  <span className="text-teal-400 shrink-0">{b.icon}</span>
                  {b.text}
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center gap-2.5 w-full pt-1">
              <button
                className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm py-3 px-6 rounded-2xl shadow-md shadow-black/30 transition-all duration-200 active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/auth/doctor');
                }}
              >
                Register Free <ArrowRight size={16} />
              </button>
              <Link
                href="/auth/doctor?mode=login"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
              >
                Already registered? <span className="text-teal-300 font-semibold">Login →</span>
              </Link>
            </div>
          </div>

          {/* Bottom note */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <span className="flex items-center gap-1 text-xs text-teal-500/50">
              <CheckCircle2 size={10} /> DocNear earns nothing from your consultations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
