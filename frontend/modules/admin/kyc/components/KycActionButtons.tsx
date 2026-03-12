import { useState } from 'react';

interface Props {
  submissionId: string;
  isLoading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export const KycActionButtons = ({ submissionId, isLoading, onApprove, onReject }: Props) => {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState('');

  if (showReject) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
          Rejection reason <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Registration number does not match MCI records..."
          rows={3}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 10,
            border: '1.5px solid #e2e8f0',
            fontSize: 13,
            color: '#0f172a',
            outline: 'none',
            resize: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onReject(submissionId, reason)}
            disabled={isLoading || !reason.trim()}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: 10,
              border: 'none',
              background: '#ef4444',
              color: 'white',
              fontWeight: 700,
              fontSize: 14,
              cursor: reason.trim() ? 'pointer' : 'not-allowed',
              opacity: reason.trim() ? 1 : 0.5,
            }}
          >
            {isLoading ? 'Rejecting...' : 'Confirm Reject'}
          </button>
          <button
            onClick={() => {
              setShowReject(false);
              setReason('');
            }}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: 10,
              border: '1.5px solid #e2e8f0',
              background: 'white',
              color: '#475569',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <button
        onClick={() => onApprove(submissionId)}
        disabled={isLoading}
        style={{
          flex: 1,
          padding: '12px',
          borderRadius: 10,
          border: 'none',
          background: '#16a34a',
          color: 'white',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? '...' : '✓ Approve'}
      </button>
      <button
        onClick={() => setShowReject(true)}
        disabled={isLoading}
        style={{
          flex: 1,
          padding: '12px',
          borderRadius: 10,
          border: '1.5px solid #fca5a5',
          background: 'white',
          color: '#dc2626',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        ✕ Reject
      </button>
    </div>
  );
};
