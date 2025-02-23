import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../store/orderSlice'; // Import the getOrderById action from orderSlice
import { FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';

const OrderStatus = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error.message || 'An error occurred'}</div>;
  }

  return (
    <div className="container mx-auto md:p-6">
      <h2 className="text-2xl font-bold mb-6">Order Status</h2>
      {order ? (
        <div className="bg-white p-1 rounded-lg shadow-md">
          <div className="flex flex-col lg:flex-row p-6 justify-between mb-6">
            <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
              <h3 className="text-xl font-bold">Order Details</h3>
              <p className="text-gray-600">Order ID: {order._id}</p>
              <p className="text-gray-600">Ordered At: {new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-gray-600">Total Price: ₹{order.totalPrice}</p>
              <div className="mt-4">
                <p className="text-lg font-bold">Shipping Address</p>
                <p className="text-gray-600">{order.shippingAddress?.name}</p>
                <p className="text-gray-600">{order.shippingAddress?.address1}</p>
                <p className="text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipcode}</p>
                <p className="text-gray-600">{order.shippingAddress?.country}</p>
                <p className="text-gray-600">{order.shippingAddress?.phone}</p>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h3 className="text-xl font-bold mb-4">Order Status</h3>
              <div className="space-y-2">
                {order.isPaid ? (
                  <p className="text-green-600 flex items-center"><FaCheckCircle className="mr-2" /> Paid on {new Date(order.paidAt).toLocaleString()}</p>
                ) : (
                  <p className="text-red-600 flex items-center"><FaTimesCircle className="mr-2" /> Not Paid</p>
                )}
                {order.isDelivered ? (
                  <p className="text-green-600 flex items-center"><FaTruck className="mr-2" /> Delivered on {new Date(order.deliveredAt).toLocaleString()}</p>
                ) : (
                  <p className="text-yellow-600 flex items-center"><FaTruck className="mr-2" /> Not Delivered</p>
                )}
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">Admin Status: {order.adminStatus}</p>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-4">Cart Items</h3>
          <ul className="space-y-4 px-1">
            {order.orderItems.map((item) => (
              <li key={item._id} className="flex  md:flex-row w-full justify-between p-0 md:p-4 border border-gray-200 rounded-lg">
                <div className="flex">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover mr-4" />
                  <div >
                    <h3 className="md:text-lg text-sm font-semibold line-clamp-1">{item.name}</h3>
                    <p className="text-gray-600 md:text-md text-sm">Size: {item.size}</p>
                    <p className="text-gray-600 md:text-md text-sm">Color: {item.color}</p>
                    <p className="text-gray-600 md:text-md text-sm">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-lg font-bold">₹{item.price}</p>
                  
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center text-red-600">Order not found</div>
      )}
    </div>
  );
};

export default OrderStatus;
