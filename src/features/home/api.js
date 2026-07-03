import { apiClient, normalizeApiError, unwrap } from "../../lib/apiClient";

export async function fetchActiveTheme() {
  try {
    const response = await apiClient.get("/api/themes/active");
    return unwrap(response);
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw normalizeApiError(error);
  }
}

export async function fetchSaleHighlights() {
  try {
    const response = await apiClient.get("/api/sales/highlights");
    return unwrap(response) ?? [];
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function fetchFeaturedProducts() {
  try {
    const response = await apiClient.get("/api/products/featured");
    return unwrap(response) ?? [];
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function fetchInfluencerHighlights(limit = 8) {
  try {
    const response = await apiClient.get(`/api/influencer/highlights?limit=${limit}`);
    return unwrap(response) ?? { influencerCollections: [], flatSales: [] };
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function fetchSales(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.type) query.set("type", String(params.type));
    if (params.active !== undefined) query.set("active", String(params.active));

    const path = query.toString() ? `/api/sales?${query.toString()}` : "/api/sales";
    const response = await apiClient.get(path);
    const data = unwrap(response);

    return {
      items: Array.isArray(data) ? data : data?.items ?? [],
      meta: response.data?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 1 }
    };
  } catch (error) {
    throw normalizeApiError(error);
  }
}
export async function fetchCategories() {
  try {
    const response = await apiClient.get("/api/products/categories");
    return unwrap(response) ?? [];
  } catch (error) {
    throw normalizeApiError(error);
  }
}
