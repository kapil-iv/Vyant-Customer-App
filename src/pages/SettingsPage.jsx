import { useState } from "react";
import { getStoredThemeMode, setThemeMode, toggleThemeMode } from "../features/home/themeRuntime";

export function SettingsPage() {
  const [mode, setMode] = useState(getStoredThemeMode());

  const handleToggle = () => {
    const next = toggleThemeMode();
    setMode(next);
  };

  const setLight = () => {
    setThemeMode("light");
    setMode("light");
  };

  const setDark = () => {
    setThemeMode("dark");
    setMode("dark");
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--vy-primary)" }}>Account</p>
        <h1 className="text-3xl font-black">Settings</h1>
      </header>

      <div className="rounded-xl border p-5" style={{ borderColor: "var(--vy-border)", backgroundColor: "var(--vy-surface)" }}>
        <h2 className="text-lg font-bold">Theme Mode</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--vy-muted)" }}>
          Current mode: <span className="font-semibold uppercase">{mode}</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--vy-secondary)" }}
            onClick={handleToggle}
          >
            Toggle Light/Dark
          </button>
          <button
            type="button"
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
            style={{ borderColor: "var(--vy-border)" }}
            onClick={setLight}
          >
            Use Light
          </button>
          <button
            type="button"
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
            style={{ borderColor: "var(--vy-border)" }}
            onClick={setDark}
          >
            Use Dark
          </button>
        </div>
      </div>
    </section>
  );
}
