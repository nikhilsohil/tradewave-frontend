// src/api/axiosInstance.ts
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

// Base URL from environment or fallback
const baseURL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";

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
            window.location.href = "/login"; // Fixed: should be assignment
        }
        return Promise.reject(error);
    }
);

export default httpClient;
