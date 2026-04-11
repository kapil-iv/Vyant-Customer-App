import { api, normalizeError, unwrapApi } from "../../shared/api/baseApi";

export async function fetchCartApi() {
  try {
    const response = await api.get("/api/cart/");
    return unwrapApi(response.data);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function addToCartApi(payload) {
  try {
    const response = await api.post("/api/cart/add", payload);
    return unwrapApi(response.data);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function updateCartItemApi(itemId, payload) {
  try {
    const response = await api.patch(`/api/cart/items/${itemId}`, payload);
    return unwrapApi(response.data);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function removeFromCartApi(itemId) {
  try {
    const response = await api.delete(`/api/cart/items/${itemId}`);
    return unwrapApi(response.data);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function clearCartApi() {
  try {
    const response = await api.delete("/api/cart/");
    return unwrapApi(response.data);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function mergeCartApi(payload) {
  try {
    const response = await api.post("/api/cart/merge", payload);
    return unwrapApi(response.data);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}
