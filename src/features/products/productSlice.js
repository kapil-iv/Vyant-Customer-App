import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "productUi",
  initialState: {
    filters: {
      q: "",
      category: "",
      materialType: "",
      inStock: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
      page: 1,
      limit: 12
    }
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    }
  }
});

export const { setFilters } = productSlice.actions;
export default productSlice.reducer;
