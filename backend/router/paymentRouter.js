import express from 'express';
import Stripe from 'stripe';
import Order from '../model/order.js'; // Adjust the path to your Order model
import { protect } from '../middleware/authMiddleware.js'; // Adjust path as needed
import dotenv from 'dotenv';

dotenv.config();
const paymentRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

 
 

// Stripe payment
paymentRouter.post('/stripe', protect, async (req, res) => {
    try {
        const { orderId, paymentMethodId } = req.body; // Using paymentMethodId instead of token for Payment Intents
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: order.totalPrice * 100, // Stripe charges in cents
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            description: `Order ${orderId}`
        });

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentStatus = 'Paid';

        await order.save();

        res.status(200).json({ message: 'Payment successful', paymentIntent });
    } catch (error) {
        res.status(500).json({ message: 'Payment failed', error: error.message });
    }
});
// Cash on delivery
paymentRouter.post('/cob', async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentStatus = 'Paid';

        await order.save();

        res.status(200).json({ message: 'Payment successful' });
    } catch (error) {
        res.status(500).json({ message: 'Payment failed', error });
    }
});

// Update admin order status
paymentRouter.put('/admin/orders/:id/status', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminStatus } = req.body;
        const updateFields = {};

        if (status) updateFields.status = status;
        if (adminStatus) updateFields.adminStatus = adminStatus;

        const updatedOrder = await Order.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated', updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error });
    }
});

export default paymentRouter;
