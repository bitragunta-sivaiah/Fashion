import express from "express";
import Product from "../model/product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const productRouter = express.Router();

// @route POST /api/products
productRouter.post("/", protect, async (req, res) => {
    try {
        const {
            name,
            price,
            discountPrice,
            countInStock,
            brand,
            category,
            gender,
            colors,
            sizes,
            material,
            collections,
            description,
            images,
            sku,
        } = req.body;

        const product = new Product({
            name,
            price,
            discountPrice,
            countInStock,
            brand,
            category,
            gender,
            colors,
            sizes,
            material,
            collections,
            description,
            images,
            sku,
            user: req.user._id, // Reference to the user object that owns the product
        });

        const newProduct = await product.save();
        res.status(201).json({
            message: "Product created successfully",
            success: true,
            newProduct,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating product",
            success: false,
            error: error.message,
        });
    }
});

// @route PUT /api/products/:id
productRouter.put("/:id", protect, admin, async (req, res) => {
    try {
        const {
            name,
            price,
            discountPrice,
            countInStock,
            brand,
            category,
            gender,
            colors,
            sizes,
            material,
            collections,
            description,
            images,
            sku,
        } = req.body;

        // Find product by ID
        const product = await Product.findById(req.params.id);
        if (product) {
            // Update the product
            product.name = name || product.name;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.images = images || product.images;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.gender = gender || product.gender;
            product.colors = colors || product.colors;
            product.sizes = sizes || product.sizes;
            product.material = material || product.material;
            product.collections = collections || product.collections;
            product.description = description || product.description;
            product.sku = sku || product.sku;
        }

        // Save the updated product
        const updatedProduct = await product.save();
        res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating product",
            success: false,
            error: error.message,
        });
    }
});

// @route DELETE /api/products/:id
productRouter.delete("/:id", protect, admin, async (req, res) => {
    try {
        // Find product by ID
        const product = await Product.findById(req.params.id);
        if (product) {
            // Delete the product
            await product.deleteOne();
            res.status(200).json({
                message: "Product deleted successfully",
                success: true,
            });
        } else {
            res.status(404).json({
                message: "Product not found",
                success: false,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error deleting product",
            success: false,
            error: error.message,
        });
    }
});

// @route GET /api/products/best-sellers
productRouter.get("/best-sellers", async (req, res) => {
    try {
        const bestSellers = await Product.find({ isFeatured: true })
            .sort({ rating: -1 })
            .limit(10);
        res.status(200).json(bestSellers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route GET /api/products/new-arrivals
productRouter.get("/new-arrivals", async (req, res) => {
    try {
        const newArrivals = await Product.find({ isPublished: true })
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json(newArrivals);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route GET /api/products/:id
productRouter.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route GET /api/products/similar/:id
productRouter.get("/similar/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const similarProducts = await Product.find({
            _id: { $ne: req.params.id },
            category: product.category,
        }).limit(10);
        res.status(200).json(similarProducts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

 

// @route GET /api/products/

productRouter.get("/", async (req, res) => {
    try {
        const {
            collection,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            category,
            material,
            brand,
            search,
        } = req.query;

        let filters = {};

        if (collection) filters.collections = collection;
        if (size) filters.sizes = { $in: size.split(",") };
        if (color) filters.colors = { $in: color.split(",") };
        if (gender) filters.gender = gender;
        if (minPrice) filters.price = { $gte: Number(minPrice) };
        if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) };
        if (category) filters.category = category;
        if (material) filters.material = { $in: material.split(",") };
        if (brand) filters.brand = { $in: brand.split(",") };
        if (search) filters.name = { $regex: search, $options: "i" };

        let sortOptions = {};
        if (sortBy === "priceAsc") {
            sortOptions.price = 1;
        } else if (sortBy === "priceDesc") {
            sortOptions.price = -1;
        } else if (sortBy === "popularity") {
            sortOptions.rating = -1;
        }

        const products = await Product.find(filters).sort(sortOptions);
        res.status(200).json({
            message: "Filtered products fetched successfully",
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
export default productRouter;
