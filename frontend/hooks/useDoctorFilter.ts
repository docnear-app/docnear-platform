'use client';

import { useState, useMemo, useCallback } from 'react';
import type { DoctorListing, DoctorFilterState, DoctorSortOption } from './types';
import { DUMMY_DOCTORS } from '@/data/doctors';

const INITIAL_FILTERS: DoctorFilterState = {
  search: '',
  city: 'All Location',
  specialties: [],
  employmentTypes: [],
  priceMin: '',
  priceMax: '',
  maxPrice: null,
  minRating: null,
  availability: false,
  gender: 'all',
};

const PER_PAGE = 6;

export function useDoctorFilter() {
  const [filters, setFilters] = useState<DoctorFilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState<DoctorSortOption>('rating');
  const [currentPage, setCurrentPage] = useState(1);

  const updateFilter = useCallback(
    <K extends keyof DoctorFilterState>(key: K, value: DoctorFilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    [],
  );

  const toggleSpecialty = useCallback((s: string) => {
    setFilters((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(s)
        ? prev.specialties.filter((x) => x !== s)
        : [...prev.specialties, s],
    }));
    setCurrentPage(1);
  }, []);

  const toggleEmploymentType = useCallback((t: string) => {
    setFilters((prev) => ({
      ...prev,
      employmentTypes: prev.employmentTypes.includes(t)
        ? prev.employmentTypes.filter((x) => x !== t)
        : [...prev.employmentTypes, t],
    }));
    setCurrentPage(1);
  }, []);

  const removeSpecialty = useCallback((s: string) => {
    setFilters((prev) => ({ ...prev, specialties: prev.specialties.filter((x) => x !== s) }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  }, []);

  const filtered = useMemo<DoctorListing[]>(() => {
    let list = [...DUMMY_DOCTORS];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.hospital.toLowerCase().includes(q),
      );
    }
    if (filters.city && filters.city !== 'All Location') {
      list = list.filter((d) => d.location.city === filters.city);
    }
    if (filters.specialties.length) {
      list = list.filter((d) => filters.specialties.includes(d.specialty));
    }
    if (filters.employmentTypes.length) {
      list = list.filter((d) => filters.employmentTypes.includes(d.employmentType));
    }
    if (filters.priceMin !== '') {
      const min = parseInt(filters.priceMin, 10);
      if (!isNaN(min)) list = list.filter((d) => d.priceMin >= min);
    }
    if (filters.priceMax !== '') {
      const max = parseInt(filters.priceMax, 10);
      if (!isNaN(max)) list = list.filter((d) => d.priceMax <= max);
    }
    if (filters.maxPrice !== null) {
      list = list.filter((d) => d.priceMin <= filters.maxPrice!);
    }
    if (filters.minRating !== null) {
      list = list.filter((d) => d.rating >= filters.minRating!);
    }
    if (filters.availability) {
      list = list.filter((d) => d.isAvailableToday);
    }
    if (filters.gender !== 'all') {
      list = list.filter((d) => d.gender === filters.gender);
    }

    switch (sort) {
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_asc':
        list.sort((a, b) => a.priceMin - b.priceMin);
        break;
      case 'price_desc':
        list.sort((a, b) => b.priceMin - a.priceMin);
        break;
      case 'experience':
        list.sort((a, b) => b.experience - a.experience);
        break;
    }

    return list;
  }, [filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
    [filtered, currentPage],
  );

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.city !== 'All Location') n++;
    n += filters.specialties.length;
    n += filters.employmentTypes.length;
    if (filters.priceMin || filters.priceMax) n++;
    if (filters.maxPrice !== null) n++;
    if (filters.minRating !== null) n++;
    if (filters.availability) n++;
    if (filters.gender !== 'all') n++;
    return n;
  }, [filters]);

  return {
    filters,
    sort,
    currentPage,
    totalPages,
    results: paginated,
    totalResults: filtered.length,
    activeFilterCount,
    updateFilter,
    toggleSpecialty,
    toggleEmploymentType,
    removeSpecialty,
    resetFilters,
    setSort,
    setCurrentPage,
  };
}
