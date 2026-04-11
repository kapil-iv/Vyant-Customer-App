import { apiClient, normalizeApiError } from "../../lib/apiClient";

function unwrap(payload) {
  return payload?.data ?? payload;
}

export function normalizeWishlist(payload) {
  const data = unwrap(payload);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.wishlist)) return data.wishlist;
  return [];
}

export async function fetchWishlist() {
  try {
    const response = await apiClient.get("/api/wishlist");
    return normalizeWishlist(response.data);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function addWishlist(productId) {
  try {
    const response = await apiClient.post(`/api/wishlist/${productId}`);
    return unwrap(response.data);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function removeWishlist(productId) {
  try {
    const response = await apiClient.delete(`/api/wishlist/${productId}`);
    return unwrap(response.data);
  } catch (error) {
    throw normalizeApiError(error);
  }
}
