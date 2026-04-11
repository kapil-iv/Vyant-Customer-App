import { api, normalizeError, unwrapApi } from "../../shared/api/baseApi";
import { toSearchParams } from "../../shared/utils/queryParams";

export function buildProductSearchQuery(filters) {
  const params = toSearchParams({
    q: filters?.q,
    category: filters?.category,
    materialType: filters?.materialType,
    inStock: filters?.inStock,
    minPrice: filters?.minPrice,
    maxPrice: filters?.maxPrice,
    sort: filters?.sort,
    page: filters?.page,
    limit: filters?.limit
  });
  return params.toString();
}

function normalizeProducts(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data?.products)) return payload.data.products;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export async function fetchProducts(filters = {}) {
  try {
    if (Object.keys(filters).length) {
      const query = buildProductSearchQuery(filters);
      const response = await api.get(`/api/search/products${query ? `?${query}` : ""}`);
      const data = unwrapApi(response.data);
      const items = normalizeProducts(data);
      return {
        items,
        page: Number(data?.page ?? data?.data?.page ?? filters.page ?? 1),
        totalPages: Number(data?.totalPages ?? data?.data?.totalPages ?? 1)
      };
    }

    const response = await api.get("/api/products");
    const data = unwrapApi(response.data);
    return { items: normalizeProducts(data), page: 1, totalPages: 1 };
  } catch (e) {
    throw new Error(normalizeError(e));
  }
}

export async function fetchFeaturedProducts() {
  const response = await api.get("/api/products/featured");
  return normalizeProducts(unwrapApi(response.data));
}

export async function fetchFacets() {
  const response = await api.get("/api/products/facets");
  return unwrapApi(response.data);
}

export async function fetchProductById(id) {
  const response = await api.get(`/api/products/${id}`);
  const data = unwrapApi(response.data);
  return data?.product ?? data;
}
