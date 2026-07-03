import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addWishlist, fetchWishlist, removeWishlist } from "./api";

const initialState = {
  items: [],
  ids: [],
  status: "idle",
  error: null
};

function applyList(state, payload) {
  const list = Array.isArray(payload) ? payload : payload?.wishlist ?? payload?.items ?? [];
  state.items = list;
  state.ids = list.map((x) => x.product?._id ?? x._id ?? x.productId).filter(Boolean);
}

export const fetchWishlistThunk = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
  try {
    return await fetchWishlist();
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const addWishlistThunk = createAsyncThunk("wishlist/add", async (productId, { rejectWithValue }) => {
  try {
    await addWishlist(productId);
    return await fetchWishlist();
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const removeWishlistThunk = createAsyncThunk("wishlist/remove", async (productId, { rejectWithValue }) => {
  try {
    await removeWishlist(productId);
    return await fetchWishlist();
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const slice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistThunk.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchWishlistThunk.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.error = null;
        applyList(s, a.payload);
      })
      .addCase(fetchWishlistThunk.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      });

    [addWishlistThunk.fulfilled, removeWishlistThunk.fulfilled].forEach((type) => {
      builder.addCase(type, (s, a) => {
        s.status = "succeeded";
        applyList(s, a.payload);
      });
    });
  }
});

export default slice.reducer;
