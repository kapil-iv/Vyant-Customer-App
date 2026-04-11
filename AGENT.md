# AGENT.md

## Project Scope

Frontend for Vyant backend (`{{BASE_URL}}`, e.g. `http://localhost:5000`).

Health/docs endpoints:

- `GET /`
- `GET /api-docs`

## Non-Negotiable Backend Contract

1. Auth (customer only):
   - `POST /api/auth/register` body: `{ name, email, password, role, shopName? }`
   - `POST /api/auth/login` body: `{ email, password }`
   - `POST /api/auth/google` body: `{ idToken }` (customer only)
2. Products/Discovery:
   - `GET /api/products`
   - `GET /api/products/featured`
   - `GET /api/products/:id`
   - `GET /api/products/facets`
   - `GET /api/search/products`
4. Cart:
   - `POST /api/cart/add` body: `{ productId, quantity>=1 }`
   - `GET /api/cart`
   - `PATCH /api/cart/items/:itemId`
   - `DELETE /api/cart/items/:itemId`
   - `POST /api/cart/merge`
   - `DELETE /api/cart`
5. Coupons:
   - `POST /api/coupons/validate`
   - `POST /api/coupons/apply`
   - `DELETE /api/coupons/:code`
   - `GET /api/coupons/active`
6. Sales:
   - `GET /api/sales`
   - `GET /api/sales/highlights`
   - `GET /api/sales/:id`
7. Checkout:
   - `POST /api/checkout/quote`
   - `POST /api/checkout/availability`
8. Payments:
   - `POST /api/payment/create-order` body: `{ amount }`
   - `POST /api/payment/verify` body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, amount }`
   - `GET /api/payments/methods`
9. Orders:
   - `POST /api/orders` body: `{ paymentOrderId, paymentId, influencerLinkCode? }`
   - `GET /api/orders`
   - `PATCH /api/orders/:id/cancel` only if `trackingStatus === "preparing"`
   - `POST /api/orders/:id/return`
   - `GET /api/orders/:id/timeline`
10. Customer profile:
   - Addresses: `GET/POST/PUT/DELETE /api/addresses`
   - Wishlist: `GET/POST/DELETE /api/wishlist`
   - Reviews: `GET /api/reviews/:productId`, `POST /api/reviews`

## Hard Logic Rules

1. Enforce payment sequence:
   1. create payment order
   2. verify payment
   3. create order
2. Never create order if verify fails/cancels.
3. Query functions must always return defined values (`[]`/fallback object), never `undefined`.
4. Cancel button uses `trackingStatus` (not `status`) for eligibility.
5. Product field is `name` (not `title`).
6. Treat `category`, `materialType`, `sizes`, and `colors` as discovery/selection fields.
7. On product page, if size/color is required, disable add-to-cart until selection is made.
8. Cart line identity must be stable by variant (`productId + selectedSize + selectedColor`) for conflict checks.
9. Checkout must operate on user-selected cart items, not implicitly the full cart.
10. Checkout must require deliverable pincode (selected address or typed pincode + serviceability check) before payment.
11. Return request should include body payload expected by backend validator (currently frontend sends `{ reason }`).

## Compliance Rules

1. Explicit consent controls for optional analytics/personalization.
2. No PII in logs/client config.
3. Country of Origin must remain visible in product UI.
4. Grievance officer details must remain visible.

## Quality Gates

- `npm run lint`
- `npm run test`
- `npm run build`

All must pass before finalization.
