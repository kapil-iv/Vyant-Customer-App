import { describe, expect, it } from "vitest";
import { buildMockVerifyPayload } from "../features/checkout/api";

describe("checkout payment payload", () => {
  it("maps payment ids for verify", () => {
    const payload = buildMockVerifyPayload({ orderId: "order_1", amount: 5000 }, 5000);
    expect(payload.razorpay_order_id).toBe("order_1");
    expect(payload.amount).toBe(5000);
  });
});
