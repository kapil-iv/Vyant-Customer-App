import { api, unwrapApi } from "../../shared/api/baseApi";

export async function estimateShippingApi(payload) {
  const res = await api.post("/api/shipping/estimate", payload);
  return unwrapApi(res.data);
}

export async function shippingOptionsApi(params) {
  const res = await api.get("/api/shipping/options", { params });
  const data = unwrapApi(res.data);
  return Array.isArray(data) ? data : data?.options ?? [];
}
