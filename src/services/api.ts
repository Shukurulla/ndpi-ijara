import axios from "axios";
import { BASE_URL, STORAGE_KEYS } from "@/utils/constants";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 300000, // 5 minutes like Kotlin
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  // FormData yuborilsa Content-Type ni olib tashlash (Axios o'zi boundary bilan qo'yadi)
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

// Separate instance without auth for login
export const authApi = axios.create({
  baseURL: BASE_URL,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
