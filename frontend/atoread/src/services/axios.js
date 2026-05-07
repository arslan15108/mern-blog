import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 🔥 required for cookies
});

// response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isLogin = originalRequest?.url?.includes("/users/login");
    const isRefresh = originalRequest?.url?.includes("/refresh-token");
    const isCurrentUser = originalRequest?.url?.includes("/users/current-user");

    // ✅ prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLogin &&
      !isRefresh &&
      !isCurrentUser
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/users/refresh-token");
        return api(originalRequest); // retry once
      } catch (err) {
        // ❌ refresh failed → dispatch logout event
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;