import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.startsWith('http') && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    const cleaned = envUrl.replace(/\/$/, '');
    if (cleaned.endsWith('/api/v1')) return cleaned;
    if (cleaned.endsWith('/api')) return `${cleaned}/v1`;
    return `${cleaned}/api/v1`;
  }
  return '/api/v1';
};

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => {
    if (res.config?.method && res.config.method.toLowerCase() !== 'get') {
      try {
        localStorage.removeItem('portfolio_bundle_cache');
      } catch (e) {}
    }
    return res;
  },
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
