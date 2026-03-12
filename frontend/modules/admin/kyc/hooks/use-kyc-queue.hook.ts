'use client';

import { useState, useCallback, useEffect } from 'react';
import { kycApi, KycSubmission } from '@/lib/api/kyc.api';

interface State {
  submissions: KycSubmission[];
  selected: KycSubmission | null;
  isLoading: boolean;
  isReviewing: boolean;
  error: string;
  toast: string;
}

export const useKycQueue = () => {
  const [state, setState] = useState<State>({
    submissions: [],
    selected: null,
    isLoading: true,
    isReviewing: false,
    error: '',
    toast: '',
  });

  const set = (patch: Partial<State>) => setState((prev) => ({ ...prev, ...patch }));

  const fetchPending = useCallback(async () => {
    set({ isLoading: true, error: '' });
    try {
      const data = await kycApi.getPending();
      set({ submissions: data });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to load queue' });
    } finally {
      set({ isLoading: false });
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const selectSubmission = useCallback(async (id: string) => {
    try {
      const detail = await kycApi.getById(id);
      set({ selected: detail });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to load detail' });
    }
  }, []);

  const closeDetail = useCallback(() => set({ selected: null }), []);

  const handleApprove = useCallback(async (id: string) => {
    set({ isReviewing: true, error: '' });
    try {
      await kycApi.review(id, { decision: 'approved' });
      setState((prev) => ({
        ...prev,
        selected: null,
        isReviewing: false,
        submissions: prev.submissions.filter((s) => s.id !== id),
        toast: '✓ Doctor approved and notified by email',
      }));
      setTimeout(() => set({ toast: '' }), 4000);
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to approve', isReviewing: false });
    }
  }, []);

  const handleReject = useCallback(async (id: string, reason: string) => {
    if (!reason.trim()) {
      set({ error: 'Please provide a rejection reason' });
      return;
    }
    set({ isReviewing: true, error: '' });
    try {
      await kycApi.review(id, { decision: 'rejected', rejectionReason: reason });
      setState((prev) => ({
        ...prev,
        selected: null,
        isReviewing: false,
        submissions: prev.submissions.filter((s) => s.id !== id),
        toast: '✓ Doctor rejected and notified by email',
      }));
      setTimeout(() => set({ toast: '' }), 4000);
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to reject', isReviewing: false });
    }
  }, []);

  return {
    ...state,
    fetchPending,
    selectSubmission,
    closeDetail,
    handleApprove,
    handleReject,
  };
};
