'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField } from '@/components/common/auth/FormField';
import { MultiSelectChips } from '../MultiSelectChips';
import { ArrowLeft, IndianRupee } from 'lucide-react';
import type { DoctorRegisterForm } from '../hooks/use-doctor-register.hook';

const LANGUAGES = ['Hindi', 'English', 'Marathi', 'Gujarati', 'Urdu', 'Bengali'];

interface Step3ClinicProps {
  form: DoctorRegisterForm;
  onFieldChange: <K extends keyof DoctorRegisterForm>(key: K, value: DoctorRegisterForm[K]) => void;
  onToggleList: (field: 'qualifications' | 'specializations' | 'languages', val: string) => void;
  loading: boolean;
  error: string;
  onSubmit: () => void;
  onBack: () => void;
}

export function Step3Clinic({
  form,
  onFieldChange,
  onToggleList,
  loading,
  error,
  onSubmit,
  onBack,
}: Step3ClinicProps) {
  const isValid = form.city.trim().length > 0 && form.pincode.length === 6;

  return (
    <div className="auth-step-enter space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div>
        <h2 className="text-xl font-bold text-gray-900">Clinic Information</h2>
        <p className="text-sm text-gray-500 mt-1">
          Where patients will find you. This appears on your profile.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Clinic name */}
      <FormField label="Clinic / Hospital Name" htmlFor="clinic-name" optional>
        <Input
          id="clinic-name"
          value={form.clinicName}
          onChange={(e) => onFieldChange('clinicName', e.target.value)}
          placeholder="e.g. Patel Clinic, City Hospital"
          autoFocus
        />
      </FormField>

      {/* Address */}
      <FormField label="Clinic Address" htmlFor="clinic-addr" optional>
        <Input
          id="clinic-addr"
          value={form.clinicAddress}
          onChange={(e) => onFieldChange('clinicAddress', e.target.value)}
          placeholder="e.g. 123 Station Road, Near Bus Stand"
        />
      </FormField>

      {/* City + Pincode */}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="City" htmlFor="city">
          <Input
            id="city"
            value={form.city}
            onChange={(e) => onFieldChange('city', e.target.value)}
            placeholder="Nagda"
          />
        </FormField>

        <FormField label="Pincode" htmlFor="pincode">
          <Input
            id="pincode"
            value={form.pincode}
            onChange={(e) =>
              onFieldChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            placeholder="456335"
            inputMode="numeric"
            className="font-mono tracking-widest"
          />
        </FormField>
      </div>

      {/* Consultation fee */}
      <FormField label="Consultation Fee" htmlFor="fee">
        <div className="relative">
          <IndianRupee
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            id="fee"
            type="number"
            min={0}
            value={form.consultationFee}
            onChange={(e) => onFieldChange('consultationFee', e.target.value)}
            placeholder="300"
            className="pl-8 font-mono font-semibold text-teal-700"
          />
        </div>
        <p className="text-xs text-gray-400">Visible to patients. Set 0 for free consultations.</p>
      </FormField>

      {/* Languages */}
      <FormField label="Languages Spoken">
        <div className="pt-1">
          <MultiSelectChips
            options={LANGUAGES}
            selected={form.languages}
            onToggle={(v) => onToggleList('languages', v)}
          />
        </div>
      </FormField>

      {/* Summary note */}
      <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4">
        <p className="text-xs text-teal-700 leading-relaxed">
          ✅ After registration, our team will review your credentials within{' '}
          <strong>24–48 hours</strong>. You&apos;ll receive an email once your profile is approved
          and listed.
        </p>
      </div>

      <Button
        onClick={onSubmit}
        disabled={!isValid || loading}
        className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-sm"
        size="lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting registration...
          </span>
        ) : (
          '✨ Complete Registration →'
        )}
      </Button>
    </div>
  );
}
