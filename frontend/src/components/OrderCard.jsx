import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteOrder } from '../store/orderSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order }) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice, status, createdAt } = order;
  const defaultImage = 'https://via.placeholder.com/150'; // Fallback image URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Navigate to product page
  const viewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Calculate time difference in hours
  const hoursSinceOrder = (new Date() - new Date(createdAt)) / 36e5;

  const handleDeleteOrder = () => {
    dispatch(deleteOrder(order._id))
      .then(() => {
        toast.success('Order canceled successfully!');
      })
      .catch((error) => {
        toast.error('Failed to cancel the order');
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-500 text-white';
      case 'Shipping':
        return 'bg-blue-500 text-white';
      case 'Delivered':
        return 'bg-green-500 text-white';
      case 'Cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-white p-6 w-full h-fit shadow-lg rounded-lg flex flex-col gap-4">
      {orderItems.map((item) => (
        <div key={item._id} className="w-full gap-6 flex sm:w-full object-cover rounded-lg mb-4 sm:mb-0 sm:mr-4">
          <img
            src={item.image || defaultImage}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg cursor-pointer"
            onClick={() => viewProduct(item.productId)}
            onError={(e) => (e.target.src = defaultImage)} // Use fallback image if there's an error
          />
          <div className="text-sm">
            <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
            <p className="flex gap-2">
              <strong>Size:</strong> {item.size}
              <strong>Color:</strong> {item.color}
              <strong>Quantity:</strong> {item.quantity}
            </p>
            <p className="text-gray-600 mb-1"><strong>Price:</strong> ₹{item.price}</p>
          </div>
        </div>
      ))}
      <div className="w-full mt-5 flex flex-col gap-6 sm:flex-row">
        <div className="text-sm">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <p className="text-gray-600 mb-1"><strong>Total Price:</strong> ₹{totalPrice}</p>
          <p className="text-gray-600 mb-1"><strong>Status:</strong> 
            <span className={`p-1 ml-1 rounded ${getStatusColor(status)}`}>{status}</span>
          </p>
          <p className="text-gray-600 ml-1"><strong>Payment Method:</strong> {paymentMethod}</p>
        </div>
        <div className="text-sm">
          <h3 className="text-lg font-medium">Shipping Address:</h3>
          <p className="text-gray-600 mb-1"><strong>Name:</strong> {shippingAddress.name}</p>
          <p className="text-gray-600 mb-1"><strong>Phone:</strong> {shippingAddress.phone}</p>
          <p className="text-gray-600 mb-1">
            <strong>Address:</strong> {shippingAddress.address1}, {shippingAddress.address2}, {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.zipcode}, {shippingAddress.country}
          </p>
        </div>
      </div>
      {status !== 'Delivered' && status !== 'Cancelled' && (
        <div className="mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
            onClick={handleDeleteOrder}
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
