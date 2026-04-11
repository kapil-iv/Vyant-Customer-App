import { api, normalizeError, unwrapApi } from "../../shared/api/baseApi";

export async function fetchAddressesApi() {
  const res = await api.get("/api/addresses");
  const data = unwrapApi(res.data);
  return Array.isArray(data) ? data : data?.addresses ?? [];
}

export async function createAddressApi(payload) {
  const res = await api.post("/api/addresses", payload);
  return unwrapApi(res.data);
}

export async function updateAddressApi(id, payload) {
  const res = await api.put(`/api/addresses/${id}`, payload);
  return unwrapApi(res.data);
}

export async function deleteAddressApi(id) {
  await api.delete(`/api/addresses/${id}`);
  return id;
}

export function addressError(error) {
  return new Error(normalizeError(error));
}
