import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register" | "organiser";
  toggleSidebar: () => void;
  openAuthModal: (mode: "login" | "register" | "organiser") => void;
  closeAuthModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isAuthModalOpen: false,
  authModalMode: "login",
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openAuthModal: (mode) => set({ isAuthModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
