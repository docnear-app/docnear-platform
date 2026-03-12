import Link from 'next/link';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { DocNearLogo } from '@/components/common/logo/docnear-logo';

const FOOTER_COLS = [
  {
    heading: 'Platform',
    links: [
      { label: 'Find a Doctor', href: '/find-doctor' },
      { label: 'Book Appointment', href: '/auth/patient' },
      { label: 'For Doctors', href: '/auth/doctor' },
      { label: 'Get Started', href: '/get-started' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
];

export function FindDoctorFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400" role="contentinfo">
      {/* Get Started CTA banner */}
      <div className="border-b border-gray-800/60 bg-gradient-to-r from-teal-950/80 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Ready to find your doctor?</h3>
              <p className="mt-1 text-sm text-gray-400">
                Join thousands of patients booking verified doctors every day.
              </p>
            </div>
            <Link
              href="/get-started"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/40 transition-all hover:bg-teal-500 active:scale-95"
            >
              Get Started Free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <DocNearLogo inverted />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              India&apos;s trusted platform connecting patients with verified doctors nearby. Book
              appointments, manage health, stay well.
            </p>
            <div className="mt-5 space-y-2.5">
              <a
                href="mailto:hello@docnear.in"
                className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-teal-400"
              >
                <Mail className="size-4 shrink-0 text-teal-600" />
                hello@docnear.in
              </a>
              <a
                href="tel:+918000000000"
                className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-teal-400"
              >
                <Phone className="size-4 shrink-0 text-teal-600" />
                +91 800 000 0000
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
                {col.heading}
              </h4>
              <ul className="space-y-2.5" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-teal-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-800/60 pt-8 sm:flex-row">
          <p className="text-xs text-gray-600">&copy; {year} DocNear. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Terms
            </Link>
            <span className="text-xs text-gray-700">Built with ❤️ for India&apos;s healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
