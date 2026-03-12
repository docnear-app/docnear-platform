'use client';

import { KycRequestTable } from './components/KycRequestTable';
import { KycDetailDrawer } from './components/KycDetailDrawer';
import { useKycQueue } from './hooks/use-kyc-queue.hook';

export const KycQueuePage = () => {
  const kyc = useKycQueue();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '32px 24px',
        fontFamily: 'var(--font-sans), system-ui',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.5px',
              }}
            >
              KYC Review Queue
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
              {kyc.isLoading ? 'Loading…' : `${kyc.submissions.length} pending review`}
            </p>
          </div>
          <button
            onClick={kyc.fetchPending}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: '1.5px solid #e2e8f0',
              background: 'white',
              color: '#374151',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ↺ Refresh
          </button>
        </div>

        {/* Toast */}
        {kyc.toast && (
          <div
            style={{
              marginBottom: 16,
              padding: '12px 16px',
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: 12,
              color: '#166534',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {kyc.toast}
          </div>
        )}

        {/* Error */}
        {kyc.error && (
          <div
            style={{
              marginBottom: 16,
              padding: '12px 16px',
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: 12,
              color: '#dc2626',
              fontSize: 14,
            }}
          >
            {kyc.error}
          </div>
        )}

        {/* Table card */}
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            border: '1px solid #f1f5f9',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {kyc.isLoading ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              Loading queue…
            </div>
          ) : kyc.submissions.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <p style={{ margin: 0, fontWeight: 600, color: '#374151', fontSize: 16 }}>
                All clear!
              </p>
              <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: 13 }}>
                No pending KYC submissions right now.
              </p>
              <button
                onClick={kyc.fetchPending}
                style={{
                  marginTop: 20,
                  padding: '8px 20px',
                  borderRadius: 10,
                  border: '1px solid #e0e7ff',
                  background: '#eef2ff',
                  color: '#4f46e5',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Refresh
              </button>
            </div>
          ) : (
            <KycRequestTable submissions={kyc.submissions} onSelect={kyc.selectSubmission} />
          )}
        </div>
      </div>

      {/* Side drawer */}
      <KycDetailDrawer
        submission={kyc.selected}
        isReviewing={kyc.isReviewing}
        onClose={kyc.closeDetail}
        onApprove={kyc.handleApprove}
        onReject={kyc.handleReject}
      />
    </div>
  );
};
