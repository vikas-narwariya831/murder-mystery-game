import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

// Base backend URL from environment variables (defaults to production Vercel backend)
const rawBackendUrl = (
  import.meta.env.VITE_BACKEND_URL || 'https://murder-mystery-game-backend-livid.vercel.app/api'
).replace(/\/+$/, '');
const API_BASE_URL = rawBackendUrl.endsWith('/api') ? rawBackendUrl : `${rawBackendUrl}/api`;

/**
 * Centralized Axios instance with timeout and standard headers
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request interceptor for logging or dynamic token injection
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (import.meta.env.DEV) {
      console.log(`📡 [API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ [API Request Error]:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for consistent error handling and unwrapping
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.warn(`⚠️ [API Error ${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.warn('⚠️ [API Network Error] Backend server unreachable at:', API_BASE_URL);
    } else {
      console.error('⚠️ [API Setup Error]:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
