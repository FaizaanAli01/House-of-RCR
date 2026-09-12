# Phase 5 Step 1 — Razorpay payment architecture

## Current flow (unchanged)

1. `CheckoutModal` collects a shipping address and calls `orderApi.createOrder`.
2. `POST /api/orders` authenticates the customer, reloads the database cart and product prices, validates stock, calculates discounts/tax/shipping, creates the order, decrements stock, and clears the cart.
3. Existing customer and admin order views read the resulting order.

No checkout, order, stock, authentication, or admin behavior is changed in Step 1.

## Approved integration boundary for later steps

1. The checkout review action will request a Razorpay order from an authenticated backend endpoint.
2. The backend will calculate the payable amount from the database cart and prices; it will not accept the frontend total as authoritative.
3. The frontend may open Razorpay Checkout using the public key ID and gateway order ID returned by the backend. It must never receive the key secret or handle raw card details.
4. The frontend callback will send the Razorpay order ID, payment ID, and signature to the backend.
5. The backend will verify the signature with the server-only key secret using `verifyRazorpayPaymentSignature`.
6. Only after successful backend verification may a later step mark payment as paid and finalize order/stock/cart behavior. A frontend success callback alone is never proof of payment.

## Step 1 safety state

- `PAYMENTS_ENABLED` defaults to false.
- Only `RAZORPAY_MODE=test` is accepted by the preparation module.
- No payment routes are mounted.
- No Razorpay SDK or checkout script is loaded.
- No real payment can be initiated.
- Existing order and stock logic is untouched.

## Environment variables

Configure real test credentials only in the server's uncommitted `.env` during the approved test-mode step. Never commit credentials.

- `PAYMENTS_ENABLED=false`
- `RAZORPAY_MODE=test`
- `RAZORPAY_KEY_ID=`
- `RAZORPAY_KEY_SECRET=`
- `RAZORPAY_CURRENCY=INR`
