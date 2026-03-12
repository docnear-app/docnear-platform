'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  MapPin,
  Briefcase,
  Star,
  Clock,
  ThumbsUp,
  Globe,
  CalendarCheck,
  ShieldCheck,
  Award,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { DoctorListing } from './types';

interface DoctorProfileModalProps {
  doctor: DoctorListing | null;
  onClose: () => void;
}

function formatPrice(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

const FAKE_EDUCATION = [
  { degree: 'MBBS', institution: 'AIIMS, New Delhi', year: '2005' },
  { degree: 'MD / M.Psi', institution: 'PGI Chandigarh', year: '2009' },
  { degree: 'Fellowship', institution: 'Apollo Hospitals', year: '2011' },
];

const FAKE_TIMINGS = [
  { day: 'Mon – Wed', time: '09:00 AM – 1:00 PM' },
  { day: 'Thu – Fri', time: '02:00 PM – 6:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 12:00 PM' },
];

export function DoctorProfileModal({ doctor, onClose }: DoctorProfileModalProps) {
  if (!doctor) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        className="fixed right-0 top-0 z-50 h-full w-full overflow-y-auto bg-white shadow-2xl sm:max-w-xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${doctor.name} profile`}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur-sm">
          <span className="text-sm font-bold text-gray-900">Doctor Profile</span>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-teal-50 via-white to-cyan-50/30 px-6 py-8">
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <div className="size-20 overflow-hidden rounded-2xl border-2 border-white shadow-lg shadow-teal-100/60">
                <Image
                  src={doctor.avatar}
                  alt={doctor.name}
                  width={80}
                  height={80}
                  className="size-full object-cover"
                  unoptimized
                />
              </div>
              {doctor.isAvailableToday && (
                <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                  <span className="size-2 rounded-full bg-white" />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{doctor.name}</h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-teal-200 bg-teal-50 text-teal-700 font-medium"
                >
                  {doctor.specialty}
                </Badge>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold',
                    doctor.rating >= 95
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-teal-50 text-teal-700 border-teal-200',
                  )}
                >
                  <ThumbsUp className="size-3" />
                  {doctor.rating}% rating
                </span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="size-3.5 shrink-0 text-teal-500" />
                {doctor.hospital}, {doctor.location.district}, {doctor.location.city}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 divide-x divide-gray-200/70 overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm">
            {[
              { icon: Star, label: 'Experience', value: `${doctor.experience} yrs` },
              { icon: Award, label: 'Reviews', value: `${doctor.reviewCount}+` },
              { icon: ShieldCheck, label: 'Verified', value: 'Yes' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center py-4">
                <Icon className="mb-1 size-4 text-teal-600" />
                <span className="text-base font-bold text-gray-900">{value}</span>
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Body sections */}
        <div className="divide-y divide-gray-100 px-6">
          {/* About */}
          <section className="py-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
              About
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">{doctor.bio}</p>
          </section>

          {/* Quick info */}
          <section className="py-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Briefcase, label: 'Employment', value: doctor.employmentType },
                { icon: Globe, label: 'Languages', value: doctor.languages.join(', ') },
                {
                  icon: ThumbsUp,
                  label: 'Consultation Fee',
                  value: `Rp ${formatPrice(doctor.priceMin)} – ${formatPrice(doctor.priceMax)}`,
                },
                {
                  icon: Clock,
                  label: 'Availability',
                  value: doctor.isAvailableToday ? 'Available Today' : 'By Appointment',
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <Icon className="size-3.5 text-teal-600" />
                    <span className="text-xs font-semibold text-gray-400">{label}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Qualifications */}
          <section className="py-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Education & Qualifications
            </h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {doctor.qualifications.map((q) => (
                <span
                  key={q}
                  className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700"
                >
                  {q}
                </span>
              ))}
            </div>
            <div className="space-y-3">
              {FAKE_EDUCATION.map((edu) => (
                <div key={edu.degree} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                    <Award className="size-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{edu.degree}</p>
                    <p className="text-xs text-gray-500">
                      {edu.institution} · {edu.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Timings */}
          <section className="py-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Consultation Hours
            </h3>
            <div className="space-y-2">
              {FAKE_TIMINGS.map((t) => (
                <div
                  key={t.day}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3"
                >
                  <span className="text-sm font-medium text-gray-700">{t.day}</span>
                  <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                    {t.time}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky footer CTAs */}
        <div className="sticky bottom-0 border-t border-gray-100 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <div className="flex gap-3">
            <a
              href="tel:+918000000000"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100 active:scale-95"
            >
              <Phone className="size-4" />
              Call Clinic
            </a>
            <Link
              href="/auth/patient"
              className="group/cta flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-200/60 transition-all hover:bg-teal-700 hover:shadow-md active:scale-95"
            >
              <CalendarCheck className="size-4" />
              Book Appointment
              <ArrowRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
