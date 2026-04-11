import { describe, expect, it } from "vitest";
import wishlistReducer, { fetchWishlistThunk } from "../features/wishlist/wishlistSlice";

describe("wishlist reducer", () => {
  it("tracks ids from fetched list", () => {
    const payload = [{ _id: "w1" }, { product: { _id: "p2" } }];
    const state = wishlistReducer(undefined, fetchWishlistThunk.fulfilled(payload, "req-1"));
    expect(state.ids).toEqual(["w1", "p2"]);
  });
});
