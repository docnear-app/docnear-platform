import type { KycStatus } from '@/lib/api/kyc.api';

const CONFIG: Record<KycStatus, { label: string; bg: string; color: string }> = {
  pending: { label: 'Pending', bg: '#fef9c3', color: '#854d0e' },
  under_review: { label: 'Under Review', bg: '#ede9fe', color: '#6d28d9' },
  approved: { label: 'Approved', bg: '#dcfce7', color: '#166534' },
  rejected: { label: 'Rejected', bg: '#fee2e2', color: '#991b1b' },
};

export const KycStatusBadge = ({ status }: { status: KycStatus }) => {
  const { label, bg, color } = CONFIG[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 999,
        background: bg,
        color,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
};
