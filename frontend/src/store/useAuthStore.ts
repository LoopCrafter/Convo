import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types";
import { api } from "../lib/axios";

interface AuthState {
  user: User | null;
  isCheckingAuth: boolean;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isCheckingAuth: false,

      setUser: (user: User) => {
        console.log("setUser called with:", user); // اینو اضافه کن – ببین undefinedه؟
        if (user) {
          console.log("Setting valid user:", user.id || user.fullName); // جزئیات user
        } else {
          console.log("WARNING: setUser called with undefined/null!");
        }
        set({ user });
      },

      logout: () => set({ user: null }),

      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const res = await api.get("/auth/check");
          set({ user: res.data });
        } catch {
          set({ user: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
