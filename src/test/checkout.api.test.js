import { describe, expect, it } from "vitest";
import { buildMockVerifyPayload, buildOrderPayload } from "../features/checkout/api";

describe("checkout payload", () => {
  it("builds order payload from cart", () => {
    const payload = buildOrderPayload({
      addressId: "a1",
      paymentMethod: "cod",
      cart: {
        items: [
          {
            product: { _id: "p1" },
            quantity: 2,
            selectedSize: "M",
            selectedColor: "Blue"
          }
        ]
      }
    });

    expect(payload).toEqual({
      addressId: "a1",
      paymentMethod: "cod",
      items: [
        {
          productId: "p1",
          quantity: 2,
          selectedSize: "M",
          selectedColor: "Blue"
        }
      ]
    });
  });
});

describe("mock payment payload", () => {
  it("builds verify payload from payment order", () => {
    const payload = buildMockVerifyPayload({ orderId: "order_1", amount: 1200 }, 999);

    expect(payload.razorpay_order_id).toBe("order_1");
    expect(payload.amount).toBe(1200);
    expect(payload.razorpay_payment_id.startsWith("pay_mock_")).toBe(true);
    expect(payload.razorpay_signature).toBe("mock_signature");
  });
});
