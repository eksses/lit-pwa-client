import { create } from 'zustand';
import { User, LoginCredentials, RegisterCredentials } from '../types';
import api from '../utils/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<{ user: User }>('/auth/me');
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    const response = await api.post<{ user: User }>('/auth/login', credentials);
    const user = response.data.user;
    set({ user, isAuthenticated: true });
    return user;
  },

  register: async (credentials) => {
    const response = await api.post<{ user: User }>('/auth/register', credentials);
    const user = response.data.user;
    set({ user, isAuthenticated: true });
    return user;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
