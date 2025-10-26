import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { api } from "../lib/axios";

interface AuthState {
  user: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isProfileUpdating: boolean;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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

      setUser: (user: User) => set({ user }),

      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
