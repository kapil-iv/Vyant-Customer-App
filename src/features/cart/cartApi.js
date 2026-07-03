import { apiClient, normalizeApiError, unwrap } from "../../lib/apiClient";

export async function fetchCartApi() {
  try {
    const response = await apiClient.get("/api/cart/");
    return unwrap(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function addToCartApi(payload) {
  try {
    const response = await apiClient.post("/api/cart/add", payload);
    return unwrap(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function updateCartItemApi(itemId, payload) {
  try {
    const response = await apiClient.patch(`/api/cart/items/${itemId}`, payload);
    return unwrap(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function removeFromCartApi(itemId) {
  try {
    const response = await apiClient.delete(`/api/cart/items/${itemId}`);
    return unwrap(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function clearCartApi() {
  try {
    const response = await apiClient.delete("/api/cart/");
    return unwrap(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function mergeCartApi(payload) {
  try {
    const response = await apiClient.post("/api/cart/merge", payload);
    return unwrap(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}
