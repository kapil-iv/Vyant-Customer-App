# Customer App Architecture

## A. Layers

1. Routing + pages
- `src/pages/*`
- feature pages under `src/features/*/pages`

2. State
- Redux slices + Zustand user store

3. API
- axios clients in `src/lib/apiClient.js` and `src/shared/api/baseApi.js`

4. UI Composition
- shared shell (`AppShell`) + feature components (products, checkout, orders)

## B. Theme Runtime

- Theme is server-controlled and applied client-side via CSS vars.
- Runtime adapter:
  - [src/features/home/themeRuntime.js](/e:/Vyant-Customer-App/src/features/home/themeRuntime.js)
- Trigger point:
  - [src/pages/HomePage.jsx](/e:/Vyant-Customer-App/src/pages/HomePage.jsx)

## C. Contract-Sensitive Files

- Home data contract:
  - [src/features/home/api.js](/e:/Vyant-Customer-App/src/features/home/api.js)
- Checkout contract:
  - [src/features/checkout/pages/CheckoutPage.jsx](/e:/Vyant-Customer-App/src/features/checkout/pages/CheckoutPage.jsx)
- Orders timeline contract:
  - [src/features/orders/pages/OrderDetailPage.jsx](/e:/Vyant-Customer-App/src/features/orders/pages/OrderDetailPage.jsx)

## D. Manual Change Checklist

1. Change API function first.
2. Update page/component consuming response shape.
3. Validate auth header still applied in interceptor.
4. Run `npm run build`.
5. Update docs when endpoint payload/response changes.
