# Vyant Customer App

Path: `E:\Vyant-Customer-App`

## 1. Purpose

Customer storefront for:
- catalog discovery
- wishlist/cart/checkout
- order tracking
- admin-controlled theme + marketing visibility

## 2. Backend Connections

- Theme: `/api/themes/active`
- Products: `/api/products`, `/api/products/featured`, `/api/products/facets`
- Ads: `/api/ads/active`
- Marketing banners: `/api/marketing/active`
- Checkout/payment: `/api/checkout/*`, `/api/payment/*`
- Orders: `/api/orders/*`, `/api/orders/:id/timeline`

## 3. Theme System (Fixed)

Admin theme updates now reflect in customer app via runtime CSS variables:
- [src/features/home/themeRuntime.js](/e:/Vyant-Customer-App/src/features/home/themeRuntime.js)
- [src/pages/HomePage.jsx](/e:/Vyant-Customer-App/src/pages/HomePage.jsx)
- [src/shared/components/AppShell.jsx](/e:/Vyant-Customer-App/src/shared/components/AppShell.jsx)
- [src/index.css](/e:/Vyant-Customer-App/src/index.css)

Flow:
1. Company admin creates/edits active theme.
2. Customer home polls `/api/themes/active`.
3. Tokens applied to CSS vars (`--vy-primary`, etc).
4. Header/buttons/colors update from theme.

## 4. Hard Rules

- Do not store PII in localStorage/sessionStorage.
- Keep JWT token handling centralized in API client.
- Checkout must require delivery location.
- Do not hardcode commission/platform-fee logic in customer app.

## 5. File-to-File Manual Coding Map

1. API layer
- [src/lib/apiClient.js](/e:/Vyant-Customer-App/src/lib/apiClient.js)
- [src/shared/api/baseApi.js](/e:/Vyant-Customer-App/src/shared/api/baseApi.js)
- [src/features/home/api.js](/e:/Vyant-Customer-App/src/features/home/api.js)

2. Core pages
- Home: [src/pages/HomePage.jsx](/e:/Vyant-Customer-App/src/pages/HomePage.jsx)
- Checkout: [src/features/checkout/pages/CheckoutPage.jsx](/e:/Vyant-Customer-App/src/features/checkout/pages/CheckoutPage.jsx)
- Orders: [src/features/orders/pages/OrdersPage.jsx](/e:/Vyant-Customer-App/src/features/orders/pages/OrdersPage.jsx)
- Order detail: [src/features/orders/pages/OrderDetailPage.jsx](/e:/Vyant-Customer-App/src/features/orders/pages/OrderDetailPage.jsx)

3. Shell/layout
- [src/shared/components/AppShell.jsx](/e:/Vyant-Customer-App/src/shared/components/AppShell.jsx)

## 6. Local Run

```bash
cd E:\Vyant-Customer-App
npm install
npm run dev
```

Set `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```
