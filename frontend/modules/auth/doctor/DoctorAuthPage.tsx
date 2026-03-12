'use client';

import { useState } from 'react';
import { AuthLayout } from '@/components/common/auth/AuthLayout';
import { StepProgress } from '@/components/common/auth/StepProgress';
import { DoctorLoginFlow } from './components/DoctorLoginFlow';
import { Step1Personal } from './components/register/Step1Personal';
import { Step2Professional } from './components/register/Step2Professional';
import { Step3Clinic } from './components/register/Step3Clinic';
import { useDoctorAuth } from './hooks/use-doctor-auth.hook';
import { useDoctorRegister } from './hooks/use-doctor-register.hook';
import { Stethoscope, Users, BadgeCheck, LogIn } from 'lucide-react';

const TRUST_POINTS = [
  { icon: <Users size={16} />, text: 'Join 500+ verified doctors across MP' },
  { icon: <BadgeCheck size={16} />, text: 'Free listing — no commission on bookings' },
  { icon: <Stethoscope size={16} />, text: 'Real patients in your city, every day' },
];

const REGISTER_STEP_LABELS = ['Personal Info', 'Professional', 'Clinic'];

interface DoctorAuthPageProps {
  defaultView?: 'register' | 'login';
}

export function DoctorAuthPage({ defaultView = 'register' }: DoctorAuthPageProps) {
  const [showLogin, setShowLogin] = useState(defaultView === 'login');

  const loginHook = useDoctorAuth();
  const registerHook = useDoctorRegister();

  return (
    // formScroll=true: only the right form panel scrolls, left brand stays fixed
    <AuthLayout
      brandHeading="Grow your practice with DocNear."
      brandSubtext="Reach patients who are actively searching for doctors like you in your city."
      trustPoints={TRUST_POINTS}
      brandNote="Registration is free. DocNear earns nothing from your consultations."
      variant="doctor"
    >
      {!showLogin ? (
        /* ── REGISTRATION ─────────────────────────────────────────────────── */
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 mb-3 text-xs font-bold tracking-widest uppercase text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              Doctor Registration
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Join DocNear as a Doctor
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Free listing. KYC verified. Go live in 24–48 hours.
            </p>
          </div>

          {/* Step progress */}
          <StepProgress current={registerHook.step} total={3} labels={REGISTER_STEP_LABELS} />

          {/* Step forms */}
          {registerHook.step === 1 && (
            <Step1Personal
              form={registerHook.form}
              onFieldChange={registerHook.setField}
              onSendMobileOtp={registerHook.sendMobileOtp}
              onVerifyMobileOtp={registerHook.verifyMobileOtp}
              onSendEmailOtp={registerHook.sendEmailOtp}
              onVerifyEmailOtp={registerHook.verifyEmailOtp}
              loading={registerHook.loading}
              error={registerHook.error}
              isValid={registerHook.step1Valid}
              onNext={registerHook.nextStep}
            />
          )}

          {registerHook.step === 2 && (
            <Step2Professional
              form={registerHook.form}
              onFieldChange={registerHook.setField}
              onToggleList={registerHook.toggleList}
              loading={registerHook.loading}
              error={registerHook.error}
              isValid={registerHook.step2Valid}
              onNext={registerHook.nextStep}
              onBack={registerHook.prevStep}
            />
          )}

          {registerHook.step === 3 && (
            <Step3Clinic
              form={registerHook.form}
              onFieldChange={registerHook.setField}
              onToggleList={registerHook.toggleList}
              loading={registerHook.loading}
              error={registerHook.error}
              onSubmit={registerHook.submitRegistration}
              onBack={registerHook.prevStep}
            />
          )}

          {/* Login toggle */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => {
                setShowLogin(true);
                loginHook.reset();
              }}
              className="w-full flex items-center justify-between py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors group"
            >
              <span className="flex items-center gap-2">
                <LogIn
                  size={15}
                  className="text-gray-400 group-hover:text-teal-500 transition-colors"
                />
                Already registered?{' '}
                <span className="font-semibold text-teal-600 group-hover:text-teal-700">
                  Login →
                </span>
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* ── LOGIN ────────────────────────────────────────────────────────── */
        <DoctorLoginFlow
          loginMethod={loginHook.loginMethod}
          onMethodChange={loginHook.setLoginMethod}
          mobile={loginHook.mobile}
          onMobileChange={loginHook.setMobile}
          otp={loginHook.otp}
          onOtpChange={loginHook.setOtp}
          otpSent={loginHook.otpSent}
          devOtp={loginHook.devOtp}
          onSendOtp={loginHook.sendOtp}
          onVerifyOtp={loginHook.verifyOtp}
          emailLogin={loginHook.emailLogin}
          onEmailLoginChange={loginHook.setEmailLogin}
          passwordLogin={loginHook.passwordLogin}
          onPasswordLoginChange={loginHook.setPasswordLogin}
          onLoginWithEmail={loginHook.loginWithEmail}
          onBack={() => {
            setShowLogin(false);
            loginHook.reset();
          }}
          loading={loginHook.loading}
          error={loginHook.error}
          footerSlot={
            <p className="text-center text-sm text-gray-400 pt-2 border-t border-gray-100">
              Not registered yet?{' '}
              <button
                onClick={() => {
                  setShowLogin(false);
                  loginHook.reset();
                }}
                className="text-teal-600 font-semibold hover:text-teal-700"
              >
                Create your profile →
              </button>
            </p>
          }
        />
      )}
    </AuthLayout>
  );
}
