// src/api/axiosInstance.ts
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

// Base URL from environment or fallback
const baseURL =
  import.meta.env.VITE_API_URL || "https://tradeware-backend.onrender.com";

console.log("baseURL", baseURL);

// Function to get token
const getToken = (): string | null => localStorage.getItem("accessToken");

// Create axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: baseURL,
});

// Request interceptor
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      const currentPathWithParams =
        window.location.pathname + window.location.search;
      // Encode the path and query parameters
      const redirectUrl = encodeURIComponent(currentPathWithParams);
      // Add query params to the login URL
      window.location.href = `/login?redirect=${redirectUrl}`;
    }
    return Promise.reject(error);
  }
);

export default httpClient;
