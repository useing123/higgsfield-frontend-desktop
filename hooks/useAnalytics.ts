import { useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageViewed } from '@/lib/analytics/events';

// Generate or retrieve session ID
const getSessionId = () => {
  const key = 'higgsfield_session_id';
  const sessionTimeout = 30 * 60 * 1000; // 30 minutes

  if (typeof window === 'undefined') return '';

  const stored = sessionStorage.getItem(key);
  const timestamp = sessionStorage.getItem(`${key}_timestamp`);

  if (stored && timestamp) {
    const age = Date.now() - parseInt(timestamp);
    if (age < sessionTimeout) {
      return stored;
    }
  }

  // Create new session
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  sessionStorage.setItem(key, sessionId);
  sessionStorage.setItem(`${key}_timestamp`, Date.now().toString());

  return sessionId;
};

// Hook to automatically track page views
export const usePageTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const pageTitle = getPageTitle(pathname);

    // Extract UTM parameters from URL
    const utmSource = searchParams?.get('utm_source') || undefined;
    const utmMedium = searchParams?.get('utm_medium') || undefined;
    const utmCampaign = searchParams?.get('utm_campaign') || undefined;

    trackPageViewed({
      pagePath: pathname,
      pageTitle: pageTitle,
      referrer: document.referrer,
      utmSource,
      utmMedium,
      utmCampaign,
    });
  }, [pathname, searchParams]);
};

// Map pathname to human-readable title
const getPageTitle = (pathname: string): string => {
  const titles: Record<string, string> = {
    '/': 'Home',
    '/lite': 'Chat Interface',
    '/generate': 'Pro Mode',
    '/community': 'Community Gallery',
    '/pricing': 'Pricing',
    '/gallery': 'Gallery',
  };

  // Handle dynamic routes like /community/[id]
  if (pathname.startsWith('/community/') && pathname !== '/community') {
    return 'Community Post Detail';
  }

  return titles[pathname] || pathname;
};

// Hook to get session ID
export const useSessionId = () => {
  return useCallback(() => getSessionId(), []);
};

// Main analytics hook
export const useAnalytics = () => {
  const getSession = useSessionId();

  return {
    sessionId: getSession(),
    getSessionId: getSession,
  };
};
