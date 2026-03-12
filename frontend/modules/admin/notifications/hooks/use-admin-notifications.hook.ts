'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import { kycApi } from '@/lib/api/kyc.api';

export const useAdminNotifications = () => {
  const [pendingKycCount, setPendingKycCount] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const fetchCount = useEffectEvent(async () => {
    try {
      const res = await kycApi.getPendingCount();
      setPendingKycCount(res.count);
    } catch {
      // non-critical, silent fail
    }
  });

  useEffect(() => {
    const initialFetchTimeout = setTimeout(() => {
      void fetchCount();
    }, 0);
    const intervalId = setInterval(() => {
      void fetchCount();
    }, 30_000);

    return () => {
      clearTimeout(initialFetchTimeout);
      clearInterval(intervalId);
    };
  }, []);

  return {
    pendingKycCount,
    isPanelOpen,
    openPanel: () => setIsPanelOpen(true),
    closePanel: () => setIsPanelOpen(false),
    togglePanel: () => setIsPanelOpen((v) => !v),
  };
};
