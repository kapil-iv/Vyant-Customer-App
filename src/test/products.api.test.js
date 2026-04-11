import { describe, expect, it } from "vitest";
import { applyProductFilters, paginateProducts } from "../features/products/api";

const products = [
  { _id: "1", name: "Alpha Shirt", category: "clothing", price: 500, createdAt: "2026-01-01" },
  { _id: "2", name: "Beta Shirt", category: "clothing", price: 900, createdAt: "2026-02-01", soldCount: 4 },
  { _id: "3", name: "Gamma Shoes", category: "footwear", price: 1200, createdAt: "2026-03-01", soldCount: 10 }
];

describe("products filtering", () => {
  it("filters by search and category", () => {
    const result = applyProductFilters(products, { search: "shirt", category: "clothing", sort: "newest" });
    expect(result.map((item) => item._id)).toEqual(["2", "1"]);
  });

  it("sorts by price asc", () => {
    const result = applyProductFilters(products, { search: "", category: "", sort: "price_asc" });
    expect(result.map((item) => item._id)).toEqual(["1", "2", "3"]);
  });

  it("paginates data", () => {
    const page1 = paginateProducts(products, 1, 2);
    const page2 = paginateProducts(products, 2, 2);

    expect(page1.data.length).toBe(2);
    expect(page2.data.length).toBe(1);
    expect(page2.totalPages).toBe(2);
  });
});
