import { describe, expect, it } from "vitest";
import { buildMockVerifyPayload, buildOrderPayload } from "../features/checkout/api";

describe("checkout payload", () => {
  it("builds order payload from cart", () => {
    const payload = buildOrderPayload({
      shippingAddress: { fullName: "A", phone: "9876543210", email: "a@x.com" },
      paymentMethod: "cod",
      cart: {
        items: [
          {
            _id: "64f8f2a12f9b256d34a6f001",
            product: { _id: "p1" },
            quantity: 2,
            selectedSize: "M",
            selectedColor: "Blue",
            selected: true
          }
        ]
      }
    });

    expect(payload).toEqual({
      paymentMethod: "cod",
      shippingAddress: { fullName: "A", phone: "9876543210", email: "a@x.com" },
      selectedCartItemIds: ["64f8f2a12f9b256d34a6f001"]
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
