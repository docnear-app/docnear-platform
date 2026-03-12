'use client';

import Link from 'next/link';
import { DocNearLogo } from '@/components/common/logo/docnear-logo';
import { Search } from 'lucide-react';

interface AuthNavProps {
  /** Invert logo colours (for dark backgrounds) */
  inverted?: boolean;
}

/**
 * Slim navigation bar used across all auth pages and the get-started screen.
 * Logo on the left, single "Find a Doctor" CTA on the right.
 * Always white background — consistent, unambiguous.
 */
export function AuthNav({ inverted = false }: AuthNavProps) {
  return (
    <header className="h-16 shrink-0 bg-white border-b border-gray-100 flex items-center justify-between px-6 xl:px-10 z-30 shadow-xs shadow-gray-300">
      {/* Logo — left */}
      <Link href="/" aria-label="DocNear home">
        <DocNearLogo size="md" inverted={inverted} />
      </Link>

      {/* Single CTA — right */}
      <Link
        href="/auth/patient"
        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all shadow-sm shadow-teal-200 active:scale-95"
      >
        <Search size={14} strokeWidth={2.5} />
        Find a Doctor
      </Link>
    </header>
  );
}
