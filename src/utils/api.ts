import axios from 'axios';
import { getDeviceFingerprint } from './fingerprint';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
    } catch (err) {
      console.warn('Failed to attach x-device-fingerprint header:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
