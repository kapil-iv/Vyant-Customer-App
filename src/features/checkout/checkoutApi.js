import { api, unwrapApi } from "../../shared/api/baseApi";

export async function quoteCheckoutApi(payload) {
  const res = await api.post("/api/checkout/quote", payload);
  return unwrapApi(res.data);
}

export async function availabilityCheckoutApi(payload) {
  const res = await api.post("/api/checkout/availability", payload);
  return unwrapApi(res.data);
}
