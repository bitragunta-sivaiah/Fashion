import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';

// Initial state
const initialState = {
    status: 'idle',
    error: null,
    paymentStatus: null,
};

// Async Thunks
export const makeStripePayment = createAsyncThunk(
    'payment/makeStripePayment',
    async ({ orderId, token }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/payment/stripe', { orderId, token });
            toast.success('Payment successful!');
            return response.data;
        } catch (error) {
            toast.error('Payment failed');
            return rejectWithValue(error.response.data);
        }
    }
);

export const makeCODPayment = createAsyncThunk(
    'payment/makeCODPayment',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/payment/cob', { orderId });
            toast.success('Payment successful!');
            return response.data;
        } catch (error) {
            toast.error('Payment failed');
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateAdminOrderStatus = createAsyncThunk(
    'payment/updateAdminOrderStatus',
    async ({ id, status, adminStatus }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/payment/admin/orders/${id}/status`, { status, adminStatus });
            toast.success('Order status updated!');
            return response.data;
        } catch (error) {
            toast.error('Failed to update order status');
            return rejectWithValue(error.response.data);
        }
    }
);

// Payment slice
const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        clearPaymentState: (state) => {
            state.status = 'idle';
            state.error = null;
            state.paymentStatus = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(makeStripePayment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(makeStripePayment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paymentStatus = action.payload;
            })
            .addCase(makeStripePayment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(makeCODPayment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(makeCODPayment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paymentStatus = action.payload;
            })
            .addCase(makeCODPayment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateAdminOrderStatus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paymentStatus = action.payload;
            })
            .addCase(updateAdminOrderStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearPaymentState } = paymentSlice.actions;

export default paymentSlice.reducer;
