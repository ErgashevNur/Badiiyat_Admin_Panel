import { create } from "zustand";

const storedUser = JSON.parse(localStorage.getItem("admin"));

export const useAppStore = create((set) => ({
  admin: storedUser || null,
  setAdmin: (userData) => {
    localStorage.setItem("admin", JSON.stringify(userData)); // localStorage ga saqlaymiz
    set({ admin: userData });
  },
  logout: () => {
    localStorage.removeItem("admin"); // chiqishda tozalash
    set({ admin: null });
  },
}));
