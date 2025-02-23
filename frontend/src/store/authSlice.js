import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance'; // Update the path to the helper function
import toast from 'react-hot-toast';

// Define initial state
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  users: [],
  guestId: localStorage.getItem('guestId') || null,
};

// Register a new user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/register', userData);
      toast.success('User registered successfully!');
      return response.data;
    } catch (error) {
      toast.error('Registration failed!');
      return rejectWithValue(error.response.data);
    }
  }
);

// Login a user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/login', userData);
      toast.success('User logged in successfully!');
      return response.data;
    } catch (error) {
      toast.error('Login failed!');
      return rejectWithValue(error.response.data);
    }
  }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/user/${userData.id}`, userData);
      toast.success('User profile updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update user profile!');
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin: Get all users
export const getAllUsers = createAsyncThunk(
  'auth/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin: Update user role
export const updateUserRole = createAsyncThunk(
  'auth/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/user/role/${id}`, { role });
      toast.success('User role updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update user role!');
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin: Delete user
export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/user/${id}`);
      toast.success('User deleted successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to delete user!');
      return rejectWithValue(error.response.data);
    }
  }
);


// Upload image
export const uploadImage = createAsyncThunk(
  'products/uploadImage',
  async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axiosInstance.post('file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`; // Reset guest ID on logout
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userToken');
      localStorage.setItem('guestId', state.guestId);
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`; // Reset guest ID on request
      localStorage.setItem('guestId', state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        localStorage.setItem('userToken', action.payload.data.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        localStorage.setItem('userToken', action.payload.data.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.data && action.payload.data.users) {
          console.log('Fetched users:', action.payload.data.users);
          state.users = action.payload.data.users;
        } else {
          state.users = [];
        }
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.users = [];
      })
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user._id === action.payload.data.user._id ? action.payload.data.user : user
        );
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user._id !== action.payload.data.user._id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        toast.success('Image uploaded successfully!');
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error('Failed to upload image!');
      });
  },
});

export const { logout, generateNewGuestId } = authSlice.actions;

export default authSlice.reducer;
