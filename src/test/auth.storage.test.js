import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clearSession, getSession, getToken, saveSession } from "../features/auth/storage";

describe("auth storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("stores and reads session", () => {
    saveSession({ token: "abc", user: { _id: "u1", name: "A" } });

    expect(getToken()).toBe("abc");
    expect(getSession()).toEqual({ token: "abc", user: { _id: "u1", name: "A" } });
  });

  it("clears session", () => {
    saveSession({ token: "abc", user: { _id: "u1" } });
    clearSession();
    expect(getSession()).toBeNull();
  });

  it("returns null for malformed session", () => {
    localStorage.setItem("vyant_customer_session", "not-json");
    expect(getSession()).toBeNull();
  });
});
