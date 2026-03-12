'use client';

import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DoctorFilterState } from '@/types';
import { FilterSidebar } from './FilterSidebar';
// ─── MobileFilterDrawer ────────────────────────────────────────────────────

interface MobileFilterDrawerProps {
  filters: DoctorFilterState;
  activeFilterCount: number;
  onUpdateFilter: <K extends keyof DoctorFilterState>(key: K, value: DoctorFilterState[K]) => void;
  onToggleSpecialty: (s: string) => void;
  onToggleEmployment: (t: string) => void;
  onReset: () => void;
}

export function MobileFilterDrawer(props: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 lg:hidden"
      >
        <SlidersHorizontal className="size-4" />
        Filters
        {props.activeFilterCount > 0 && (
          <Badge className="bg-teal-600 text-white h-5 w-5 p-0 text-xs rounded-full flex items-center justify-center">
            {props.activeFilterCount}
          </Badge>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 lg:hidden',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-bold text-gray-900">Filter Doctors</h2>
          <button
            onClick={() => setOpen(false)}
            className="rounded-xl p-1.5 hover:bg-gray-100 transition-colors"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <FilterSidebar {...props} />
        </div>
        <div className="sticky bottom-0 border-t border-gray-100 bg-white px-5 py-4">
          <button
            onClick={() => setOpen(false)}
            className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
