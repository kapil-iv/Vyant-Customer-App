import { describe, expect, it, vi } from "vitest";
import { fetchOrderByIdApi, fetchOrderTimelineApi } from "../features/orders/orderApi";
import { api } from "../shared/api/baseApi";

describe("orders api routes", () => {
  it("calls /orders/:id", async () => {
    const spy = vi.spyOn(api, "get").mockResolvedValueOnce({ data: { data: { _id: "o1" } } });
    await fetchOrderByIdApi("o1");
    expect(spy).toHaveBeenCalledWith("/api/orders/o1");
  });

  it("calls /orders/:id/timeline", async () => {
    const spy = vi.spyOn(api, "get").mockResolvedValueOnce({ data: { data: { events: [] } } });
    await fetchOrderTimelineApi("o1");
    expect(spy).toHaveBeenCalledWith("/api/orders/o1/timeline");
  });
});
