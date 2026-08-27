import axios from 'axios';
import { getDeviceFingerprint } from './fingerprint';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://lit-api-backend.vercel.app/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const fingerprint = await getDeviceFingerprint();
      if (fingerprint) {
        config.headers.set('x-device-fingerprint', fingerprint);
      }

      // Inject Bearer token from localStorage if present
      const token = localStorage.getItem('lit_auth_token');
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (err) {
      console.warn('Failed to attach auth headers:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
