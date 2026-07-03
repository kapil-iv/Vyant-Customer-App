import { apiClient, normalizeApiError, unwrap } from "../../lib/apiClient";

export async function fetchReviewsApi(productId) {
  try {
    const res = await apiClient.get(`/api/reviews/${productId}`);
    const data = unwrap(res);
    return Array.isArray(data) ? data : data?.reviews ?? [];
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function createReviewApi(payload) {
  try {
    const res = await apiClient.post("/api/reviews", payload);
    return unwrap(res);
  } catch (error) {
    throw normalizeApiError(error);
  }
}
