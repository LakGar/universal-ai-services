# Universal AI Services

Universal AI Services is an AI & robotics consultancy that guides leaders through every stage of adoption with proven playbooks. This Next.js application provides a platform for buying, renting, and consulting on cutting-edge robotics solutions.

## Features

- 🛒 **E-commerce**: Buy and rent robots with full shopping cart functionality
- 📅 **Consultation Booking**: Integrated Calendly scheduling
- 🎯 **Product Filtering**: Filter by model (G02, G1, R1, H1) or manufacturer (Unitree, Nova KUKA, OpenDroid)
- 📱 **Responsive Design**: Mobile-first design with sidebar navigation
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- 💳 **Payment Processing**: Stripe integration for secure payments
- 📊 **Analytics Ready**: Google Analytics 4 and error tracking setup

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Stripe account (for payment processing)
- Calendly account (for consultations)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/universal-ai-services.git
cd universal-ai-services
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the root directory:
```env
# Stripe Payment Processing (Required for checkout)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Google Analytics 4 (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry Error Tracking (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://...

# Appwrite Backend (Optional - only if using Appwrite)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
APPWRITE_API_KEY=your-api-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` (create from template) or `DEPLOYMENT_CHECKLIST.md` for a complete list of required environment variables.

### Required for Production:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key (server-side only)

### Optional:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics 4 measurement ID
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking
- Appwrite variables (if using Appwrite backend)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── checkout/          # Checkout pages
│   ├── services/          # Service pages (buy, rent, etc.)
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── landing/          # Landing page components
├── contexts/             # React contexts (cart, wishlist, etc.)
├── lib/                  # Utility functions
│   ├── logger.ts         # Centralized logging
│   ├── analytics.ts      # Analytics tracking
│   └── sentry.ts         # Error tracking setup
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

See `DEPLOYMENT_CHECKLIST.md` for a comprehensive deployment guide.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## Documentation

- `DEPLOYMENT_CHECKLIST.md` - Complete deployment readiness checklist
- `MONITORING_SETUP.md` - Setup guide for monitoring and analytics
- `APPWRITE_SETUP.md` - Appwrite backend setup (if using)
- `GOOGLE_DRIVE_IMAGES_GUIDE.md` - Guide for using Google Drive images

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Payment**: Stripe
- **Scheduling**: Calendly
- **State Management**: React Context API

## License

[Add your license here]

## Support

For support, book a consultation through the website or contact us through the contact form.
