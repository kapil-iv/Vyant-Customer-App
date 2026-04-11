import { describe, expect, it } from "vitest";
import { normalizeAddressPayload } from "../features/addresses/api";

describe("address payload normalization", () => {
  it("matches backend address contract shape", () => {
    const payload = normalizeAddressPayload({
      fullName: " Kapil Rawat ",
      phone: "9876543210",
      line1: "Street 10",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      isDefault: true
    });

    expect(payload).toEqual({
      fullName: "Kapil Rawat",
      phone: "9876543210",
      line1: "Street 10",
      line2: "",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      landmark: "",
      isDefault: true
    });
  });
});
