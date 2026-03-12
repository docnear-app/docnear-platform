import Link from 'next/link';

interface Props {
  count: number;
  onClose: () => void;
}

export const NotificationPanel = ({ count, onClose }: Props) => (
  <>
    {/* Backdrop */}
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />

    {/* Dropdown */}
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 8px)',
        width: 300,
        background: 'white',
        borderRadius: 14,
        border: '1px solid #f1f5f9',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        zIndex: 40,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Notifications</span>
        {count > 0 && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 999,
              background: '#fef2f2',
              color: '#ef4444',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {count} new
          </span>
        )}
      </div>

      {/* Content */}
      {count === 0 ? (
        <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
          No pending notifications
        </div>
      ) : (
        <Link
          href="/admin/kyc"
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '14px 16px',
            textDecoration: 'none',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#eef2ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            📋
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
              {count} KYC {count === 1 ? 'request' : 'requests'} pending
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8' }}>
              Click to review doctor applications
            </p>
          </div>
        </Link>
      )}
    </div>
  </>
);
