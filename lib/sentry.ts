/**
 * Sentry Error Tracking Setup
 * 
 * To enable Sentry:
 * 1. Install: npm install @sentry/nextjs
 * 2. Run: npx @sentry/wizard@latest -i nextjs
 * 3. Add NEXT_PUBLIC_SENTRY_DSN to .env.local
 * 4. Update this file to use the actual Sentry SDK
 */

// Placeholder for Sentry initialization
// Uncomment and configure after installing @sentry/nextjs

/*
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === "development",
});
*/

// Type declaration for window.Sentry (used in logger.ts)
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error, options?: { extra?: Record<string, unknown> }) => void;
      captureMessage: (message: string, options?: { level?: string; extra?: Record<string, unknown> }) => void;
    };
  }
}

export {};

