'use client';

import { useEffect, useState } from 'react';
import { DocNearLoader } from '@/components/common/loader/docnear-splash-loader';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell — shows the DocNear splash loader on first page load,
 * then fades it out once the app has hydrated.
 *
 * Total splash duration: ~2.6s (matches the loader's phase 4 at 2100ms + fade)
 */
export function AppShell({ children }: AppShellProps) {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Wait for all 4 loader phases (2100ms) + a short hold, then fade out
    const showTimer = setTimeout(() => {
      setReady(true);
      // Small delay so the fade-out feels intentional, not abrupt
      setTimeout(() => setVisible(false), 400);
    }, 2600);

    return () => clearTimeout(showTimer);
  }, []);

  return (
    <>
      {/* Splash overlay — fades out after loader completes */}
      {visible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            transition: ready ? 'opacity 0.4s ease' : 'none',
            opacity: ready ? 0 : 1,
            pointerEvents: ready ? 'none' : 'all',
          }}
        >
          <DocNearLoader fullscreen />
        </div>
      )}

      {/* App content — rendered beneath, becomes visible after splash */}
      <div
        style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {children}
      </div>
    </>
  );
}
