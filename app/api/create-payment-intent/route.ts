import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Get Stripe secret key - check both possible variable names
// Note: STRIPE_SECRET_KEY should NOT have NEXT_PUBLIC_ prefix for security
const stripeSecretKey = 
  process.env.STRIPE_SECRET_KEY || 
  process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY is not set in environment variables");
}

// Initialize Stripe only if key is available
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-12-15.clover",
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { 
          error: "Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment variables. Note: Do NOT use NEXT_PUBLIC_ prefix for secret keys." 
        },
        { status: 500 }
      );
    }

    const { amount, currency = "usd" } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Amount must be greater than 0." },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || isNaN(amount)) {
      return NextResponse.json(
        { error: "Amount must be a valid number." },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        // Add any metadata you want to track
        created_at: new Date().toISOString(),
      },
    });

    if (!paymentIntent.client_secret) {
      return NextResponse.json(
        { error: "Failed to create payment intent client secret." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    console.error("Error creating payment intent:", error);
    
    if (error instanceof Stripe.errors.StripeError) {
      const statusCode = error.statusCode || 500;
      return NextResponse.json(
        { error: error.message || "Stripe error occurred" },
        { status: statusCode }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to create payment intent" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

