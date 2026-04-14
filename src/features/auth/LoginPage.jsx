import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "./useAuth";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, login, status, error } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={params.get("redirect") || "/"} replace />;
  }

  return (
    <section className="mx-auto max-w-md rounded-md border bg-vy-surface p-4">
      <h1 className="text-xl font-semibold">Login</h1>
      <form
        className="mt-4 space-y-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await login(form);
          if (res.meta.requestStatus === "fulfilled") {
            navigate(params.get("redirect") || "/", { replace: true });
          }
        }}
      >
        <input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full rounded border px-3 py-2" placeholder="Email" />
        <input type="password" required value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="w-full rounded border px-3 py-2" placeholder="Password" />
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button type="submit" disabled={status === "loading"} className="w-full rounded bg-slate-900 px-3 py-2 text-white">{status === "loading" ? "Logging in..." : "Login"}</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link to="/register" className="text-vy-text underline">Register</Link></p>
    </section>
  );
}
