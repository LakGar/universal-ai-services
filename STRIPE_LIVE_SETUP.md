# Stripe Live Mode Setup Guide

## Overview
Your Stripe integration is currently working in **test/sandbox mode**. To enable **live/production payments**, you need to:

1. Get your live API keys from Stripe
2. Update environment variables
3. Deploy with live keys
4. Test the live integration

---

## Step 1: Get Live API Keys from Stripe

1. **Log into your Stripe Dashboard**: https://dashboard.stripe.com
2. **Toggle to Live Mode**: Click the toggle switch in the top right (it should say "Test mode" - switch it to "Live mode")
3. **Get your API keys**:
   - Go to **Developers** → **API keys**
   - Copy your **Publishable key** (starts with `pk_live_...`)
   - Copy your **Secret key** (starts with `sk_live_...`) - Click "Reveal" to see it

⚠️ **IMPORTANT**: 
- Never commit live keys to git
- Never use `NEXT_PUBLIC_` prefix for secret keys
- Keep secret keys secure and server-side only

---

## Step 2: Update Environment Variables

### For Local Development (`.env.local`)

Update your `.env.local` file:

```env
# Stripe Payment Processing - LIVE MODE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
```

### For Production Deployment

The method depends on your hosting platform:

#### **Vercel**
1. Go to your project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add/Update:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
   - `STRIPE_SECRET_KEY` = `sk_live_...`
4. Select **Production** environment (and Preview if needed)
5. Redeploy your application

#### **Netlify**
1. Go to **Site settings** → **Environment variables**
2. Add/Update the variables
3. Redeploy

#### **Other Platforms**
- Add environment variables in your platform's dashboard
- Ensure `STRIPE_SECRET_KEY` is set as a server-side variable (not exposed to client)
- Redeploy after adding variables

---

## Step 3: Verify Your Configuration

### Check Current Keys

Your code uses these environment variables:

**Client-side** (`components/checkout1.tsx`):
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Used to initialize Stripe.js

**Server-side** (`app/api/create-payment-intent/route.ts`):
- `STRIPE_SECRET_KEY` - Used to create payment intents

### Key Format

- **Test keys**: Start with `pk_test_` and `sk_test_`
- **Live keys**: Start with `pk_live_` and `sk_live_`

---

## Step 4: Test Live Mode

### Before Going Live

1. **Test with small amounts first** ($0.50 or $1.00)
2. **Use real card numbers** (not test cards):
   - Use your actual credit/debit card
   - Start with small test transactions
3. **Monitor Stripe Dashboard**:
   - Check **Payments** section for successful transactions
   - Review any errors or declined payments

### Test Cards (for testing before real transactions)

Stripe provides test cards that work in live mode for testing:
- See: https://stripe.com/docs/testing#cards

### Common Issues

1. **"Stripe is not configured" error**:
   - Check environment variables are set correctly
   - Ensure keys start with `pk_live_` and `sk_live_`
   - Restart your development server after changing `.env.local`

2. **Payment fails**:
   - Check Stripe Dashboard → **Logs** for error details
   - Verify your Stripe account is activated for live mode
   - Ensure your account has completed onboarding

3. **Keys not working**:
   - Verify you copied the full key (they're long!)
   - Check for extra spaces or newlines
   - Ensure you're using the correct environment (production vs preview)

---

## Step 5: Security Checklist

- ✅ Secret key (`STRIPE_SECRET_KEY`) is **NOT** prefixed with `NEXT_PUBLIC_`
- ✅ Secret key is only set server-side (not exposed to browser)
- ✅ `.env.local` is in `.gitignore` (never commit keys)
- ✅ Live keys are only in production environment variables
- ✅ Test keys remain in development for testing

---

## Step 6: Monitor Production

After going live:

1. **Monitor Stripe Dashboard** regularly
2. **Set up webhooks** (optional but recommended):
   - Go to **Developers** → **Webhooks**
   - Add endpoint for payment events
   - See Stripe docs for webhook setup

3. **Set up email notifications** in Stripe:
   - Get notified of successful payments
   - Get alerts for failed payments

---

## Quick Reference

### Environment Variables Needed

```env
# Client-side (public)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Server-side (secret - never expose)
STRIPE_SECRET_KEY=sk_live_...
```

### Files Using Stripe

- `components/checkout1.tsx` - Client-side Stripe initialization
- `components/stripe-payment-form.tsx` - Payment form component
- `app/api/create-payment-intent/route.ts` - Server-side payment intent creation

### Stripe Dashboard Links

- **Live Mode Dashboard**: https://dashboard.stripe.com (toggle to Live mode)
- **API Keys**: https://dashboard.stripe.com/apikeys
- **Payments**: https://dashboard.stripe.com/payments
- **Logs**: https://dashboard.stripe.com/logs

---

## Need Help?

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com
- **Test vs Live Mode**: https://stripe.com/docs/keys

---

## Summary Checklist

- [ ] Get live API keys from Stripe Dashboard (Live mode)
- [ ] Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` with `pk_live_...`
- [ ] Update `STRIPE_SECRET_KEY` with `sk_live_...`
- [ ] Set environment variables in production hosting platform
- [ ] Verify keys start with `pk_live_` and `sk_live_` (not `pk_test_`/`sk_test_`)
- [ ] Redeploy application
- [ ] Test with small real transaction
- [ ] Monitor Stripe Dashboard for successful payments
- [ ] Set up webhooks (optional but recommended)

