import { api, unwrapApi } from "../../shared/api/baseApi";

export async function fetchPaymentMethodsApi(params) {
  const res = await api.get("/api/payment/methods", { params });
  const data = unwrapApi(res.data);
  return Array.isArray(data) ? data : data?.methods ?? [];
}

export async function createPaymentOrderApi(amount) {
  const res = await api.post("/api/payment/create-order", { amount });
  return unwrapApi(res.data);
}

export async function verifyPaymentApi(payload) {
  const res = await api.post("/api/payment/verify", payload);
  return unwrapApi(res.data);
}
