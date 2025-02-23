import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

 const Api = 'http://localhost:3000/api/banner'


export const fetchBanners = createAsyncThunk('banners/fetchBanners', async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/banner`);
    return response.data;
});

export const addBanner = createAsyncThunk('banners/addBanner', async (banner) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/banner`, banner);
    return response.data;
});

export const updateBanner = createAsyncThunk('banners/updateBanner', async ({ id, banner }) => {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/banner/update/${id}`, banner);
    return response.data;
});

export const deleteBanner = createAsyncThunk('banners/deleteBanner', async (id) => {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/banner/delete/${id}`);
    return response.data;
});

export const uploadImage = createAsyncThunk('banners/uploadImage', async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/file/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
});

const bannerSlice = createSlice({
    name: 'banners',
    initialState: {
        banners: [],
        status: 'idle',
        error: null,
        uploadStatus: 'idle',
        uploadError: null,
        uploadUrl: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.banners = action.payload;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addBanner.fulfilled, (state, action) => {
                state.banners.push(action.payload);
            })
            .addCase(updateBanner.fulfilled, (state, action) => {
                const index = state.banners.findIndex((banner) => banner._id === action.payload._id);
                state.banners[index] = action.payload;
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.banners = state.banners.filter((banner) => banner._id !== action.payload._id);
            })
            .addCase(uploadImage.pending, (state) => {
                state.uploadStatus = 'loading';
            })
            .addCase(uploadImage.fulfilled, (state, action) => {
                state.uploadStatus = 'succeeded';
                state.uploadUrl = action.payload.data.url; // Assuming the response contains the uploaded image URL in action.payload.data.url
            })
            .addCase(uploadImage.rejected, (state, action) => {
                state.uploadStatus = 'failed';
                state.uploadError = action.error.message;
            });
    }
});

export default bannerSlice.reducer;
