import { describe, expect, it } from "vitest";
import { buildProductSearchQuery } from "../features/products/productApi";

describe("product query generation", () => {
  it("includes minPrice and maxPrice", () => {
    const q = buildProductSearchQuery({ q: "shirt", category: "men", minPrice: 499, maxPrice: 1999, sort: "price_asc", page: 1, limit: 20 });
    expect(q).toContain("q=shirt");
    expect(q).toContain("category=men");
    expect(q).toContain("minPrice=499");
    expect(q).toContain("maxPrice=1999");
  });
});
