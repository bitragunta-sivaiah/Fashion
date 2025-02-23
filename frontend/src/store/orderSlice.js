import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

// Create a new order
export const createOrder = createAsyncThunk('order/createOrder', async (order, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post('/order', order);
        toast.success('Order created successfully!');
        return data;
    } catch (error) {
        toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

// Get all orders by the logged-in user
export const getMyOrders = createAsyncThunk('order/getMyOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get('/order/myorders');
        console.log(data);
        
        return data;
    } catch (error) {
        toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

// Get order by ID
export const getOrderById = createAsyncThunk('order/getOrderById', async (orderId, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get(`/order/${orderId}?populate=orderItems`);
        return data;
    } catch (error) {
        toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

// Update an order
export const updateOrder = createAsyncThunk('order/updateOrder', async (order, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put(`/order/${order._id}`, order);
        toast.success('Order updated successfully!');
        return data;
    } catch (error) {
        toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

// Delete an order
export const deleteOrder = createAsyncThunk('order/deleteOrder', async (orderId, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/order/${orderId}`);
        toast.success('Order deleted successfully!');
        return orderId;
    } catch (error) {
        toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

// Get all orders by admin
export const getAllOrders = createAsyncThunk('order/getAllOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get('/order');
        return data;
    } catch (error) {
        toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        order: {},
        loading: false,
        error: null,
    },
    reducers: {
        clearOrder: (state) => {
            state.order = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getMyOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getOrderById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter((order) => order._id !== action.payload);
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
