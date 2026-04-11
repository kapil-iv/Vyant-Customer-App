import { apiClient, normalizeApiError } from "../../lib/apiClient";

export const PRODUCT_SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Popular" }
];

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeProductList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data?.products)) return payload.data.products;
  return [];
}

function normalizePagination(payload, fallbackCount) {
  const page = Number(payload?.page ?? payload?.data?.page ?? 1);
  const limit = Number(payload?.limit ?? payload?.data?.limit ?? fallbackCount ?? 1);
  const total = Number(payload?.total ?? payload?.data?.total ?? fallbackCount ?? 0);
  const totalPages = Number(payload?.totalPages ?? payload?.data?.totalPages ?? Math.max(1, Math.ceil(total / Math.max(limit, 1))));

  return {
    page: Number.isFinite(page) ? page : 1,
    limit: Number.isFinite(limit) ? limit : fallbackCount,
    total: Number.isFinite(total) ? total : fallbackCount,
    totalPages: Number.isFinite(totalPages) ? totalPages : 1
  };
}

function getPrice(product) {
  return Number(product?.discountPrice ?? product?.price ?? 0);
}

function getPopularityScore(product) {
  const rating = Number(product?.rating ?? product?.averageRating ?? 0);
  const sold = Number(product?.soldCount ?? product?.ordersCount ?? 0);
  return sold * 10 + rating;
}

export function applyProductFilters(products, filters) {
  const query = (filters.search ?? "").trim().toLowerCase();
  const category = (filters.category ?? "").trim().toLowerCase();
  const minPrice = Number(filters.minPrice ?? 0) || 0;
  const maxPrice = Number(filters.maxPrice ?? 0) || Number.POSITIVE_INFINITY;
  const sort = filters.sort ?? "newest";

  const filtered = safeArray(products).filter((product) => {
    const name = String(product?.name ?? "").toLowerCase();
    const material = String(product?.materialType ?? "").toLowerCase();
    const productCategory = String(product?.category ?? "").toLowerCase();
    const price = getPrice(product);

    const matchesSearch = query ? name.includes(query) || material.includes(query) || productCategory.includes(query) : true;
    const matchesCategory = category ? productCategory === category : true;
    const matchesPrice = price >= minPrice && price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price_asc") return getPrice(a) - getPrice(b);
    if (sort === "price_desc") return getPrice(b) - getPrice(a);
    if (sort === "popular") return getPopularityScore(b) - getPopularityScore(a);

    const aTime = new Date(a?.createdAt ?? 0).getTime();
    const bTime = new Date(b?.createdAt ?? 0).getTime();
    return bTime - aTime;
  });

  return sorted;
}

export function paginateProducts(products, page = 1, limit = 12) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 12);
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const start = (safePage - 1) * safeLimit;
  const data = products.slice(start, start + safeLimit);

  return {
    data,
    page: safePage,
    limit: safeLimit,
    total,
    totalPages
  };
}

export async function fetchProducts(filters) {
  const params = {
    q: filters.search || undefined,
    category: filters.category || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    sort: filters.sort || undefined,
    page: filters.page || 1,
    limit: filters.limit || 12
  };

  try {
    const response = await apiClient.get("/api/search/products", { params });
    const items = normalizeProductList(response.data);
    return {
      items,
      pagination: normalizePagination(response.data, items.length)
    };
  } catch (searchError) {
    try {
      const fallbackResponse = await apiClient.get("/api/products");
      const allProducts = normalizeProductList(fallbackResponse.data);
      const filtered = applyProductFilters(allProducts, filters);
      const paged = paginateProducts(filtered, filters.page, filters.limit);
      return {
        items: paged.data,
        pagination: {
          page: paged.page,
          limit: paged.limit,
          total: paged.total,
          totalPages: paged.totalPages
        }
      };
    } catch (error) {
      throw normalizeApiError(error ?? searchError);
    }
  }
}

export async function fetchCategories() {
  try {
    const response = await apiClient.get("/api/products/facets");
    const categories = safeArray(response.data?.data?.categories ?? response.data?.categories)
      .map((item) => String(item).trim())
      .filter(Boolean);

    return Array.from(new Set(categories));
  } catch {
    const response = await apiClient.get("/api/products");
    const categories = normalizeProductList(response.data)
      .map((product) => String(product?.category ?? "").trim())
      .filter(Boolean);
    return Array.from(new Set(categories));
  }
}

export function normalizeProduct(payload) {
  return payload?.data?.product ?? payload?.product ?? payload?.data ?? payload;
}

export async function fetchProductById(id) {
  try {
    const response = await apiClient.get(`/api/products/${id}`);
    const product = normalizeProduct(response.data);
    if (!product?._id) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw normalizeApiError(error);
  }
}
