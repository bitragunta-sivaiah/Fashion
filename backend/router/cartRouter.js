import express from 'express';
import Cart from '../model/cart.js';

const cartRouter = express.Router();

// Add to cart
cartRouter.post('/addtocart', async (req, res) => {
  try {
    const {
      productId,
      name,
      image,
      price,
      size,
      color,
      countInStock,
      discountPrice,
      totalPrice,
      quantity,
      user,
      cartTotalPrice,
      rating,
      numReviews
    } = req.body;

    const cartItem = new Cart({
      productId,
      name,
      image,
      price,
      size,
      color,
      countInStock,
      discountPrice,
      totalPrice,
      quantity,
      user,
      cartTotalPrice,
      rating,
      numReviews
    });

    const createdCartItem = await cartItem.save();
    res.status(201).json(createdCartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cart
cartRouter.get('/:userId', async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.params.userId });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cart item
cartRouter.put('/:id', async (req, res) => {
  try {
    const {
      productId,
      name,
      image,
      price,
      size,
      color,
      countInStock,
      discountPrice,
      totalPrice,
      quantity,
      user,
      rating,
      numReviews,
      cartTotalPrice,
    } = req.body;

    const cartItem = await Cart.findById(req.params.id);

    if (cartItem) {
      cartItem.productId = productId;
      cartItem.name = name;
      cartItem.image = image;
      cartItem.price = price;
      cartItem.size = size;
      cartItem.color = color;
      cartItem.countInStock = countInStock;
      cartItem.discountPrice = discountPrice;
      cartItem.totalPrice = totalPrice;
      cartItem.quantity = quantity;
      cartItem.user = user;
      cartItem.rating = rating;
      cartItem.numReviews = numReviews;
      cartItem.cartTotalPrice = cartTotalPrice;

      const updatedCartItem = await cartItem.save();
      res.json(updatedCartItem);
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete from cart
cartRouter.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body; // Assuming userId is passed in the request body
    const cartItem = await Cart.findOneAndDelete({ _id: req.params.id, user: userId });

    if (cartItem) {
      res.json({ message: 'Cart item removed' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
cartRouter.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL parameters
    await Cart.deleteMany({ user: userId }); // Delete all cart items for the user

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default cartRouter;
