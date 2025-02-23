// src/store/wishlistSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';

// Async thunk to fetch wishlist items
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (userId) => {
  const response = await axiosInstance.get(`/wishlist/${userId}`);
  return response.data;
});

// Async thunk to add item to wishlist
export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async ({ userId, item }) => {
  const response = await axiosInstance.post(`/wishlist/${userId}/add`, item);
  toast.success('Item added to wishlist!');
  return response.data;
});

// Async thunk to remove item from wishlist
export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async ({ userId, itemId }) => {
  await axiosInstance.delete(`/wishlist/${userId}/remove/${itemId}`);
  toast.success('Item removed from wishlist!');
  return itemId;
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlistItems = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlistItems.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlistItems = state.wishlistItems.filter((item) => item._id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
