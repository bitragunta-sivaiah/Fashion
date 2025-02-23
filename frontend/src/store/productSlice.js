import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";

// Async thunks for the various routes
// Fetch products by filter thunk
// Fetch products by filter thunk
export const fetchProductsByFilter = createAsyncThunk(
    "products/fetchByFilter",
    async (params) => {
      const {
        collection,
        size,
        color,
        gender,
        minPrice,
        maxPrice,
        sortBy,
        category,
        limit,
        material,
        brand,
        search,
      } = params;
  
      const query = new URLSearchParams();
      if (collection) query.append("collection", collection);
      if (size) query.append("size", size.join(","));
      if (color) query.append("color", color);
      if (gender) query.append("gender", gender);
      if (minPrice) query.append("minPrice", minPrice);
      if (maxPrice) query.append("maxPrice", maxPrice);
      if (sortBy) query.append("sortBy", sortBy);
      if (category) query.append("category", category);
      if (material) query.append("material", material.join(","));
      if (brand) query.append("brand", brand.join(","));
      if (search) query.append("search", search);
  
      console.log("Fetching products with query:", query.toString());
  
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product?${query.toString()}`);
        console.log("API response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    }
  );
  

export const uploadImage = createAsyncThunk(
  "products/uploadImage",
  async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/file/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData) => {
    const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/api/product`, productData);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const response = await axiosInstance.put(`${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`, productData);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id) => {
    await axiosInstance.delete(`${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`);
  }
);

export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async () => {
    const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/best-sellers`);
    return response.data;
  }
);

export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async () => {
    const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/new-arrivals`);
    return response.data;
  }
);

export const fetchWomensProducts = createAsyncThunk('products/fetchWomensProducts', async () => {
    const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/api/product?gender=Women`);
    return response.data;
});

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id) => {
    const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`);
    return response.data;
  }
);

export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async (id) => {
    const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/similar/${id}`);
    return response.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async () => {
    const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/api/product`);
    console.log('fetchAllProducts',response.data);
    return response.data;
    
  }
);

// Initial state
const initialState = {
  products: [],
  bestSellers: [],
  newArrivals: [],
  womensProducts: [], // Initialize womensProducts as an empty array
  product: null,
  similarProducts: [],
  selectedProduct: null,
  status: "idle",
  error: null,
  filters: {
    category: "",
    size: "",
    color: "",
    gender: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    search: "",
    material: "",
    brand: "",
    collection: "",
  },
};

// Product slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        brand: "",
        collection: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductsByFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(uploadImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { productId, imageUrl } = action.payload;
        const product = state.products.find((prod) => prod.id === productId);
        if (product) {
          product.image = imageUrl;
        }
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.push(action.payload.newProduct);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedProduct = action.payload.product;
        const existingProductIndex = state.products.findIndex(
          (product) => product.id === updatedProduct.id
        );
        if (existingProductIndex >= 0) {
          state.products[existingProductIndex] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchBestSellers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bestSellers = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchNewArrivals.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.newArrivals = action.payload;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchWomensProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWomensProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.womensProducts = action.payload;
      })
      .addCase(fetchWomensProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
