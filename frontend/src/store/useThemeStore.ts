import { create } from "zustand";
import type { THEMES } from "../constants";

export type Theme = (typeof THEMES)[number];

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: (localStorage.getItem("chat-theme") as Theme) || "coffee",
  setTheme: (theme: Theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
