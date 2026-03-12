'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField } from '@/components/common/auth/FormField';
import { MultiSelectChips } from '../MultiSelectChips';
import { ArrowLeft } from 'lucide-react';
import type { DoctorRegisterForm } from '../hooks/use-doctor-register.hook';

const QUALIFICATIONS = [
  'MBBS',
  'MD',
  'MS',
  'BDS',
  'MDS',
  'BAMS',
  'BHMS',
  'DNB',
  'DM',
  'MCh',
  'FRCS',
  'DPM',
];

const SPECIALIZATIONS = [
  'General Medicine',
  'Pediatrics',
  'Orthopedics',
  'Cardiology',
  'Dermatology',
  'Gynecology & Obstetrics',
  'ENT',
  'Ophthalmology',
  'Neurology',
  'Psychiatry',
  'Dental',
  'Ayurveda',
  'Homeopathy',
  'Radiology',
  'Pathology',
  'Urology',
];

interface Step2ProfessionalProps {
  form: DoctorRegisterForm;
  onFieldChange: <K extends keyof DoctorRegisterForm>(key: K, value: DoctorRegisterForm[K]) => void;
  onToggleList: (field: 'qualifications' | 'specializations' | 'languages', val: string) => void;
  loading: boolean;
  error: string;
  isValid: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Professional({
  form,
  onFieldChange,
  onToggleList,
  loading,
  error,
  isValid,
  onNext,
  onBack,
}: Step2ProfessionalProps) {
  return (
    <div className="auth-step-enter space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div>
        <h2 className="text-xl font-bold text-gray-900">Professional Details</h2>
        <p className="text-sm text-gray-500 mt-1">Your credentials and areas of expertise.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Registration number */}
      <FormField label="Medical Registration Number" htmlFor="reg-no">
        <Input
          id="reg-no"
          value={form.registrationNumber}
          onChange={(e) => onFieldChange('registrationNumber', e.target.value)}
          placeholder="e.g. MP/12345/2020"
          autoFocus
        />
      </FormField>

      {/* Qualifications */}
      <FormField label="Qualifications">
        <div className="pt-1">
          <MultiSelectChips
            options={QUALIFICATIONS}
            selected={form.qualifications}
            onToggle={(v) => onToggleList('qualifications', v)}
          />
        </div>
      </FormField>

      {/* Specializations */}
      <FormField label="Specializations">
        <div className="pt-1">
          <MultiSelectChips
            options={SPECIALIZATIONS}
            selected={form.specializations}
            onToggle={(v) => onToggleList('specializations', v)}
            maxSelections={5}
          />
          <p className="text-xs text-gray-400 mt-1.5">Select up to 5</p>
        </div>
      </FormField>

      {/* Experience */}
      <FormField label="Years of Experience" htmlFor="experience">
        <Input
          id="experience"
          type="number"
          min={0}
          max={60}
          value={form.experience}
          onChange={(e) => onFieldChange('experience', e.target.value)}
          placeholder="e.g. 8"
          className="max-w-[120px]"
        />
      </FormField>

      {/* Bio */}
      <FormField label="Short Bio" htmlFor="bio" optional>
        <Textarea
          id="bio"
          value={form.bio}
          onChange={(e) => onFieldChange('bio', e.target.value)}
          placeholder="Tell patients about your practice, approach, and what makes you different..."
          rows={3}
        />
      </FormField>

      <Button
        onClick={onNext}
        disabled={!isValid || loading}
        className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-sm mt-2"
        size="lg"
      >
        Continue to Clinic Details →
      </Button>
    </div>
  );
}
