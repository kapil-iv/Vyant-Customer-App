# copiolet-instruction.md

## Copilot Instructions (Vyant Frontend)

Generate code that matches the backend API contract exactly.

## API Contract to Follow

### Auth

- `POST /api/auth/register` with `{ name, email, password, role, shopName? }`
- `POST /api/auth/login` with `{ email, password }`
- `POST /api/auth/google` with `{ idToken }` (customer only)

### Products

- Use `name` field (not `title`)
- Read list: `GET /api/products`
- Read featured: `GET /api/products/featured`
- Read detail: `GET /api/products/:id`
- Treat `category` and `materialType` as searchable and displayable fields
- Product options can include `sizes[]` and `colors[]`
- Use `GET /api/products/facets` and `GET /api/search/products` for server filters/search where applicable

### Cart

- Add: `POST /api/cart/add`
- Get: `GET /api/cart`
- Update one item: `PATCH /api/cart/items/:itemId` with `{ quantity?, selectedSize?, selectedColor? }`
- Remove one item: `DELETE /api/cart/items/:itemId`
- Merge guest cart: `POST /api/cart/merge`
- Clear: `DELETE /api/cart`
- Cart item conflict key is `productId + selectedSize + selectedColor` (increment quantity if exists)
- UI should support selected-item checkout (checkbox per row)

### Coupons

- `POST /api/coupons/validate`
- `POST /api/coupons/apply`
- `DELETE /api/coupons/:code`
- `GET /api/coupons/active`

### Sales

- `GET /api/sales`
- `GET /api/sales/highlights`
- `GET /api/sales/:id`

### Checkout

- `POST /api/checkout/quote`
- `POST /api/checkout/availability`
- Only selected cart items should be included in quote/availability/order flow
- Require serviceable pincode before allowing payment

### Customer Profile

- Addresses: `GET/POST/PUT/DELETE /api/addresses`
- Wishlist: `GET /api/wishlist`, `POST /api/wishlist/:productId`, `DELETE /api/wishlist/:productId`
- Reviews: `GET /api/reviews/:productId`, `POST /api/reviews` (verified purchase)

### Payments and Orders

1. `POST /api/payment/create-order` with `{ amount }`
2. `POST /api/payment/verify` with `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, amount }`
3. `POST /api/orders` with `{ paymentOrderId, paymentId, influencerLinkCode? }`
4. Prefer `GET /api/payments/methods?cartValue=&pincode=` to drive payment-method UI
5. `POST /api/orders/:id/return` should send payload required by backend validator (frontend currently sends `{ reason }`)

Do not place order if verify fails/cancels.

### Cancel Logic

- `PATCH /api/orders/:id/cancel`
- Allow only when `trackingStatus === "preparing"`

## Engineering Rules

1. Keep TypeScript strict.
2. Do not introduce `any` in core flow code.
3. Reuse shared typed API/error helpers.
4. Keep lazy routes and mobile-first UX.
5. Use skeletons for primary loading states.
6. Avoid PII in logs/errors.
7. For image galleries, never render `<img src=\"\">`; render placeholder when URL is missing.

## i18n and Compliance

1. Update both `en.json` and `hi.json` for any new strings.
2. Keep consent banner explicit for optional data collection.
3. Preserve Country of Origin and grievance information in UI.

## Final Checks

Run before finalizing:

- `npm run lint`
- `npm run test`
- `npm run build`
