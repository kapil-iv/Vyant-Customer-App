import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginCustomer, registerCustomer } from "./api";

const initialPersisted = (() => {
  const token = sessionStorage.getItem("vyant_auth_token");
  if (!token) return null;
  return { token };
})();

const initialState = {
  user: initialPersisted?.user ?? null,
  token: initialPersisted?.token ?? null,
  isAuthenticated: Boolean(initialPersisted?.token),
  status: "idle",
  error: null
};

export const loginThunk = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    return await loginCustomer(payload);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const registerThunk = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    return await registerCustomer(payload);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("vyant_auth_token");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = Boolean(action.payload.token);
        if (state.token) {
          sessionStorage.setItem("vyant_auth_token", state.token);
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = Boolean(action.payload.token);
        if (state.token) {
          sessionStorage.setItem("vyant_auth_token", state.token);
        }
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
