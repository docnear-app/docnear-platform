'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';

interface DoctorChoiceScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function DoctorChoiceScreen({ onLogin, onRegister }: DoctorChoiceScreenProps) {
  return (
    <div className="auth-fade-in space-y-6">
      {/* Heading */}
      <div>
        <Badge variant="outline" className="mb-4 border-teal-200 text-teal-700 bg-teal-50">
          Doctor Portal
        </Badge>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome, Doctor.</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Reach patients in your city who are looking for you.
        </p>
      </div>

      {/* Choice cards */}
      <div className="space-y-3">
        {/* Login */}
        <button
          onClick={onLogin}
          className="w-full group flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-teal-200 hover:bg-teal-50/30 transition-all duration-150 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center text-gray-600 group-hover:text-teal-700 transition-colors shrink-0">
            <LogIn size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">Login with OTP</p>
            <p className="text-xs text-gray-400 mt-0.5">Already registered? Sign in securely.</p>
          </div>
          <ArrowRight
            size={16}
            className="text-gray-300 group-hover:text-teal-400 transition-colors shrink-0"
          />
        </button>

        {/* Register */}
        <button
          onClick={onRegister}
          className="w-full group flex items-center gap-4 p-4 rounded-xl border border-teal-200 bg-teal-50/40 hover:bg-teal-50 hover:border-teal-300 transition-all duration-150 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
            <UserPlus size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-teal-800 text-sm">Register as Doctor</p>
            <p className="text-xs text-teal-600/60 mt-0.5">
              New to DocNear? Join free, get verified.
            </p>
          </div>
          <ArrowRight size={16} className="text-teal-400 shrink-0" />
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="flex-1 border-t border-gray-100" />
        <span className="px-3 text-xs text-gray-400">or</span>
        <div className="flex-1 border-t border-gray-100" />
      </div>

      {/* Patient cross-link */}
      <p className="text-center text-sm text-gray-400">
        Looking for a doctor instead?{' '}
        <Link href="/auth/patient" className="text-teal-600 font-semibold hover:text-teal-700">
          Book appointment →
        </Link>
      </p>
    </div>
  );
}
