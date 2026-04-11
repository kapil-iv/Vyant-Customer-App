import { apiClient, normalizeApiError } from "../../lib/apiClient";

function unwrap(payload) {
  return payload?.data ?? payload;
}

export function normalizeOrders(payload) {
  const data = unwrap(payload);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  return [];
}

export function normalizeTimeline(payload) {
  const data = unwrap(payload);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.events)) return data.events;
  return [];
}

export function normalizeOrder(payload) {
  const data = unwrap(payload);
  return data?.order ?? data;
}

export async function fetchOrders() {
  try {
    try {
      const response = await apiClient.get("/api/orders");
      return normalizeOrders(response.data);
    } catch {
      const fallback = await apiClient.get("/api/order");
      return normalizeOrders(fallback.data);
    }
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function fetchOrderTimeline(orderId) {
  try {
    try {
      const response = await apiClient.get(`/api/orders/${orderId}/timeline`);
      return normalizeTimeline(response.data);
    } catch {
      const fallback = await apiClient.get(`/api/order/${orderId}/timeline`);
      return normalizeTimeline(fallback.data);
    }
  } catch {
    return [];
  }
}

export async function fetchOrderById(orderId) {
  try {
    try {
      const response = await apiClient.get(`/api/orders/${orderId}`);
      return normalizeOrder(response.data);
    } catch {
      const fallback = await apiClient.get(`/api/order/${orderId}`);
      return normalizeOrder(fallback.data);
    }
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function requestOrderReturn(orderId, payload) {
  try {
    const response = await apiClient.post(`/api/orders/${orderId}/return`, payload);
    return unwrap(response.data);
  } catch (error) {
    throw normalizeApiError(error);
  }
}
