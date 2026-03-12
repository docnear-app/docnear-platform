'use client';

import { Search, MapPin, ChevronDown, X } from 'lucide-react';
import { CITIES } from '@/data/doctors';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  searchValue: string;
  cityValue: string;
  onSearchChange: (value: string) => void;
  onCityChange: (city: string) => void;
}

export function SearchBar({
  searchValue,
  cityValue,
  onSearchChange,
  onCityChange,
}: SearchBarProps) {
  const [cityOpen, setCityOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex w-full max-w-3xl items-stretch overflow-hidden rounded-2xl border border-border/60 bg-white shadow-md shadow-black/5 transition-shadow focus-within:shadow-lg focus-within:shadow-teal-100/80">
      {/* City selector */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setCityOpen(!cityOpen)}
          className="flex h-full items-center gap-2 border-r border-border/50 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/40 focus:outline-none"
        >
          <MapPin className="size-4 text-teal-500" />
          <span className="max-w-24 truncate text-sm">{cityValue || 'All Location'}</span>
          <ChevronDown
            className={cn(
              'size-3.5 text-muted-foreground transition-transform',
              cityOpen && 'rotate-180',
            )}
          />
        </button>

        {cityOpen && (
          <div className="absolute left-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-border/60 bg-white shadow-lg shadow-black/10">
            <div className="max-h-60 overflow-y-auto py-1">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onCityChange(city);
                    setCityOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-teal-50 hover:text-teal-700',
                    cityValue === city
                      ? 'bg-teal-50 font-semibold text-teal-700'
                      : 'text-foreground',
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
        <Search className="absolute left-4 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search doctor, specialist, or hospital..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-full w-full bg-transparent py-3.5 pl-11 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <button className="shrink-0 bg-teal-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1">
        Search
      </button>
    </div>
  );
}
