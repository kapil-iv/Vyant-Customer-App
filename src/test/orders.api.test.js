import { describe, expect, it } from "vitest";
import { normalizeOrder, normalizeOrders, normalizeTimeline } from "../features/orders/api";

describe("orders normalization", () => {
  it("normalizes orders list", () => {
    expect(normalizeOrders({ data: { orders: [{ _id: "o1" }] } })).toEqual([{ _id: "o1" }]);
    expect(normalizeOrders([{ _id: "o2" }])).toEqual([{ _id: "o2" }]);
  });

  it("normalizes timeline", () => {
    expect(normalizeTimeline({ data: { events: [{ status: "placed" }] } })).toEqual([{ status: "placed" }]);
  });

  it("normalizes single order response", () => {
    expect(normalizeOrder({ data: { _id: "o3", status: "pending" } })).toEqual({ _id: "o3", status: "pending" });
  });
});
