import express from 'express';
import Order from '../model/order.js';
import User from '../model/user.js';
import Cart from '../model/cart.js';
import Address from '../model/addressDeliver.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const orderRouter = express.Router();

// Create a new order
orderRouter.post('/', protect, async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const populatedOrderItems = await Cart.find({ _id: { $in: orderItems } });

            const order = new Order({
                user: req.user._id,
                orderItems: populatedOrderItems.map(item => item._id),
                shippingAddress,
                paymentMethod,
                totalPrice,
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders by the logged-in user
orderRouter.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('orderItems').populate('shippingAddress');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get order by ID
orderRouter.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('orderItems')
            .populate('shippingAddress')
            .populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an order
// Update an order
orderRouter.put('/:id', protect, async (req, res) => {
    try {
        const orderId = req.params.id;  // Extract orderId from params
        const { shippingAddress, ...rest } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        const order = await Order.findById(orderId);

        if (order) {
            order.shippingAddress = shippingAddress || order.shippingAddress;
            // Handle other fields as needed
            Object.keys(rest).forEach(key => {
                order[key] = rest[key];
            });

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid order ID format' });
        }
        res.status(500).json({ message: error.message });
    }
});

// Delete an order
orderRouter.delete('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await order.deleteOne();
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders by admin
orderRouter.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').populate('orderItems').populate('shippingAddress');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default orderRouter;
