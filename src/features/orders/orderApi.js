import { api, normalizeError, unwrapApi } from "../../shared/api/baseApi";

export async function fetchOrdersApi() {
  const res = await api.get("/api/orders");
  const data = unwrapApi(res.data);
  return Array.isArray(data) ? data : data?.orders ?? [];
}

export async function fetchOrderByIdApi(id) {
  const res = await api.get(`/api/orders/${id}`);
  const data = unwrapApi(res.data);
  return data?.order ?? data;
}

export async function fetchOrderTimelineApi(id) {
  const res = await api.get(`/api/orders/${id}/timeline`);
  const data = unwrapApi(res.data);
  if (Array.isArray(data)) {
    return { timeline: data, trackingStatus: "", status: "" };
  }
  return {
    timeline: data?.timeline ?? data?.events ?? [],
    trackingStatus: data?.trackingStatus ?? "",
    status: data?.status ?? ""
  };
}

export async function placeOrderApi(payload) {
  const res = await api.post("/api/orders", payload);
  const data = unwrapApi(res.data);
  return data?.order ?? data;
}

export async function cancelOrderApi(id) {
  const res = await api.patch(`/api/orders/${id}/cancel`);
  return unwrapApi(res.data);
}

export async function returnOrderApi(id, payload) {
  const res = await api.post(`/api/orders/${id}/return`, payload);
  return unwrapApi(res.data);
}

export function orderError(error) {
  return new Error(normalizeError(error));
}
