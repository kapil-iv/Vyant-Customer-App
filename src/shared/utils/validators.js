export function required(value, label) {
  if (!String(value ?? "").trim()) return `${label} is required`;
  return "";
}
