'use client';

import { AuthLayout } from '@/components/common/auth/AuthLayout';
import { MobileStep } from './components/MobileStep';
import { OtpStep } from './components/OtpStep';
import { ProfileSetupStep } from './components/ProfileSetupStep';
import { usePatientAuth } from './hooks/use-patient-auth.hook';
import { UserCircle, Star, Clock } from 'lucide-react';

const TRUST_POINTS = [
  {
    icon: <UserCircle size={16} />,
    text: 'KYC-verified doctors only — no fakes',
  },
  {
    icon: <Clock size={16} />,
    text: 'Book same-day appointments in seconds',
  },
  {
    icon: <Star size={16} />,
    text: 'Free for patients, always',
  },
];

export function PatientAuthPage() {
  const auth = usePatientAuth();

  return (
    <AuthLayout
      brandHeading="Find the right doctor, right near you."
      brandSubtext="DocNear connects you with verified local doctors in Nagda and across Madhya Pradesh."
      trustPoints={TRUST_POINTS}
      brandNote="Currently serving Nagda, Ratlam, Ujjain and expanding."
      variant="patient"
    >
      {auth.step === 'mobile' && (
        <MobileStep
          mobile={auth.mobile}
          onMobileChange={auth.setMobile}
          onSubmit={auth.sendOtp}
          loading={auth.loading}
          error={auth.error}
        />
      )}

      {auth.step === 'otp' && (
        <OtpStep
          mobile={auth.mobile}
          otp={auth.otp}
          onOtpChange={auth.setOtp}
          onVerify={auth.verifyOtp}
          onResend={auth.sendOtp}
          onBack={() => {
            auth.setStep('mobile');
            auth.setOtp(Array(6).fill(''));
            auth.setError('');
          }}
          resendTimer={auth.resendTimer}
          loading={auth.loading}
          error={auth.error}
          devOtp={auth.devOtp}
        />
      )}

      {auth.step === 'profile' && (
        <ProfileSetupStep
          profile={auth.profile}
          onFieldChange={auth.setProfileField}
          onSendEmailOtp={auth.sendEmailOtp}
          onVerifyEmailOtp={auth.verifyEmailOtp}
          onSubmit={auth.completeProfile}
          onSkip={auth.skipProfile}
          loading={auth.loading}
          error={auth.error}
        />
      )}
    </AuthLayout>
  );
}
