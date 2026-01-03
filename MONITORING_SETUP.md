# Monitoring & Analytics Setup Guide

## 1. Error Tracking with Sentry

### Installation

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

The wizard will:
- Create `sentry.client.config.ts` and `sentry.server.config.ts`
- Update `next.config.ts` with Sentry webpack plugin
- Create `sentry.properties` file

### Configuration

1. Get your DSN from [Sentry Dashboard](https://sentry.io)
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
   SENTRY_AUTH_TOKEN=your_auth_token_here
   ```

3. Update `lib/sentry.ts` to initialize Sentry:
   ```typescript
   import * as Sentry from "@sentry/nextjs";
   
   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });
   ```

4. Update `lib/logger.ts` to use Sentry:
   ```typescript
   import * as Sentry from "@sentry/nextjs";
   
   // In logger.error():
   Sentry.captureException(error, { extra: context });
   ```

### Features

- Automatic error capture
- Source maps for better debugging
- Performance monitoring
- Release tracking
- User context

---

## 2. Analytics with Google Analytics 4

### Setup

1. Create a GA4 property in [Google Analytics](https://analytics.google.com)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

4. Add the GA script to `app/layout.tsx`:
   ```tsx
   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
     strategy="afterInteractive"
   />
   <Script id="google-analytics" strategy="afterInteractive">
     {`
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
     `}
   </Script>
   ```

### Usage

```typescript
import { trackEvent, trackPageView } from "@/lib/analytics";

// Track custom events
trackEvent("purchase", {
  value: 100,
  currency: "USD",
  items: [...]
});

// Track page views (usually in useEffect)
useEffect(() => {
  trackPageView(window.location.pathname);
}, []);
```

### Events to Track

- **Page Views**: Automatic via `trackPageView()`
- **Product Views**: When user views product detail page
- **Add to Cart**: When item added to cart
- **Checkout Started**: When user begins checkout
- **Purchase**: When payment is completed
- **Consultation Scheduled**: When Calendly event is scheduled
- **Search**: When user searches for products
- **Filter Applied**: When user applies filters

---

## 3. Uptime Monitoring

### Recommended Services

1. **UptimeRobot** (Free tier available)
   - Monitor: `https://your-domain.com`
   - Check interval: 5 minutes
   - Alert via email/SMS/Slack

2. **Pingdom** (Paid)
   - More advanced monitoring
   - Real user monitoring
   - Transaction monitoring

3. **StatusCake** (Free tier available)
   - Uptime monitoring
   - SSL certificate monitoring
   - Domain expiration alerts

### Setup Checklist

- [ ] Set up uptime monitoring for main domain
- [ ] Set up monitoring for API endpoints
- [ ] Configure alert notifications
- [ ] Set up status page (optional)
- [ ] Monitor SSL certificate expiration
- [ ] Set up monitoring for critical pages:
  - [ ] Homepage (`/`)
  - [ ] Checkout (`/checkout`)
  - [ ] Payment API (`/api/create-payment-intent`)

### Health Check Endpoint

Create `app/api/health/route.ts`:

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
```

Monitor: `https://your-domain.com/api/health`

---

## 4. Performance Monitoring

### Next.js Analytics

Next.js provides built-in analytics:

1. Enable in `next.config.ts`:
   ```typescript
   const nextConfig = {
     analyticsId: 'your-analytics-id',
   };
   ```

2. Or use Vercel Analytics (if deployed on Vercel):
   - Automatically enabled on Vercel
   - View in Vercel dashboard

### Web Vitals

Track Core Web Vitals using `next/web-vitals`:

```typescript
// app/layout.tsx or _app.tsx
import { reportWebVitals } from 'next/web-vitals';

export function reportWebVitals(metric) {
  // Send to analytics
  trackEvent('web_vital', {
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
}
```

---

## 5. Log Aggregation

### Recommended Services

1. **Logtail** (formerly LogDNA)
   - Easy integration
   - Real-time log viewing
   - Free tier available

2. **Papertrail**
   - Simple log management
   - Good for small projects

3. **Datadog** (Enterprise)
   - Full observability platform
   - Logs, metrics, traces

### Setup

1. Install logging service SDK
2. Update `lib/logger.ts` to send logs to service
3. Configure log levels and filters
4. Set up alerts for critical errors

---

## 6. Security Monitoring

### Recommended Tools

1. **Snyk** - Dependency vulnerability scanning
2. **OWASP ZAP** - Security testing
3. **Cloudflare** - DDoS protection and WAF

### Checklist

- [ ] Set up dependency scanning (Snyk, Dependabot)
- [ ] Configure WAF rules (if using Cloudflare)
- [ ] Set up rate limiting
- [ ] Monitor for suspicious activity
- [ ] Set up SSL/TLS monitoring

---

## 7. Cost Monitoring

### Cloud Provider Tools

- **Vercel**: Built-in usage dashboard
- **AWS**: Cost Explorer
- **Google Cloud**: Billing dashboard

### Monitor

- API request volume
- Bandwidth usage
- Database queries
- Storage usage
- Third-party API costs (Stripe, Calendly, etc.)

---

## Summary Checklist

### Before Production

- [ ] Set up Sentry error tracking
- [ ] Configure Google Analytics 4
- [ ] Set up uptime monitoring
- [ ] Create health check endpoint
- [ ] Configure alert notifications
- [ ] Set up performance monitoring
- [ ] Enable security scanning
- [ ] Configure log aggregation
- [ ] Set up cost monitoring

### Post-Deployment

- [ ] Verify all monitoring is working
- [ ] Test alert notifications
- [ ] Review initial analytics data
- [ ] Set up dashboards
- [ ] Document runbooks for common issues

