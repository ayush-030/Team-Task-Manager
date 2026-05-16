import axios from "axios";

let accessToken = null;
let onUnauthorized = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${api.defaults.baseURL}/api/auth/refresh`, {
            refresh_token: refreshToken,
          });
          setAccessToken(data.access_token);
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return api(original);
        } catch {
          localStorage.removeItem("refreshToken");
        }
      }
    }
    if (error.response?.status === 401) onUnauthorized?.();
    return Promise.reject(error);
  }
);

export default api;
