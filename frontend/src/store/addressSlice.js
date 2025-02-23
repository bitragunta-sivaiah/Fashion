import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

// Helper function to update localStorage
const saveAddressesToLocalStorage = (addresses) => {
  localStorage.setItem('userAddresses', JSON.stringify(addresses));
};

// Add a new address
export const addAddress = createAsyncThunk(
  'address/addAddress',
  async (address, { rejectWithValue }) => {
    try {
      console.log('Adding address:', address);
      const response = await axiosInstance.post('/address/add', address);
      console.log('Response:', response.data);
      toast.success('Address added successfully');
      return response.data;
    } catch (error) {
      console.log('Error adding address:', error);
      toast.error(error.response?.data?.message || 'Error adding address');
      return rejectWithValue(error.response?.data);
    }
  }
);

// Update an address
export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ id, address }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/address/update/${id}`, address);
      toast.success('Address updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating address');
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get all addresses
export const getAllAddresses = createAsyncThunk(
  'address/getAllAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/address/all');
      saveAddressesToLocalStorage(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Delete an address
export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (id, { getState, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/address/delete/${id}`);
      toast.success('Address deleted successfully');
      const updatedAddresses = getState().address.addresses.filter((addr) => addr._id !== id);
      saveAddressesToLocalStorage(updatedAddresses);
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting address');
      return rejectWithValue(error.response?.data);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: JSON.parse(localStorage.getItem('userAddresses')) || [],
    address: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
        saveAddressesToLocalStorage(state.addresses);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex((addr) => addr._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
          saveAddressesToLocalStorage(state.addresses);
        }
      })
      .addCase(getAllAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((addr) => addr._id !== action.payload);
      });
  },
});

export default addressSlice.reducer;
