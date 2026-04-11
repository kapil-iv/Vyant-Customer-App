import { apiClient, normalizeApiError } from "../../lib/apiClient";

function unwrap(payload) {
  return payload?.data ?? payload;
}

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

export function buildOrderPayload({ cart, addressId, paymentMethod }) {
  return {
    addressId,
    paymentMethod,
    items: (cart?.items ?? []).map((item) => ({
      productId: item.product?._id ?? item.productId,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor
    }))
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
    const safeAmount = Math.round(Number(amount) || 0);
    return await postWithAliases(["/api/payment/create-order", "/api/payments/create-order"], { amount: safeAmount });
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export function buildMockVerifyPayload(paymentOrder, amount) {
  const orderId =
    paymentOrder?.orderId ??
    paymentOrder?.order_id ??
    paymentOrder?.razorpay_order_id ??
    paymentOrder?.id;

  if (!orderId) {
    throw new Error("Payment order id missing from create-order response");
  }

  const paymentId = paymentOrder?.paymentId ?? paymentOrder?.razorpay_payment_id ?? `pay_mock_${Date.now()}`;
  const signature = paymentOrder?.signature ?? paymentOrder?.razorpay_signature ?? "mock_signature";
  const verifyAmount = Math.round(Number(paymentOrder?.amount ?? amount) || 0);

  return {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
    amount: Number.isFinite(verifyAmount) ? verifyAmount : Math.round(Number(amount) || 0)
  };
}

export async function verifyPayment(payload) {
  try {
    return await postWithAliases(["/api/payment/verify", "/api/payments/verify"], payload);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function placeOrder(payload) {
  try {
    const data = await postWithAliases(["/api/orders", "/api/order"], payload);
    return data?.order ?? data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}
