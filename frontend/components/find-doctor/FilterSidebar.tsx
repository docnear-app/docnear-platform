'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CITIES, PRICE_RANGES, SPECIALTIES } from '@/data/doctors';
import { DoctorFilterState } from '@/types';

interface FilterSidebarProps {
  filters: DoctorFilterState;
  activeFilterCount: number;
  onUpdateFilter: <K extends keyof DoctorFilterState>(key: K, value: DoctorFilterState[K]) => void;
  onToggleSpecialty: (s: string) => void;
  onToggleEmployment: (t: string) => void;
  onReset: () => void;
}

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-900 hover:text-teal-700 transition-colors"
      >
        {title}
        {open ? (
          <ChevronUp className="size-3.5 text-gray-400" />
        ) : (
          <ChevronDown className="size-3.5 text-gray-400" />
        )}
      </button>
      {open && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-gray-50">
      <input
        type="checkbox"
        className="size-3.5 rounded accent-teal-600"
        checked={checked}
        onChange={onChange}
      />
      <span className={cn('text-sm', checked ? 'font-medium text-gray-900' : 'text-gray-600')}>
        {label}
      </span>
    </label>
  );
}

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract'];

export function FilterSidebar({
  filters,
  activeFilterCount,
  onUpdateFilter,
  onToggleSpecialty,
  onToggleEmployment,
  onReset,
}: FilterSidebarProps) {
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [showAllCities, setShowAllCities] = useState(false);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);

  const filteredSpecialties = SPECIALTIES.filter((s) =>
    s.toLowerCase().includes(specialtySearch.toLowerCase()),
  );
  const visibleCities = showAllCities ? CITIES : CITIES.slice(0, 7);
  const visibleSpecialties = showAllSpecialties
    ? filteredSpecialties
    : filteredSpecialties.slice(0, 6);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <Badge className="bg-teal-600 text-white h-5 min-w-5 px-1.5 text-xs rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-gray-400 transition-colors hover:text-teal-700"
          >
            <RotateCcw className="size-3" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* City */}
        <Section title="Select City">
          {visibleCities.map((city) => (
            <CheckRow
              key={city}
              label={city}
              checked={
                city === 'All Location' ? filters.city === 'All Location' : filters.city === city
              }
              onChange={() => onUpdateFilter('city', city)}
            />
          ))}
          {CITIES.length > 7 && (
            <button
              onClick={() => setShowAllCities(!showAllCities)}
              className="mt-1 px-2 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors"
            >
              {showAllCities ? 'Show Less' : `See More (${CITIES.length - 7})`}
            </button>
          )}
        </Section>

        {/* Specialty */}
        <Section title="Choose a Specialty">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search specialty..."
              value={specialtySearch}
              onChange={(e) => setSpecialtySearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/60 py-1.5 pl-8 pr-3 text-xs placeholder:text-gray-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-200"
            />
          </div>
          <CheckRow
            label="All Relevant Expertise"
            checked={filters.specialties.length === 0}
            onChange={() => onUpdateFilter('specialties', [])}
          />
          {visibleSpecialties.map((s) => (
            <CheckRow
              key={s}
              label={s}
              checked={filters.specialties.includes(s)}
              onChange={() => onToggleSpecialty(s)}
            />
          ))}
          {filteredSpecialties.length > 6 && (
            <button
              onClick={() => setShowAllSpecialties(!showAllSpecialties)}
              className="mt-1 px-2 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors"
            >
              {showAllSpecialties ? 'Show Less' : `See More (${filteredSpecialties.length - 6})`}
            </button>
          )}
        </Section>

        {/* Employment type */}
        <Section title="Employment Type">
          {EMPLOYMENT_TYPES.map((t) => (
            <CheckRow
              key={t}
              label={t}
              checked={filters.employmentTypes.includes(t)}
              onChange={() => onToggleEmployment(t)}
            />
          ))}
        </Section>

        {/* Price range */}
        <Section title="Price Range">
          <div className="mb-3 flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-400">Min (Rp)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.priceMin}
                onChange={(e) => onUpdateFilter('priceMin', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-1.5 text-xs placeholder:text-gray-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-200"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-400">Max (Rp)</label>
              <input
                type="number"
                placeholder="∞"
                value={filters.priceMax}
                onChange={(e) => onUpdateFilter('priceMax', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-1.5 text-xs placeholder:text-gray-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-200"
              />
            </div>
          </div>
          {PRICE_RANGES.map((range) => (
            <CheckRow
              key={range.label}
              label={range.label}
              checked={filters.maxPrice === range.max}
              onChange={() =>
                onUpdateFilter('maxPrice', filters.maxPrice === range.max ? null : range.max)
              }
            />
          ))}
        </Section>

        {/* Availability */}
        <Section title="Availability" defaultOpen={false}>
          <CheckRow
            label="Available Today"
            checked={filters.availability}
            onChange={() => onUpdateFilter('availability', !filters.availability)}
          />
        </Section>

        {/* Gender */}
        <Section title="Gender" defaultOpen={false}>
          {(['all', 'male', 'female'] as const).map((g) => (
            <label
              key={g}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-gray-50"
            >
              <input
                type="radio"
                name="doctor-gender"
                className="size-3.5 accent-teal-600"
                checked={filters.gender === g}
                onChange={() => onUpdateFilter('gender', g)}
              />
              <span
                className={cn(
                  'text-sm capitalize',
                  filters.gender === g ? 'font-medium text-gray-900' : 'text-gray-600',
                )}
              >
                {g === 'all' ? 'All Genders' : g}
              </span>
            </label>
          ))}
        </Section>
      </div>
    </div>
  );
}
