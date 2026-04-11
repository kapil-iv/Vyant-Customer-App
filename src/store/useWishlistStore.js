import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggle(product) {
        const exists = get().items.some((item) => item._id === product._id);
        if (exists) {
          set((state) => ({ items: state.items.filter((item) => item._id !== product._id) }));
          return false;
        }
        set((state) => ({ items: [...state.items, product] }));
        return true;
      },
      remove(productId) {
        set((state) => ({ items: state.items.filter((item) => item._id !== productId) }));
      },
      isSaved(productId) {
        return get().items.some((item) => item._id === productId);
      }
    }),
    {
      name: "vyant-wishlist-store",
      partialize: (state) => ({ items: state.items })
    }
  )
);
