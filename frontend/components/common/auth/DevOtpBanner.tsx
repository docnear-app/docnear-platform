interface DevOtpBannerProps {
  otp: string;
  label?: string;
}

/**
 * Only visible in development. Shows the OTP returned by the backend
 * when MSG91 / Brevo is not configured.
 */
export function DevOtpBanner({ otp, label = 'Dev OTP' }: DevOtpBannerProps) {
  if (!otp || process.env.NODE_ENV === 'production') return null;

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm">
      <span className="text-base">🛠</span>
      <span className="text-amber-700">
        {label}: <code className="font-mono font-bold tracking-widest text-amber-900">{otp}</code>
      </span>
    </div>
  );
}
