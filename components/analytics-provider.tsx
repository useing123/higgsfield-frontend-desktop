'use client';

import { useEffect } from 'react';
import { initAmplitude } from '@/lib/analytics/amplitude';
import { usePageTracking } from '@/hooks/useAnalytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Amplitude on client side
    initAmplitude();
  }, []);

  // Track page views automatically
  usePageTracking();

  return <>{children}</>;
}
