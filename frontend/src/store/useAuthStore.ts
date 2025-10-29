import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
interface UpdateProfileData {
  profilePic?: string;
  fullName?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isCheckingAuth: boolean;
  isUpdatingProfile: boolean;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  socket: {
    connected: any;
    disconnect: any;
  } | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isCheckingAuth: false,
      isUpdatingProfile: false,

      setUser: (user: User) => set({ user }),
      socket: null,
      logout: async () => {
        try {
          await api.post("/auth/logout");
          set({ user: null });
          toast.success("Logged out successfully");
          get().disconnectSocket();
        } catch (error) {
        } finally {
        }
      },

      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const res = await api.get("/auth/check");
          set({ user: res.data });
          get().connectSocket();
        } catch {
          set({ user: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      updateProfile: async (data: UpdateProfileData) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await api.put("/auth/update-profile", data);
          set({ user: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("There is an error, please Try Again Later!");
          }
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
      connectSocket: () => {
        const { user } = get();
        if (!user || get().socket?.connected) return;
        const socket = io(import.meta.env.VITE_BACKEND_BASE_URL, {
          query: {
            userId: user.id,
          },
        });
        console.log("SOCKET CONNECTIOB CALLED");
        socket.connect();
        set({ socket: socket });
      },
      disconnectSocket: () => {
        if (get().socket?.connected) get().socket?.disconnect();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
