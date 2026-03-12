'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CITIES } from '@/data/doctors';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { ActiveFilters } from './ActiveFilters';
import { SortBar } from './SortBar';
import { Pagination } from './Pagination';
import { useDoctorFilter } from '@/hooks/useDoctorFilter';
import { FindDoctorNavbar } from './FindDoctorNavbar';
import { FilterSidebar } from './FilterSidebar';
import { DoctorList } from './DoctorList';
import { FindDoctorFooter } from './FindDoctorFooter';

// ─── Inline search bar ─────────────────────────────────────────────────────

function SearchBar({
  searchValue,
  cityValue,
  onSearchChange,
  onCityChange,
}: {
  searchValue: string;
  cityValue: string;
  onSearchChange: (v: string) => void;
  onCityChange: (c: string) => void;
}) {
  const [cityOpen, setCityOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setCityOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div className="flex w-full max-w-2xl items-stretch overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow focus-within:border-teal-300 focus-within:shadow-md focus-within:shadow-teal-100/50">
      {/* City */}
      <div className="relative shrink-0" ref={ref}>
        <button
          onClick={() => setCityOpen(!cityOpen)}
          className="flex h-full items-center gap-1.5 border-r border-gray-200 px-4 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none"
        >
          <MapPin className="size-4 text-teal-500 shrink-0" />
          <span className="max-w-[96px] truncate font-medium">{cityValue || 'All Location'}</span>
          <ChevronDown
            className={cn('size-3.5 text-gray-400 transition-transform', cityOpen && 'rotate-180')}
          />
        </button>
        {cityOpen && (
          <div className="absolute left-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
            <div className="max-h-56 overflow-y-auto py-1">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onCityChange(city);
                    setCityOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-teal-50',
                    cityValue === city ? 'bg-teal-50 font-semibold text-teal-700' : 'text-gray-700',
                  )}
                >
                  {cityValue === city && (
                    <span className="size-1.5 rounded-full bg-teal-600 shrink-0" />
                  )}
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search input */}
      <div className="relative flex flex-1 items-center">
        <Search className="absolute left-3.5 size-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Doctor, specialist, or hospital..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-full w-full bg-transparent py-3.5 pl-10 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 rounded-full p-0.5 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <button className="shrink-0 bg-teal-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
        Search
      </button>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export function FindDoctorPage() {
  const {
    filters,
    sort,
    currentPage,
    totalPages,
    results,
    totalResults,
    activeFilterCount,
    updateFilter,
    toggleSpecialty,
    toggleEmploymentType,
    removeSpecialty,
    resetFilters,
    setSort,
    setCurrentPage,
  } = useDoctorFilter();

  const sidebarProps = {
    filters,
    activeFilterCount,
    onUpdateFilter: updateFilter,
    onToggleSpecialty: toggleSpecialty,
    onToggleEmployment: toggleEmploymentType,
    onReset: resetFilters,
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <FindDoctorNavbar />

      {/* ── Sticky search strip ── */}
      <div
        className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm"
        style={{ top: '64px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchBar
                searchValue={filters.search}
                cityValue={filters.city}
                onSearchChange={(v) => updateFilter('search', v)}
                onCityChange={(c) => updateFilter('city', c)}
              />
            </div>
            <MobileFilterDrawer {...sidebarProps} />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <main className="flex-1 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Breadcrumb */}
          <nav
            className="mb-5 flex items-center gap-1.5 text-xs text-gray-500"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-teal-600 transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-900">Find Doctor</span>
            {filters.search && (
              <>
                <span className="text-gray-300">/</span>
                <span className="max-w-[160px] truncate font-medium text-gray-900">
                  {filters.search}
                </span>
              </>
            )}
          </nav>

          <div className="flex gap-6">
            {/* Desktop sidebar */}
            <aside className="hidden w-[260px] shrink-0 lg:block">
              <div className="sticky" style={{ top: 'calc(64px + 73px + 24px)' }}>
                <FilterSidebar {...sidebarProps} />
              </div>
            </aside>

            {/* Content column */}
            <section className="min-w-0 flex-1 space-y-3">
              <ActiveFilters
                filters={filters}
                onRemoveCity={() => updateFilter('city', 'All Location')}
                onRemoveSpecialty={removeSpecialty}
                onRemoveEmployment={(e) =>
                  updateFilter(
                    'employmentTypes',
                    filters.employmentTypes.filter((t) => t !== e),
                  )
                }
                onRemovePrice={() => {
                  updateFilter('priceMin', '');
                  updateFilter('priceMax', '');
                }}
                onRemoveMaxPrice={() => updateFilter('maxPrice', null)}
                onRemoveAvailability={() => updateFilter('availability', false)}
                onRemoveGender={() => updateFilter('gender', 'all')}
                onReset={resetFilters}
              />

              <SortBar
                sort={sort}
                onSortChange={setSort}
                totalResults={totalResults}
                searchQuery={filters.search}
              />

              <DoctorList doctors={results} searchQuery={filters.search} onReset={resetFilters} />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </section>
          </div>
        </div>
      </main>

      <FindDoctorFooter />
    </div>
  );
}
