import { create } from 'zustand';
import {
  getCurrentUser,
  login as loginService,
  logout as logoutService,
  onSignedOut,
  register as registerService,
} from '../services/authService';
import type { User } from '../types/User';

interface AuthState {
  user?: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

let stopListening: (() => void) | undefined;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: undefined,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  init: async () => {
    if (get().isInitialized) return;

    stopListening?.();
    stopListening = onSignedOut(() => set({ user: undefined, isAuthenticated: false }));

    try {
      const user = await getCurrentUser();
      set({ user, isAuthenticated: user !== undefined, isInitialized: true });
    } catch {
      set({ user: undefined, isAuthenticated: false, isInitialized: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const user = await loginService(email, password);
      set({ user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, username) => {
    set({ isLoading: true });
    try {
      const user = await registerService(email, password, username);
      set({ user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutService();
      set({ user: undefined, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
