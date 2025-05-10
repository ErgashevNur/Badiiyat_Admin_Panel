import { create } from "zustand";

export const useAppStore = create((set) => ({
  admin: null,

  setAdmin: (admin) => set((state) => ({ admin })),
}));
