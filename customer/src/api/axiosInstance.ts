import axios from 'axios';
import { config } from '../config/env';
import { STORAGE_KEYS } from '../constants/api.constants';

// ─── Axios Instance ──────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────────────
// Attach JWT token to every outgoing request

axiosInstance.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────
// Handle 401 Unauthorized → clear auth + redirect to login

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      // Redirect to login without full page reload if possible
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
