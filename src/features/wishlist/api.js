import { apiClient, normalizeApiError, unwrap } from "../../lib/apiClient";

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
    const data = unwrap(response);
    return Array.isArray(data) ? data : data?.items ?? data?.wishlist ?? [];
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function addWishlist(productId) {
  try {
    const response = await apiClient.post(`/api/wishlist/${productId}`);
    return unwrap(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function removeWishlist(productId) {
  try {
    const response = await apiClient.delete(`/api/wishlist/${productId}`);
    return unwrap(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}
