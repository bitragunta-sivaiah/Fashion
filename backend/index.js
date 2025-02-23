import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import CONNECTDB from './config/DB.js';
import authRouter from './router/useRouter.js';
import productRouter from './router/productRouter.js';
import cartRouter from './router/cartRouter.js';
import addressRouter from './router/AddressDeliverRouter.js';

import orderRouter from './router/orderRouter.js';
import paymentRouter from './router/paymentRouter.js';
import bannerRouter from './router/bannerRouter.js';
import uploadRouter from './router/uploadRouter.js';
import wishListRouter from './router/WishlistRouter.js';
 
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Import routes
app.use('/api/user',authRouter)
app.use('/api/banner',bannerRouter)
app.use('/api/file',uploadRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/wishlist',wishListRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)
app.use('/api/payment',paymentRouter);
app.get('/',(req,res)=>{
    res.send('API is running');
})

app.listen(PORT,()=>{
    CONNECTDB();
    console.log(`Server is running on port  https://localhost:${PORT}`);
});