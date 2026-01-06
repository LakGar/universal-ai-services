# How to Test a Small Transaction

## Step-by-Step Guide to Test a Small Payment

### Step 1: Add a Product to Cart

1. **Go to your website** (production URL)
2. **Navigate to Buy/Robots section**: `/services/buy`
3. **Select a product** that has a **real price** (not "Contact for pricing" or $0)
   - Look for products with prices like $100, $500, etc.
   - Avoid products that require consultation
4. **Click "Add to Cart"** on the product page

### Step 2: Go to Checkout

1. **Click the cart icon** (top right)
2. **Click "Checkout"** button
3. You'll be taken to `/checkout` page

### Step 3: Complete Checkout Form

1. **Fill in shipping information**:

   - Name
   - Email
   - Address
   - City, State, ZIP
   - Phone (if required)

2. **Review order summary**:
   - Verify the total amount
   - Check product details

### Step 4: Make a Small Test Payment

**Option A: Use a Real Card (Recommended for Live Testing)**

1. **Enter real card details**:

   - Use your actual credit/debit card
   - Start with a **very small amount** ($0.50 - $1.00)
   - You can adjust quantity to make total smaller if needed

2. **Complete payment**:
   - Fill in card number, expiry, CVC
   - Enter cardholder name
   - Click "Pay $X.XX"

**Option B: Use Stripe Test Cards (If Still in Test Mode)**

If you're still using test keys, you can use Stripe's test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`
- Use any future expiry date (e.g., 12/25)
- Use any 3-digit CVC

### Step 5: Verify Payment in Stripe Dashboard

1. **Log into Stripe Dashboard**: https://dashboard.stripe.com

2. **Toggle to Live Mode** (top right):

   - Make sure you're in **Live mode** (not Test mode)
   - The toggle should show "Live mode"

3. **Check Payments**:

   - Go to **Payments** in the left sidebar
   - You should see your test transaction listed
   - Status should be **"Succeeded"** (green)

4. **View Payment Details**:
   - Click on the payment to see details:
     - Amount charged
     - Card used (last 4 digits)
     - Customer email
     - Timestamp
     - Status: "Succeeded"

### Step 6: Verify on Your Website

1. **Check Success Page**:

   - After payment, you should be redirected to `/checkout/success`
   - Should show confirmation message

2. **Check Browser Console** (optional):
   - Open Developer Tools (F12)
   - Check for any errors
   - Should see successful payment confirmation

---

## What to Look For

### ✅ Success Indicators:

- **Stripe Dashboard**:

  - Payment appears in "Payments" list
  - Status: "Succeeded" (green checkmark)
  - Amount matches what you paid
  - No error messages

- **Your Website**:

  - Redirects to success page
  - Shows confirmation message
  - Cart is cleared (optional, depends on your implementation)

- **Email** (if configured):
  - Receipt email from Stripe
  - Order confirmation email

### ❌ Failure Indicators:

- **Stripe Dashboard**:

  - Payment shows as "Failed" or "Declined"
  - Error message displayed
  - Payment doesn't appear at all

- **Your Website**:
  - Error message displayed
  - Payment form shows validation errors
  - Stays on checkout page

---

## Troubleshooting

### Payment Not Appearing in Stripe

1. **Check you're in Live Mode**:

   - Toggle must be set to "Live mode" in Stripe Dashboard
   - Not "Test mode"

2. **Check Environment Variables**:

   - Verify `STRIPE_SECRET_KEY` starts with `sk_live_` (not `sk_test_`)
   - Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_live_` (not `pk_test_`)

3. **Check API Logs**:
   - Go to Stripe Dashboard → **Developers** → **Logs**
   - Look for errors or failed API calls

### Payment Fails

1. **Check Card Details**:

   - Ensure card is valid and not expired
   - Check CVC is correct
   - Verify billing address matches card

2. **Check Stripe Logs**:

   - Dashboard → **Logs** shows detailed error messages
   - Common issues:
     - Insufficient funds
     - Card declined by bank
     - 3D Secure authentication required

3. **Check Your Code**:
   - Verify API route is working: `/api/create-payment-intent`
   - Check browser console for errors
   - Verify environment variables are set correctly

---

## Quick Test Checklist

- [ ] Added product with real price to cart
- [ ] Went to checkout page
- [ ] Filled in shipping information
- [ ] Entered payment details (real card or test card)
- [ ] Completed payment
- [ ] Redirected to success page
- [ ] Checked Stripe Dashboard → Payments
- [ ] Verified payment shows as "Succeeded"
- [ ] Confirmed amount matches what was charged

---

## Making the Amount Smaller

If you want to test with a very small amount:

1. **Option 1: Adjust Quantity**:

   - Add product to cart
   - Change quantity to 1 (if it's a low-priced item)

2. **Option 2: Use a Low-Priced Product**:

   - Look for accessories or add-ons with low prices
   - Some accessories might be $10-50

3. **Option 3: Test with $0.50**:
   - If your system allows, you can manually set a test price
   - Or use Stripe's test mode with test cards for $0.50 transactions

---

## Important Notes

⚠️ **Real Money**:

- In Live mode, you're using **real money**
- Start with the smallest amount possible
- You can refund test transactions if needed

💰 **Refunds**:

- If you need to refund a test transaction:
  - Go to Stripe Dashboard → Payments
  - Click on the payment
  - Click "Refund" button
  - Refund will process immediately

🔒 **Security**:

- Never share your live API keys
- Test transactions are real - be careful
- Monitor your Stripe account regularly

---

## Next Steps After Successful Test

1. ✅ **Monitor Dashboard**: Check Stripe Dashboard regularly
2. ✅ **Set Up Webhooks**: Configure webhooks for payment events
3. ✅ **Set Up Email Notifications**: Get notified of successful payments
4. ✅ **Test Different Scenarios**:
   - Test with different card types
   - Test with different amounts
   - Test error scenarios (declined cards)

---

## Need Help?

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Stripe Support**: https://support.stripe.com
- **Stripe Logs**: Dashboard → Developers → Logs (for debugging)
