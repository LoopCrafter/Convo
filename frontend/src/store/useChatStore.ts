import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import type { User } from "../types";

type ChatStoreTypes = {
  messages: any[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (selectedUser: User) => void;
};

export const useChatStore = create<ChatStoreTypes>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await api.get("/messages/users");
      set({ users: res.data.users });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("There is an error, please Try Again Later!");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await api.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("There is an error, please Try Again Later!");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: (selectedUser: User) => set({ selectedUser }),
}));
