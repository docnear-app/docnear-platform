interface Props {
  count: number;
  onClick: () => void;
}

export const NotificationBell = ({ count, onClick }: Props) => (
  <button
    onClick={onClick}
    style={{
      position: 'relative',
      padding: '8px',
      borderRadius: 10,
      border: '1.5px solid #e2e8f0',
      background: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    aria-label={`${count} pending KYC requests`}
  >
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="#374151"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>

    {count > 0 && (
      <span
        style={{
          position: 'absolute',
          top: -4,
          right: -4,
          minWidth: 18,
          height: 18,
          padding: '0 5px',
          background: '#ef4444',
          color: 'white',
          fontSize: 10,
          fontWeight: 800,
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(239,68,68,0.4)',
          border: '2px solid white',
        }}
      >
        {count > 99 ? '99+' : count}
      </span>
    )}
  </button>
);
