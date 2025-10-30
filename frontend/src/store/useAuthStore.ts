import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import { Socket, io } from "socket.io-client";
interface UpdateProfileData {
  profilePic?: string;
  fullName?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isCheckingAuth: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: string[];
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  socket: Socket | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isCheckingAuth: false,
      isUpdatingProfile: false,
      onlineUsers: [],
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
        const { user, socket } = get();
        if (!user) return;

        // 1️⃣ قطع اتصال و پاک کردن listenerهای قبلی
        if (socket) {
          socket.removeAllListeners();
          socket.disconnect();
        }

        // 2️⃣ ساخت socket جدید
        const newSocket = io(import.meta.env.VITE_BACKEND_BASE_URL, {
          query: { userId: user.id },
          autoConnect: true,
        });

        // 3️⃣ listenerها
        newSocket.on("connect", () => {
          console.log("✅ Connected:", newSocket.id);
        });

        newSocket.on("online-users", (userIds: string[]) => {
          set({ onlineUsers: userIds });
          console.log("🔄 Online Users Updated:", userIds);
        });

        newSocket.on("disconnect", (reason: string) => {
          console.log("❌ Socket disconnected:", reason);
        });

        newSocket.on("connect_error", (err: any) => {
          console.error("⚠️ Socket connection error:", err);
        });

        // 4️⃣ ذخیره socket جدید در Zustand
        set({ socket: newSocket });
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
