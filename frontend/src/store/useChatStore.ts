import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import type { User } from "../types";
import { useAuthStore } from "./useAuthStore";

type ChatStoreTypes = {
  messages: any[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (selectedUser: User | null) => void;
  subscribeToMessage: () => void;
  unsubscribeFromMessages: () => void;
  sendMessage: (messageData: {
    text?: string | null;
    image?: File | string | null;
  }) => void;
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
      set({ messages: res.data.messages });
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
  sendMessage: async (messageData: {
    text?: string | null;
    image?: File | string | null;
  }) => {
    const { selectedUser, messages } = get();
    try {
      const res = await api.post(
        `/messages/send/${selectedUser?.id}`,
        messageData
      );
      console.log("HAMED", res);
      set({ messages: [...messages, res.data.message] });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("There is an error, please Try Again Later!");
      }
    }
  },
  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser =
          newMessage.senderId === selectedUser?.id;
        if (!isMessageSentFromSelectedUser) return;
        set({ messages: [...get().messages, newMessage] });
      });
    }
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },
  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
}));
