'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, ThumbsUp, Briefcase, Star, CalendarCheck, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DoctorListing } from './types';

interface DoctorCardProps {
  doctor: DoctorListing;
  onViewProfile: (doctor: DoctorListing) => void;
}

function formatPrice(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${Math.round(amount / 1_000)}k`;
  return String(amount);
}

function RatingPill({ rating }: { rating: number }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        rating >= 95
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : rating >= 90
            ? 'bg-teal-50 text-teal-700 border-teal-200'
            : 'bg-amber-50 text-amber-700 border-amber-200',
      )}
    >
      <ThumbsUp className="size-3" />
      {rating}%
    </span>
  );
}

export function DoctorCard({ doctor, onViewProfile }: DoctorCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-200/80 bg-white transition-all duration-200 hover:border-teal-200 hover:shadow-md hover:shadow-teal-50/80">
      <div className="flex flex-col sm:flex-row">
        {/* ── Left: Identity ── */}
        <div className="flex shrink-0 items-start gap-4 p-5 sm:w-[280px] sm:border-r sm:border-gray-100">
          <div className="relative shrink-0">
            <div className="size-[60px] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm transition-transform duration-200 group-hover:scale-[1.03]">
              <Image
                src={doctor.avatar}
                alt={doctor.name}
                width={60}
                height={60}
                className="size-full object-cover"
                unoptimized
              />
            </div>
            {doctor.isAvailableToday && (
              <span
                title="Available today"
                className="absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-white bg-emerald-500"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-bold text-gray-900 leading-snug">{doctor.name}</h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className="border-teal-200 bg-teal-50 text-teal-700 text-xs font-medium"
              >
                {doctor.specialty}
              </Badge>
              <RatingPill rating={doctor.rating} />
            </div>
            <p className="mt-2 flex items-start gap-1 text-[11px] text-gray-500 leading-relaxed">
              <MapPin className="mt-0.5 size-3 shrink-0 text-teal-500" />
              <span>
                {doctor.hospital}, {doctor.location.district}, {doctor.location.city}
              </span>
            </p>
          </div>
        </div>

        {/* ── Right: Meta + Actions ── */}
        <div className="flex flex-1 flex-col justify-between gap-4 p-5">
          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Briefcase className="size-3.5 shrink-0 text-gray-400" />
              {doctor.employmentType}
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                Fee
              </span>
              <span className="font-semibold text-gray-900">
                Rp {formatPrice(doctor.priceMin)} – {formatPrice(doctor.priceMax)}
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
              {doctor.experience} yrs exp
            </span>
            {doctor.isAvailableToday && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <Clock className="size-3.5" />
                Available today
              </span>
            )}
          </div>

          {/* Language tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {doctor.languages.map((lang) => (
              <span
                key={lang}
                className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500"
              >
                {lang}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onViewProfile(doctor)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <User className="size-4 text-gray-400" />
              View Profile
            </button>
            <Link
              href="/auth/patient"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-100 transition-all hover:bg-teal-700 hover:shadow-md hover:shadow-teal-200/60 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <CalendarCheck className="size-4" />
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
