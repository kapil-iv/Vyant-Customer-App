import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProductById, fetchProducts } from "./api";

export function useProductsQuery(filters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    keepPreviousData: true
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60_000
  });
}

export function useProductQuery(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id)
  });
}
