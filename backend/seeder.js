import mongoose from "mongoose";
import dotenv from "dotenv";
import { products } from "./data/products.js"; // Use named import
import Product from "./model/product.js";
import User from "./model/user.js";
import Cart from "./model/cart.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

// Function to seed data
const seedData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // Create a default admin user
        const adminUser = new User({
            name: 'Admin',
            email: 'Admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        await adminUser.save();

        // Assign the default user Id to each product
        const userID = adminUser._id; // Change createdUser to adminUser

        const sampleProducts = products.map(product => {
            return { ...product, user: userID }; // Fix destructuring and property assignment
        });

        // Insert the products into the database
        await Product.insertMany(sampleProducts);
        console.log('Products inserted successfully');
        process.exit();
    } catch (error) {
        console.log('Error inserting products into database', error);
        process.exit(1);
    }
};

seedData();
