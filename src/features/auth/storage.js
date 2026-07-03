const STORAGE_KEY = "vyant_customer_session";

export function saveSession(session) {
  if (session?.token) {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: session.token,
        user: session.user || null
      })
    );
    sessionStorage.setItem("vyant_auth_token", session.token);
  }
}

export function getSession() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.token) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getToken() {
  return getSession()?.token ?? null;
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem("vyant_auth_token");
}
