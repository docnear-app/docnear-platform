'use client';

import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DoctorSortOption } from './types';

// ─── SortBar ───────────────────────────────────────────────────────────────

const SORT_OPTIONS: { value: DoctorSortOption; label: string }[] = [
  { value: 'rating', label: 'Best Rated' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'price_asc', label: 'Lowest Price' },
  { value: 'price_desc', label: 'Highest Price' },
];

interface SortBarProps {
  sort: DoctorSortOption;
  onSortChange: (s: DoctorSortOption) => void;
  totalResults: number;
  searchQuery: string;
}

export function SortBar({ sort, onSortChange, totalResults, searchQuery }: SortBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-sm text-gray-500">
        {searchQuery ? (
          <>
            Results for{' '}
            <span className="font-semibold text-gray-900">&quot;{searchQuery}&quot;</span>
          </>
        ) : (
          <>
            <span className="font-semibold text-gray-900">{totalResults}</span>{' '}
            {totalResults === 1 ? 'doctor' : 'doctors'} found
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 text-xs text-gray-400 sm:flex">
          <ArrowUpDown className="size-3.5" />
          Sort by:
        </span>
        <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-semibold transition-all',
                sort === opt.value
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
