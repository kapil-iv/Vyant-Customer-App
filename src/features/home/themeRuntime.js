const FALLBACK_THEME = {
  primary: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
  secondary: "#0ea5e9",
  accent: "#8b5cf6",
  background: "#f8fafc",
  text: "#0f172a"
};

const THEME_MODE_KEY = "vyant_theme_mode";
let currentTokens = { ...FALLBACK_THEME };

function setCssVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function normalizeMode(mode) {
  return mode === "dark" ? "dark" : "light";
}

export function getStoredThemeMode() {
  if (typeof window === "undefined") return "light";
  return normalizeMode(localStorage.getItem(THEME_MODE_KEY));
}

function applySemanticVars(tokens, mode) {
  const isDark = mode === "dark";

  const bg = isDark ? "#0b0f19" : (tokens.background || "#f8fafc");
  const surface = isDark ? "#111827" : "#ffffff";
  const surfaceMuted = isDark ? "#1f2937" : "#f1f5f9";
  const text = isDark ? "#e5e7eb" : (tokens.text || "#0f172a");
  const muted = isDark ? "#9ca3af" : "#64748b";
  const border = isDark ? "#1f2937" : "#e2e8f0";

  setCssVar("--vy-bg", bg);
  setCssVar("--vy-surface", surface);
  setCssVar("--vy-surface-muted", surfaceMuted);
  setCssVar("--vy-text", text);
  setCssVar("--vy-muted", muted);
  setCssVar("--vy-border", border);
}

export function applyThemeTokens(tokens, mode = getStoredThemeMode()) {
  const merged = { ...FALLBACK_THEME, ...(tokens || {}) };
  currentTokens = merged;

  const isDark = mode === "dark";

  const primary = isDark && !tokens?.primary ? "linear-gradient(135deg, #38bdf8, #a78bfa)" : merged.primary;
  const secondary = isDark && !tokens?.secondary ? "#38bdf8" : merged.secondary;
  const accent = isDark && !tokens?.accent ? "#a78bfa" : merged.accent;

  setCssVar("--vy-primary", primary);
  setCssVar("--vy-secondary", secondary);
  setCssVar("--vy-accent", accent);
  applySemanticVars(merged, normalizeMode(mode));
}

export function setThemeMode(mode) {
  const normalized = normalizeMode(mode);
  if (typeof window !== "undefined") {
    localStorage.setItem(THEME_MODE_KEY, normalized);
  }
  document.documentElement.setAttribute("data-theme-mode", normalized);

  if (normalized === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  document.documentElement.style.colorScheme = normalized;
  applyThemeTokens(currentTokens, normalized);
}

export function toggleThemeMode() {
  const next = getStoredThemeMode() === "dark" ? "light" : "dark";
  setThemeMode(next);
  return next;
}

export function resetThemeTokens() {
  currentTokens = { ...FALLBACK_THEME };
  applyThemeTokens(currentTokens, getStoredThemeMode());
}
