const FALLBACK_THEME = {
  primary: "linear-gradient(135deg, #6b38d4, #8455ef)",
  secondary: "#5d5d67",
  accent: "#6b38d4",
  background: "#f9f9ff",
  text: "#151c27"
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

  const bg = isDark ? "#15121c" : (tokens.background || "#f9f9ff");
  const surface = isDark ? "#211d2a" : "#ffffff";
  const surfaceMuted = isDark ? "#2a2535" : "#f0f3ff";
  const text = isDark ? "#f0ebf7" : (tokens.text || "#151c27");
  const muted = isDark ? "#cbc3d7" : "#494454";
  const border = isDark ? "#494454" : "#cbc3d7";

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

  const primary = isDark && !tokens?.primary ? "linear-gradient(135deg, #d0bcff, #a984ff)" : merged.primary;
  const secondary = isDark && !tokens?.secondary ? "#c7c5d1" : merged.secondary;
  const accent = isDark && !tokens?.accent ? "#d0bcff" : merged.accent;

  setCssVar("--vy-primary", primary);
  setCssVar("--vy-secondary", secondary);
  setCssVar("--vy-accent", accent);
  setCssVar("--vy-primary-solid", isDark ? "#d0bcff" : (merged.accent || "#6b38d4"));
  setCssVar("--vy-primary-soft", isDark ? "#2d2540" : "#f0ebff");
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
