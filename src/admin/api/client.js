import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL || "https://nanmame.com/api/";

const client = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// Attach JWT
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("nanma_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 → clear and redirect to /admin/login
client.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/admin") && !path.endsWith("/login")) {
        localStorage.removeItem("nanma_token");
        localStorage.removeItem("nanma_admin");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export default client;
