'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField } from '@/components/common/auth/FormField';
import { PasswordInput } from '@/components/common/auth/PasswordInput';
import { DocNearLogo } from '@/components/common/logo/docnear-logo';
import { ShieldCheck, Mail } from 'lucide-react';
import Link from 'next/link';

interface AdminLoginFormProps {
  email: string;
  onEmailChange: (v: string) => void;
  password: string;
  onPasswordChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}

export function AdminLoginForm({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  onSubmit,
  loading,
  error,
}: AdminLoginFormProps) {
  return (
    <div className="auth-fade-in space-y-6">
      {/* Logo */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg shadow-slate-900/20">
          <ShieldCheck size={26} className="text-teal-400" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-1">
            Internal Access
          </p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-sm text-slate-400 mt-1">DocNear team members only.</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Email */}
      <FormField label="Email" htmlFor="admin-email">
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            placeholder="admin@docnear.in"
            className="pl-8"
            autoFocus
          />
        </div>
      </FormField>

      {/* Password */}
      <FormField label="Password" htmlFor="admin-password">
        <PasswordInput
          id="admin-password"
          value={password}
          onChange={(e) => onPasswordChange((e.target as HTMLInputElement).value)}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && onSubmit()}
          placeholder="••••••••"
          hasError={!!error}
        />
      </FormField>

      <Button
        onClick={onSubmit}
        disabled={loading}
        className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-sm"
        size="lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signing in...
          </span>
        ) : (
          'Sign in to Admin →'
        )}
      </Button>

      {/* Back link */}
      <div className="text-center">
        <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to DocNear
        </Link>
      </div>

      {/* Subtle footer */}
      <div className="pt-2 border-t border-gray-100 flex justify-center">
        <DocNearLogo size="sm" />
      </div>
    </div>
  );
}
