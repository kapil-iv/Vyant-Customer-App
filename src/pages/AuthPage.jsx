import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { loginCustomer, registerCustomer } from "../features/auth/api";
import { useToast } from "../context/ToastContext";
import { useUserStore } from "../store/useUserStore";

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/checkout";
  const [mode, setMode] = useState("login");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const token = useUserStore((state) => state.token);
  const setSession = useUserStore((state) => state.setSession);
  const navigate = useNavigate();
  const { push } = useToast();

  if (token) {
    return <Navigate to={redirect} replace />;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      let result;
      if (mode === "login") {
        result = await loginCustomer({ email: form.email.trim(), password: form.password });
      } else {
        result = await registerCustomer({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        });
      }

      if (!result?.token) {
        push("Authentication succeeded but no token returned", "error");
        return;
      }

      setSession({ token: result.token, user: result.user });
      push(mode === "login" ? "Welcome back" : "Account created", "success");
      navigate(redirect, { replace: true });
    } catch (error) {
      push(error.message || "Authentication failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-vy-border bg-vy-surface p-5 shadow-sm">
      <h1 className="text-xl font-semibold text-vy-text">{mode === "login" ? "Login to Continue Checkout" : "Create Account"}</h1>
      <p className="mt-1 text-sm text-vy-muted">You can browse and add to cart without login. Login is only required for checkout.</p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-md px-3 py-1 text-sm ${mode === "login" ? "bg-slate-900 text-white" : "bg-vy-surface-muted text-vy-muted"}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-md px-3 py-1 text-sm ${mode === "signup" ? "bg-slate-900 text-white" : "bg-vy-surface-muted text-vy-muted"}`}
        >
          Signup
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        {mode === "signup" ? (
          <input
            name="name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Full name"
            required
            className="w-full rounded-md border border-vy-border px-3 py-2 text-sm"
          />
        ) : null}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          placeholder="Email"
          required
          className="w-full rounded-md border border-vy-border px-3 py-2 text-sm"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          placeholder="Password"
          required
          minLength={6}
          className="w-full rounded-md border border-vy-border px-3 py-2 text-sm"
        />

        <button type="submit" disabled={submitting} className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">
          {submitting ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>
    </section>
  );
}
