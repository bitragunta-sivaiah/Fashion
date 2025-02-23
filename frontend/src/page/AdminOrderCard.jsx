import React, { useState } from 'react';

const AdminOrderCard = ({ order, onStatusChange }) => {
    const [status, setStatus] = useState(order.status);

    const handleButtonClick = () => {
        onStatusChange(order._id, status);
    };

    return (
        <div className="bg-gray-50  rounded-lg p-6 shadow-md  mt-3">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Order #{order._id}</h2>
                <div>
                    <p className="font-semibold">Customer: {order.user.name}</p>
                    <p>Payment Method: {order.paymentMethod}</p>
                    <p>Paid: {order.isPaid ? 'Yes' : 'No'}</p>
                </div>
            </div>
          <div className="flex gap-8   text-sm">
          <div>
                <h3 className="text-xl font-semibold mb-2">Order Items</h3>
                {order.orderItems.map((item) => (
                    <div key={item._id} className="flex   font-semibold gap-4 mb-4  pb-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex flex-col">
                            <p className="font-semibold">{item.name}</p>
                            <div className="flex items-center text-sm font-semibold gap-1">
                            <p>Size: {item.size}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Color: {item.color}</p>
                            </div>
                            <p>Price: ₹{item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='text-sm'>
                <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <div className="flex items-center">
                <p>{order.shippingAddress.address1}</p>
                <p>{order.shippingAddress.address2}</p>
                <p>{order.shippingAddress.address3}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.zipcode}, {order.shippingAddress.country}</p>
                </div>
            </div>
          </div>
            <div className="flex flex-col gap-2">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border p-2 rounded mb-2 w-full"
                >
                    <option value="Processing">Processing</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <button
                    onClick={handleButtonClick}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Mark as {status}
                </button>
            </div>
        </div>
    );
};

export default AdminOrderCard;
