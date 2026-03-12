import type { KycSubmission } from '@/lib/api/kyc.api';
import { KycStatusBadge } from './KycStatusBadge';

interface Props {
  submissions: KycSubmission[];
  onSelect: (id: string) => void;
}

export const KycRequestTable = ({ submissions, onSelect }: Props) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
          {['Doctor', 'Mobile', 'City', 'Specialization', 'Submitted', 'Status', ''].map((h) => (
            <th
              key={h}
              style={{
                padding: '10px 16px',
                textAlign: 'left',
                fontSize: 11,
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {submissions.map((s) => {
          const dp = s.doctor;
          return (
            <tr
              key={s.id}
              style={{ borderBottom: '1px solid #f8fafc' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{dp.user.name ?? '—'}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  {dp.registrationNumber}
                </div>
              </td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>{dp.user.mobile}</td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>{dp.city}</td>
              <td style={{ padding: '14px 16px', color: '#475569', maxWidth: 180 }}>
                {dp.specializations.slice(0, 2).join(', ')}
                {dp.specializations.length > 2 && ` +${dp.specializations.length - 2}`}
              </td>
              <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: 13 }}>
                {new Date(s.submittedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: '2-digit',
                })}
              </td>
              <td style={{ padding: '14px 16px' }}>
                <KycStatusBadge status={s.status} />
              </td>
              <td style={{ padding: '14px 16px' }}>
                <button
                  onClick={() => onSelect(s.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: '1px solid #e0e7ff',
                    background: '#eef2ff',
                    color: '#4f46e5',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Review →
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
