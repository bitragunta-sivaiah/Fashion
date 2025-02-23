import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bannerReducer from './bannerSlice'
import productReducer from './productSlice'
import cartReducer from './cartSlice'
import addressReducer from './addressSlice'
import orderReducer from './orderSlice';
import paymentReducer from './paymentSlice';
import wishlistReducer from './wishlistSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    banners: bannerReducer,
    products: productReducer,
    cart:cartReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
    order: orderReducer,
    payment: paymentReducer,

  },
});

export default store;
