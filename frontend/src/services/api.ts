import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api",
});

// Request interceptor to add token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for better error visibility
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (!error.response) {
      console.error(`Network Error: Could not reach the server. Is the backend running?`);
    } else {
      console.error(`API Error (${error.response.status}):`, error.response.data);
    }
    return Promise.reject(error);
  }
);
