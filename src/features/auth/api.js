import { apiClient, normalizeApiError, unwrap } from "../../lib/apiClient";

export async function loginCustomer(credentials) {
  try {
    const response = await apiClient.post("/api/auth/login", credentials);
    const data = unwrap(response);
    if (!data?.token) {
      throw new Error("Login response did not include token.");
    }
    return {
      token: data.token,
      user: data.user ?? { email: credentials.email, role: "customer" }
    };
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function registerCustomer(payload) {
  try {
    const response = await apiClient.post("/api/auth/register", { ...payload, role: "customer" });
    const data = unwrap(response);
    return {
      token: data?.token ?? null,
      user: data?.user ?? null
    };
  } catch (error) {
    throw normalizeApiError(error);
  }
}
