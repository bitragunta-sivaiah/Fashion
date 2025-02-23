import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  cartItems: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch cart items
export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${userId}`);
  return response.data;
});

// Async thunk to add item to cart
export const addToCart = createAsyncThunk('cart/addToCart', async (cartItem) => {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/addtocart`, cartItem);
  return response.data;
});

// Async thunk to update cart item
export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ id, cartItem }) => {
  const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${id}`, cartItem);
  return response.data;
});

// Async thunk to delete cart item
export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async ({ itemId, userId }) => {
  const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${itemId}`, { data: { userId } });
  return itemId;
});

// Async thunk to clear the cart
export const clearCart = createAsyncThunk('cart/clearCart', async (userId) => {
  await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart/clear/${userId}`);
  return [];
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems.push(action.payload);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.cartItems.findIndex((item) => item._id === action.payload._id);
        state.cartItems[index] = action.payload;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
      });
  },
});

export default cartSlice.reducer;
