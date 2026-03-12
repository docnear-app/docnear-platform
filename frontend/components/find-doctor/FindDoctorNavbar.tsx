'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocNearLogo } from '@/components/common/logo/docnear-logo';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Find Doctor', href: '/find-doctor' },
  { label: 'Articles', href: '/blog' },
  { label: 'About', href: '/about' },
];

export function FindDoctorNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 8), []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || mobileOpen
          ? 'bg-white/98 backdrop-blur-md border-b border-gray-100 shadow-sm'
          : 'bg-white border-b border-gray-100',
      )}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link href="/" className="shrink-0">
          <DocNearLogo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1" role="list">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  item.href === '/find-doctor'
                    ? 'text-teal-700 bg-teal-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                )}
              >
                {item.label}
                {item.href === '/find-doctor' && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-teal-600" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/auth/doctor"
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-teal-700 transition-colors"
          >
            For Doctors
          </Link>
          <Link
            href="/get-started"
            className="inline-flex items-center rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-200/60 transition-all hover:bg-teal-700 hover:shadow-md active:scale-95"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="lg:hidden rounded-xl p-2 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-5 pt-3">
          <ul className="space-y-0.5">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                    item.href === '/find-doctor'
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
            <Link
              href="/auth/doctor"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-xl border border-gray-200 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Join as Doctor
            </Link>
            <Link
              href="/get-started"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-xl bg-teal-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
