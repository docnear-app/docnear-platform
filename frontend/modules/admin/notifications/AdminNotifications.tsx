'use client';

import { NotificationBell } from './components/NotificationBell';
import { NotificationPanel } from './components/NotificationPanel';
import { useAdminNotifications } from './hooks/use-admin-notifications.hook';

export const AdminNotifications = () => {
  const { pendingKycCount, isPanelOpen, togglePanel, closePanel } = useAdminNotifications();

  return (
    <div style={{ position: 'relative' }}>
      <NotificationBell count={pendingKycCount} onClick={togglePanel} />
      {isPanelOpen && <NotificationPanel count={pendingKycCount} onClose={closePanel} />}
    </div>
  );
};
