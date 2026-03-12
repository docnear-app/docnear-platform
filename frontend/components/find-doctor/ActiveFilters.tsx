'use client';

import { X } from 'lucide-react';
import type { DoctorFilterState } from './types';
// ─── ActiveFilters ─────────────────────────────────────────────────────────

interface ActiveFiltersProps {
  filters: DoctorFilterState;
  onRemoveCity: () => void;
  onRemoveSpecialty: (s: string) => void;
  onRemoveEmployment: (e: string) => void;
  onRemovePrice: () => void;
  onRemoveMaxPrice: () => void;
  onRemoveAvailability: () => void;
  onRemoveGender: () => void;
  onReset: () => void;
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 hover:bg-teal-200 transition-colors"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

export function ActiveFilters({
  filters,
  onRemoveCity,
  onRemoveSpecialty,
  onRemoveEmployment,
  onRemovePrice,
  onRemoveMaxPrice,
  onRemoveAvailability,
  onRemoveGender,
  onReset,
}: ActiveFiltersProps) {
  const hasFilter =
    filters.city !== 'All Location' ||
    filters.specialties.length > 0 ||
    filters.employmentTypes.length > 0 ||
    filters.priceMin !== '' ||
    filters.priceMax !== '' ||
    filters.maxPrice !== null ||
    filters.availability ||
    filters.gender !== 'all';

  if (!hasFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <span className="text-xs font-semibold text-gray-400">Active filters:</span>
      {filters.city !== 'All Location' && <Chip label={filters.city} onRemove={onRemoveCity} />}
      {filters.specialties.map((s) => (
        <Chip key={s} label={s} onRemove={() => onRemoveSpecialty(s)} />
      ))}
      {filters.employmentTypes.map((e) => (
        <Chip key={e} label={e} onRemove={() => onRemoveEmployment(e)} />
      ))}
      {(filters.priceMin !== '' || filters.priceMax !== '') && (
        <Chip
          label={`Rp ${filters.priceMin || '0'} – ${filters.priceMax || '∞'}`}
          onRemove={onRemovePrice}
        />
      )}
      {filters.maxPrice !== null && (
        <Chip
          label={`≤ ${filters.maxPrice >= 1_000_000 ? `Rp ${filters.maxPrice / 1_000_000}M` : `Rp ${filters.maxPrice / 1_000}k`}`}
          onRemove={onRemoveMaxPrice}
        />
      )}
      {filters.availability && <Chip label="Available today" onRemove={onRemoveAvailability} />}
      {filters.gender !== 'all' && (
        <Chip label={filters.gender === 'male' ? 'Male' : 'Female'} onRemove={onRemoveGender} />
      )}
      <button
        onClick={onReset}
        className="ml-auto text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}
