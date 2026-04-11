import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCartApi,
  addToCartApi,
  updateCartItemApi,
  removeFromCartApi,
  clearCartApi,
  mergeCartApi
} from "./cartApi";

const initialState = {
  items: [],
  status: "idle",
  error: null
};

// ... (Thunks same rahenge, no changes needed there)
export const fetchCartThunk = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try { const response = await fetchCartApi(); return response; }
  catch (error) { return rejectWithValue(error.message); }
});

export const addToCartThunk = createAsyncThunk("cart/addToCart", async (payload, { rejectWithValue, dispatch }) => {
  try {
    const apiPayload = { productId: payload.product._id, quantity: payload.quantity, size: payload.selectedSize, color: payload.selectedColor };
    const response = await addToCartApi(apiPayload);
    await dispatch(fetchCartThunk());
    return response;
  } catch (error) { return rejectWithValue(error.message); }
});

export const updateCartItemThunk = createAsyncThunk("cart/updateCartItem", async ({ cartItemId, quantity, size, color }, { rejectWithValue, dispatch }) => {
  try {
    const response = await updateCartItemApi(cartItemId, { quantity, size, color });
    await dispatch(fetchCartThunk());
    return response;
  }
  catch (error) { return rejectWithValue(error.message); }
});

export const removeFromCartThunk = createAsyncThunk("cart/removeFromCart", async (cartItemId, { rejectWithValue, dispatch }) => {
  try {
    const response = await removeFromCartApi(cartItemId);
    await dispatch(fetchCartThunk());
    return response;
  }
  catch (error) { return rejectWithValue(error.message); }
});

export const clearCartThunk = createAsyncThunk("cart/clearCart", async (_, { rejectWithValue }) => {
  try { const response = await clearCartApi(); return response; }
  catch (error) { return rejectWithValue(error.message); }
});

export const mergeCartThunk = createAsyncThunk("cart/mergeCart", async (localItems, { rejectWithValue }) => {
  try {
    const formattedItems = localItems.map(item => ({ productId: item.product._id, quantity: item.quantity, size: item.selectedSize, color: item.selectedColor }));
    const response = await mergeCartApi({ items: formattedItems }); return response;
  } catch (error) { return rejectWithValue(error.message); }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addLocalItem: (state, action) => {
      const { product, quantity = 1, selectedSize, selectedColor } = action.payload;
      const cartItemId = `${product._id}-${selectedSize || 'none'}-${selectedColor || 'none'}`;
      const existingItemIndex = state.items.findIndex(item => item.cartItemId === cartItemId);
      if (existingItemIndex >= 0) { state.items[existingItemIndex].quantity += quantity; }
      else { state.items.push({ cartItemId, _id: cartItemId, product, quantity, selectedSize, selectedColor, size: selectedSize, color: selectedColor }); }
    },
    removeLocalItem: (state, action) => {
      const cartItemId = action.payload;
      state.items = state.items.filter(item => item.cartItemId !== cartItemId && item._id !== cartItemId);
    },
    updateLocalItemQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find(item => item.cartItemId === cartItemId || item._id === cartItemId);
      if (item) {
        if (quantity <= 0) { state.items = state.items.filter(i => i.cartItemId !== cartItemId && i._id !== cartItemId); }
        else { item.quantity = quantity; }
      }
    },
    clearLocalCart: (state) => { state.items = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Backend se pure object aate hain pehli baar fetch pe
        state.items = action.payload?.data?.items || action.payload?.items || [];
      })

      // Automatically handled: mutations manually dispatch fetchCartThunk, triggering standard full update

      .addCase(mergeCartThunk.fulfilled, (state, action) => {
        state.items = action.payload?.data?.items || action.payload?.items || [];
      })

      .addCase(clearCartThunk.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const { addLocalItem, removeLocalItem, updateLocalItemQuantity, clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;