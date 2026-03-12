'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';
import { DocNearLogo } from '@/components/common/logo/docnear-logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Search, Unlock, XCircle, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineStep {
  icon: React.ReactNode;
  label: string;
  state: 'done' | 'active' | 'pending';
}

const TIMELINE: TimelineStep[] = [
  { icon: <CheckCircle2 size={16} />, label: 'Registration submitted', state: 'done' },
  { icon: <CheckCircle2 size={16} />, label: 'Mobile number verified', state: 'done' },
  { icon: <Search size={16} />, label: 'Credentials under review', state: 'active' },
  { icon: <Unlock size={16} />, label: 'Profile activated & listed', state: 'pending' },
];

export function KycPendingPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.replace('/auth/doctor');
      return;
    }
    if (user.role !== 'doctor') router.replace('/');
  }, [user, router]);

  const kycStatus = user?.kycStatus;
  const isRejected = kycStatus === 'rejected';

  const handleLogout = () => {
    authService.logout({ logout });
    router.replace('/auth/doctor');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      {/* BG */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #99f6e4 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden
      />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Logo */}
        <div className="text-center">
          <DocNearLogo size="md" />
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8 text-center">
          {isRejected ? (
            <>
              {/* Rejected state */}
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-6">
                <XCircle size={32} className="text-red-500" />
              </div>

              <Badge variant="destructive" className="mb-4">
                Verification Not Approved
              </Badge>

              <h1 className="text-xl font-bold text-gray-900 mb-3">
                We couldn&apos;t verify your profile
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                This could be due to incomplete information or document issues. Check your email for
                the specific reason.
              </p>

              <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-left mb-6">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">
                    A detailed reason has been sent to your registered email. Contact{' '}
                    <a href="mailto:support@docnear.in" className="font-semibold underline">
                      support@docnear.in
                    </a>{' '}
                    if you need assistance.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => router.push('/auth/doctor')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
              >
                Re-register with updated details
              </Button>
            </>
          ) : (
            <>
              {/* Pending / under_review state */}
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center">
                  <Clock size={28} className="text-amber-500" />
                </div>
                {/* Spinning ring */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400"
                  style={{ animation: 'spin 1.8s linear infinite' }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>

              <Badge variant="outline" className="mb-4 border-amber-200 text-amber-700 bg-amber-50">
                Under Review
              </Badge>

              <h1 className="text-xl font-bold text-gray-900 mb-2">Verification in progress</h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Welcome, <span className="font-semibold text-gray-700">{user?.name}</span>! Our team
                is reviewing your credentials.
              </p>

              {/* Timeline */}
              <div className="text-left space-y-0 mb-6">
                {TIMELINE.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    {/* Connector line */}
                    {i < TIMELINE.length - 1 && (
                      <div
                        className={cn(
                          'absolute left-[15px] top-7 w-0.5 h-6',
                          s.state === 'done' ? 'bg-teal-200' : 'bg-gray-100',
                        )}
                      />
                    )}

                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                        s.state === 'done' && 'bg-teal-100 text-teal-600',
                        s.state === 'active' && 'bg-amber-100 text-amber-600',
                        s.state === 'pending' && 'bg-gray-100 text-gray-400',
                      )}
                    >
                      {s.icon}
                    </div>

                    <div className="py-1.5 flex-1 flex items-center justify-between">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          s.state === 'done' && 'text-teal-700',
                          s.state === 'active' && 'text-amber-700',
                          s.state === 'pending' && 'text-gray-400',
                        )}
                      >
                        {s.label}
                      </span>
                      {s.state === 'active' && (
                        <span className="text-xs bg-amber-50 border border-amber-200 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-teal-50 border border-teal-100 p-4 text-left mb-6">
                <p className="text-sm text-teal-700">
                  ⏰ Review typically takes <strong>24–48 hours</strong>. You&apos;ll receive an
                  email notification once approved.
                </p>
              </div>
            </>
          )}

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full text-gray-400 hover:text-gray-600 text-sm mt-2"
          >
            Sign out
          </Button>
        </div>

        <p className="text-center text-xs text-gray-400">
          Questions?{' '}
          <a href="mailto:support@docnear.in" className="text-teal-600 font-medium hover:underline">
            support@docnear.in
          </a>
        </p>
      </div>
    </div>
  );
}
