import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    }],
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: 'Pending',
    },
    status: {
        type: String,
        enum: ["Processing", "Shipping", "Delivered", "Cancelled"],
        default: "Processing",
    },
    adminStatus: {
        type: String,
        enum: ["Approved", "Pending", "Rejected"],
        default: "Pending",
    },
}, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);

export default Order;
