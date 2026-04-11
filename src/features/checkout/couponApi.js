import { api, unwrapApi } from "../../shared/api/baseApi";

export async function validateCouponApi(payload) {
  const res = await api.post("/api/coupons/validate", payload);
  return unwrapApi(res.data);
}

export async function applyCouponApi(payload) {
  const res = await api.post("/api/coupons/apply", payload);
  return unwrapApi(res.data);
}

export async function removeCouponApi(code) {
  const res = await api.delete(`/api/coupons/${code}`);
  return unwrapApi(res.data);
}

export async function activeCouponsApi() {
  const res = await api.get("/api/coupons/active");
  return unwrapApi(res.data);
}
