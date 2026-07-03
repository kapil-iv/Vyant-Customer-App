import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("vyant_auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function normalizeApiError(error) {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Request failed. Please try again.";
    return new Error(message);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("Unexpected error occurred.");
}

/**
 * Standardizes extraction of data from backend response { success: true, data: { ... } }
 */
export function unwrap(response) {
  return response?.data?.data ?? response?.data ?? response;
}

