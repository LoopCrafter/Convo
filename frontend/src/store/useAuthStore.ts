import { create } from "zustand";
import type { User } from "../types";
import { api } from "../lib/axios";

interface AuthState {
  user: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isProfileUpdating: boolean;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isProfileUpdating: false,
  checkAuth: async () => {
    try {
      const res = await api.get("/auth/check");
      set({ user: res.data.user });
    } catch (err) {
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
