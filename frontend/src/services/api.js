import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  // ❌ removed global Content-Type so Axios can set it automatically
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hub_access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("hub_refresh_token");
        if (refreshToken) {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh-token`,
            { refreshToken },
          );
          localStorage.setItem("hub_access_token", data.data.accessToken);
          localStorage.setItem("hub_refresh_token", data.data.refreshToken);
          original.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(original);
        }
      } catch {
        localStorage.removeItem("hub_access_token");
        localStorage.removeItem("hub_refresh_token");
        localStorage.removeItem("hub_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
