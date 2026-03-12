'use client';

import { useState } from 'react';
import { UserSearch } from 'lucide-react';
import { DoctorListing } from '@/types';
import { DoctorCard } from './DoctorCard';
import { DoctorProfileModal } from './DoctorProfileModal';

interface DoctorListProps {
  doctors: DoctorListing[];
  searchQuery: string;
  onReset: () => void;
}

export function DoctorList({ doctors, searchQuery, onReset }: DoctorListProps) {
  const [selected, setSelected] = useState<DoctorListing | null>(null);

  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
        <div className="mb-4 rounded-2xl bg-teal-50 p-5">
          <UserSearch className="size-10 text-teal-400" />
        </div>
        <h3 className="text-base font-bold text-gray-900">No doctors found</h3>
        <p className="mt-2 max-w-xs text-sm text-gray-500">
          {searchQuery
            ? `No results for "${searchQuery}". Try adjusting your search or filters.`
            : 'No doctors match your current filters.'}
        </p>
        <button
          onClick={onReset}
          className="mt-5 rounded-xl border border-teal-200 bg-teal-50 px-5 py-2.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-100"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {doctors.map((doctor, i) => (
          <div
            key={doctor.id}
            className="animate-in fade-in slide-in-from-bottom-1"
            style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
          >
            <DoctorCard doctor={doctor} onViewProfile={setSelected} />
          </div>
        ))}
      </div>

      <DoctorProfileModal doctor={selected} onClose={() => setSelected(null)} />
    </>
  );
}
