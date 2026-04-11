import { describe, expect, it } from "vitest";
import authReducer, { loginThunk } from "../features/auth/authSlice";

describe("auth slice", () => {
  it("marks authenticated on login fulfilled", () => {
    const state = authReducer(undefined, loginThunk.fulfilled({ token: "t1", user: { _id: "u1" } }, "req-1"));
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("t1");
  });
});
