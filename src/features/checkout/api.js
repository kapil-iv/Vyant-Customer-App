import { apiClient, normalizeApiError, unwrap } from "../../lib/apiClient";

async function postWithAliases(paths, payload) {
  let lastError = null;

  for (const path of paths) {
    try {
      const response = await apiClient.post(path, payload);
      return unwrap(response.data);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export function buildOrderPayload({ cart, shippingAddress, paymentMethod }) {
  const selectedItems = (cart?.items ?? []).filter((item) => item.selected !== false);
  return {
    paymentMethod,
    shippingAddress,
    selectedCartItemIds: selectedItems.map((item) => item._id || item.cartItemId).filter(Boolean)
  };
}

export async function checkAvailability(items) {
  try {
    const payload = {
      items: items.map((item) => ({
        productId: item.product?._id ?? item.productId,
        quantity: item.quantity,
        selectedSize: item.selectedSize || item.size,
        selectedColor: item.selectedColor || item.color
      }))
    };
    const response = await apiClient.post("/api/checkout/availability", payload);
    return unwrap(response.data);
  } catch (error) {
    throw normalizeApiError(error);
  }
}


export async function fetchCheckoutQuote(items, couponCode) {
  try {
    const payload = {
      items: items.map((item) => ({
        productId: item.product?._id ?? item.productId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      })),
      couponCode
    };

    const response = await apiClient.post("/api/checkout/quote", payload);
    return unwrap(response.data);
  } catch {
    return null;
  }
}

export async function fetchPaymentMethods(cartValue = 0, pincode = "") {
  try {
    const response = await apiClient.get("/api/payments/methods", {
      params: { cartValue, pincode }
    });

    const data = unwrap(response.data);
    const methods = Array.isArray(data) ? data : Array.isArray(data?.methods) ? data.methods : [];
    if (methods.length) return methods;
  } catch {
    // graceful fallback
  }

  return [{ code: "cod", label: "Cash on Delivery" }];
}

export async function createPaymentOrder(amount) {
  try {
    const safeAmount = Number(Number(amount || 0).toFixed(2));
    const response = await apiClient.post("/api/payment/create-order", { amount: safeAmount, currency: "INR" });
    return unwrap(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function verifyPayment(payload) {
  try {
    const response = await apiClient.post("/api/payment/verify", payload);
    return unwrap(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function placeOrder(payload) {
  if (!payload?.shippingAddress?.email || !payload?.shippingAddress?.phone) {
    throw new Error("Please provide a valid email and phone number in the shipping address.");
  }
  try {
    const response = await apiClient.post("/api/orders", payload);
    const data = unwrap(response);
    return data?.order ?? data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}
