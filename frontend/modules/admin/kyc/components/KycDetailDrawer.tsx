import type { KycSubmission } from '@/lib/api/kyc.api';
import { KycActionButtons } from './KycActionButtons';
import { KycStatusBadge } from './KycStatusBadge';

interface Props {
  submission: KycSubmission | null;
  isReviewing: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export const KycDetailDrawer = ({
  submission,
  isReviewing,
  onClose,
  onApprove,
  onReject,
}: Props) => {
  if (!submission) return null;
  const dp = submission.doctor;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40 }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: 440,
          background: 'white',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 40px rgba(0,0,0,0.12)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
              KYC Review
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
              Submitted{' '}
              {new Date(submission.submittedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <KycStatusBadge status={submission.status} />
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 20,
                color: '#94a3b8',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <Section title="Doctor">
            <Row label="Name" value={dp.user.name ?? '—'} />
            <Row label="Mobile" value={dp.user.mobile} />
            {dp.user.email && <Row label="Email" value={dp.user.email} />}
            <Row label="Reg. Number" value={dp.registrationNumber} />
          </Section>

          <Section title="Qualifications">
            <Tags items={dp.qualifications} color="#dbeafe" textColor="#1e40af" />
          </Section>

          <Section title="Specializations">
            <Tags items={dp.specializations} color="#ede9fe" textColor="#5b21b6" />
          </Section>

          <Section title="Clinic">
            {dp.clinicName && <Row label="Name" value={dp.clinicName} />}
            <Row label="City" value={dp.city} />
            <Row label="Fee" value={`₹${dp.consultationFee}`} />
          </Section>

          {submission.rejectionReason && (
            <Section title="Rejection Reason">
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: '#dc2626',
                  background: '#fef2f2',
                  padding: '10px 12px',
                  borderRadius: 8,
                }}
              >
                {submission.rejectionReason}
              </p>
            </Section>
          )}
        </div>

        {/* Actions pinned to bottom */}
        {submission.status === 'pending' && (
          <div
            style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}
          >
            <KycActionButtons
              submissionId={submission.id}
              isLoading={isReviewing}
              onApprove={onApprove}
              onReject={onReject}
            />
          </div>
        )}
      </div>
    </>
  );
};

// ─── Local sub-components ─────────────────────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p
      style={{
        margin: '0 0 10px',
        fontSize: 11,
        fontWeight: 700,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
      }}
    >
      {title}
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
    <span style={{ color: '#94a3b8', width: 110, flexShrink: 0 }}>{label}</span>
    <span style={{ color: '#0f172a', fontWeight: 500 }}>{value}</span>
  </div>
);

const Tags = ({
  items,
  color,
  textColor,
}: {
  items: string[];
  color: string;
  textColor: string;
}) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
    {items.map((item) => (
      <span
        key={item}
        style={{
          padding: '3px 10px',
          borderRadius: 999,
          background: color,
          color: textColor,
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {item}
      </span>
    ))}
  </div>
);
