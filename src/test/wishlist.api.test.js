import { describe, expect, it } from "vitest";
import { normalizeWishlist } from "../features/wishlist/api";

describe("wishlist normalization", () => {
  it("normalizes response shapes", () => {
    expect(normalizeWishlist([{ _id: "w1" }])).toEqual([{ _id: "w1" }]);
    expect(normalizeWishlist({ data: { items: [{ _id: "w2" }] } })).toEqual([{ _id: "w2" }]);
  });
});
