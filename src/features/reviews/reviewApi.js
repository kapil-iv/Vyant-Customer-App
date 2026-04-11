import { api, unwrapApi } from "../../shared/api/baseApi";

export async function fetchReviewsApi(productId) {
  const res = await api.get(`/api/reviews/${productId}`);
  const data = unwrapApi(res.data);
  return Array.isArray(data) ? data : data?.reviews ?? [];
}

export async function createReviewApi(payload) {
  const res = await api.post("/api/reviews", payload);
  return unwrapApi(res.data);
}
