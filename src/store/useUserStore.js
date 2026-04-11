import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      get isAuthenticated() {
        return Boolean(get().token);
      },
      setSession(session) {
        set({ user: session?.user ?? null, token: session?.token ?? null });
      },
      logout() {
        set({ user: null, token: null });
      }
    }),
    {
      name: "vyant-user-store",
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
);
