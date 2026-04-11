import { createContext, useContext, useMemo, useState } from "react";
import { clearSession, getSession, saveSession } from "../features/auth/storage";
import { loginCustomer, registerCustomer } from "../features/auth/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  const value = useMemo(
    () => ({
      token: session?.token ?? null,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.token),
      async login(payload) {
        const result = await loginCustomer(payload);
        const next = { token: result.token, user: result.user };
        saveSession(next);
        setSession(next);
        return result;
      },
      async signup(payload) {
        const result = await registerCustomer(payload);
        if (result?.token) {
          const next = { token: result.token, user: result.user };
          saveSession(next);
          setSession(next);
        }
        return result;
      },
      logout() {
        clearSession();
        setSession(null);
      }
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
