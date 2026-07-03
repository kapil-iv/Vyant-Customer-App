import { apiClient, normalizeApiError, unwrap } from "../../lib/apiClient";

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
    const response = await apiClient.get("/api/orders");
    const data = unwrap(response);
    return Array.isArray(data) ? data : data?.orders ?? [];
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function fetchOrderTimeline(orderId) {
  try {
    const response = await apiClient.get(`/api/orders/${orderId}/timeline`);
    const data = unwrap(response);
    return Array.isArray(data) ? data : data?.events ?? [];
  } catch {
    return [];
  }
}

export async function fetchOrderById(orderId) {
  try {
    const response = await apiClient.get(`/api/orders/${orderId}`);
    const data = unwrap(response);
    return data?.order ?? data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function requestOrderReturn(orderId, payload) {
  try {
    const response = await apiClient.post(`/api/orders/${orderId}/return`, payload);
    return unwrap(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function cancelOrder(orderId) {
  try {
    const response = await apiClient.post(`/api/orders/${orderId}/cancel`);
    return unwrap(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}
