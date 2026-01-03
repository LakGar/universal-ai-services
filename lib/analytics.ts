/**
 * Analytics Tracking Setup
 * 
 * Supports multiple analytics providers:
 * - Google Analytics 4 (GA4)
 * - Custom analytics events
 * 
 * To enable Google Analytics:
 * 1. Add NEXT_PUBLIC_GA_MEASUREMENT_ID to .env.local
 * 2. The script will be loaded automatically in app/layout.tsx
 */

// Google Analytics 4 event tracking
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
): void => {
  if (typeof window === "undefined") return;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag("event", eventName, eventParams);
  }

  // Custom analytics (add your own tracking here)
  // Example: Send to your analytics API
  if (process.env.NODE_ENV === "production") {
    // Add custom analytics here
  }
};

// Page view tracking
export const trackPageView = (url: string): void => {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", {
      page_path: url,
    });
  }
};

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

