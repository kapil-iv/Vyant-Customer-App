import { api, normalizeError, unwrapApi } from "../../shared/api/baseApi";

export async function registerApi(payload) {
  try {
    const response = await api.post("/api/auth/register", payload);
    const data = unwrapApi(response.data);
    return { token: data.token, user: data.user };
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function loginApi(payload) {
  try {
    const response = await api.post("/api/auth/login", payload);
    const data = unwrapApi(response.data);
    return { token: data.token, user: data.user };
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function googleLoginApi(payload) {
  try {
    const response = await api.post("/api/auth/google", payload);
    const data = unwrapApi(response.data);
    return { token: data.token, user: data.user };
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}
