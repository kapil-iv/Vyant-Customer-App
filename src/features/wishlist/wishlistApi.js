import { api, normalizeError, unwrapApi } from "../../shared/api/baseApi";

export async function getWishlistApi() {
  const response = await api.get("/api/wishlist");
  return unwrapApi(response.data);
}

export async function addWishlistApi(productId) {
  const response = await api.post(`/api/wishlist/${productId}`);
  return unwrapApi(response.data);
}

export async function removeWishlistApi(productId) {
  const response = await api.delete(`/api/wishlist/${productId}`);
  return unwrapApi(response.data);
}

export function wishlistError(error) {
  return new Error(normalizeError(error));
}
