import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL : localhost
export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("vyant_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function unwrapApi(payload) {
  return payload?.data ?? payload;
}

export function normalizeError(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  return error?.message ?? "Something went wrong";
}



// import axios from "axios";

// // 1. localhost ko string banaya aur default port add kiya
// // import.meta.env.DEV check karega ki aap local machine par run kar rahe hain ya nahi
// const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5173";

// // 2. Console log sirf development mode mein chalega, production mein nahi dikhega
// if (import.meta.env.DEV) {
//   console.log("API Base URL:", baseURL);
// }

// export const api = axios.create({
//   baseURL,
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json"
//   }
// });

// // Request Interceptor (Bilkul Sahi Hai)
// api.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem("vyant_auth_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Helper functions (Bilkul Sahi Hai)
// export function unwrapApi(payload) {
//   return payload?.data ?? payload;
// }

// export function normalizeError(error) {
//   if (error?.response?.data?.message) return error.response.data.message;
//   if (error?.response?.data?.error) return error.response.data.error;
//   return error?.message ?? "Something went wrong";
// }
