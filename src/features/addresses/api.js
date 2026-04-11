import { apiClient, normalizeApiError } from "../../lib/apiClient";

function unwrap(payload) {
  return payload?.data ?? payload;
}

export function normalizeAddressPayload(payload) {
  return {
    fullName: String(payload?.fullName ?? "").trim(),
    phone: String(payload?.phone ?? "").trim(),
    line1: String(payload?.line1 ?? "").trim(),
    line2: String(payload?.line2 ?? ""),
    city: String(payload?.city ?? "").trim(),
    state: String(payload?.state ?? "").trim(),
    pincode: String(payload?.pincode ?? "").trim(),
    landmark: String(payload?.landmark ?? ""),
    isDefault: Boolean(payload?.isDefault)
  };
}

export async function fetchAddresses() {
  try {
    const response = await apiClient.get("/api/addresses");
    const data = unwrap(response.data);
    return Array.isArray(data) ? data : Array.isArray(data?.addresses) ? data.addresses : [];
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function createAddress(payload) {
  try {
    const response = await apiClient.post("/api/addresses", normalizeAddressPayload(payload));
    return unwrap(response.data);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function updateAddress(addressId, payload) {
  try {
    const response = await apiClient.put(`/api/addresses/${addressId}`, normalizeAddressPayload(payload));
    return unwrap(response.data);
  } catch (error) {
    throw normalizeApiError(error);
  }
}
