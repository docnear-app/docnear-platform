'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
// ─── Pagination ────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(
      1,
      '...',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );
  } else {
    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 py-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`e${i}`}
            className="flex size-9 items-center justify-center text-sm text-gray-400"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              'flex size-9 items-center justify-center rounded-xl border text-sm font-semibold transition-all',
              p === currentPage
                ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700',
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
