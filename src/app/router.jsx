import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../shared/components/AppShell";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { HomePage } from "../pages/HomePage";
import { SalesPage } from "../pages/SalesPage";
import { SettingsPage } from "../pages/SettingsPage";
import { ProductDetailPage } from "../features/products/pages/ProductDetailPage";
import { ProductListPage } from "../features/products/pages/ProductListPage";
import { WishlistPage } from "../features/wishlist/pages/WishlistPage";
import { OrdersPage } from "../features/orders/pages/OrdersPage";
import { OrderDetailPage } from "../features/orders/pages/OrderDetailPage";
import { AddressBookPage } from "../features/address/pages/AddressBookPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { CartPage } from "../features/cart/pages/CartPage";
import { CheckoutPage } from "../features/checkout/pages/CheckoutPage";
import { CheckoutResultPage } from "../pages/CheckoutResultPage";
import { InfluencerPage } from "../pages/InfluencerPage";
import { ShopsPage } from "../pages/ShopsPage";
import { ShopDetailPage } from "../pages/ShopDetailPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "sales", element: <SalesPage /> },
      { path: "shops", element: <ShopsPage /> },
      { path: "shops/:shopId", element: <ShopDetailPage /> },
      { path: "influencer", element: <InfluencerPage /> },
      { path: "products", element: <ProductListPage /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "cart", element: <CartPage /> },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        )
      },
      {
        path: "checkout/result/:state",
        element: <CheckoutResultPage />
      },
      {
        path: "wishlist",
        element: (
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        )
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        )
      },
      {
        path: "orders/:id",
        element: (
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        )
      },
      {
        path: "account/addresses",
        element: (
          <ProtectedRoute>
            <AddressBookPage />
          </ProtectedRoute>
        )
      },
      {
        path: "account/settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        )
      }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  }
});
