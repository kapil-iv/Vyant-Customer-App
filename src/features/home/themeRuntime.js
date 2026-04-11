const FALLBACK_THEME = {
  primary: "#b36a2f",
  secondary: "#7a4d2a",
  accent: "#d48b4d",
  background: "#f4ede3",
  text: "#3c2a1d"
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

  const bg = isDark ? "#0b1220" : tokens.background;
  const surface = isDark ? "#111827" : "#ffffff";
  const surfaceMuted = isDark ? "#1f2937" : "#f1f5f9";
  const text = isDark ? "#e5e7eb" : tokens.text;
  const muted = isDark ? "#9ca3af" : "#475569";
  const border = isDark ? "#334155" : "#cbd5e1";

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

  setCssVar("--vy-primary", merged.primary);
  setCssVar("--vy-secondary", merged.secondary);
  setCssVar("--vy-accent", merged.accent);
  applySemanticVars(merged, normalizeMode(mode));
}

export function setThemeMode(mode) {
  const normalized = normalizeMode(mode);
  if (typeof window !== "undefined") {
    localStorage.setItem(THEME_MODE_KEY, normalized);
  }
  document.documentElement.setAttribute("data-theme-mode", normalized);
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
