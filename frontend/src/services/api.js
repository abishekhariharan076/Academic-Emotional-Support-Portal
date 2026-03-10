import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Add a response interceptor for better error visibility
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error: Could not reach the server. Is the backend running?");
    } else {
      console.error(`API Error (${error.response.status}):`, error.response.data);
    }
    return Promise.reject(error);
  }
);
