// routes/wishlistRouter.js

import express from 'express';
import mongoose from 'mongoose';
 import Wishlist from '../model/wishlist.js'; // Ensure to add the .js extension for ES Module

const wishListRouter = express.Router();

// Get wishlist items for a user
wishListRouter.get('/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.params.userId }).populate('productId');
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to wishlist
wishListRouter.post('/:userId/add', async (req, res) => {
  const { productId, name, image, price, originalPrice, discountPrice, size, color } = req.body;
  try {
    const wishlistItem = new Wishlist({
      userId: req.params.userId,
      productId,
      name,
      image,
      price,
      discountPrice,
      size,
      color
    });
    await wishlistItem.save();
    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from wishlist
wishListRouter.delete('/:userId/remove/:itemId', async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.itemId);
    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default wishListRouter;
