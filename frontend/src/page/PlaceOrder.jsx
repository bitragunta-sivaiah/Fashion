import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, clearCart } from '../store/cartSlice'; // Import clearCart action
import { getAllAddresses } from '../store/addressSlice';
import { createOrder } from '../store/orderSlice';
import { makeCODPayment } from '../store/paymentSlice'; // Removed makeStripePayment
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { addresses } = useSelector((state) => state.address);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [usePreviousAddress, setUsePreviousAddress] = useState(false);
  const [previousOrderAddress, setPreviousOrderAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(getAllAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (addresses.length > 0) {
      setPreviousOrderAddress(addresses[0]);
    }
  }, [addresses]);

  const handleAddressChange = (addressId) => {
    setSelectedAddress(addressId);
    setUsePreviousAddress(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress && !usePreviousAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    const orderData = {
      orderItems: cartItems.map((item) => item._id),
      shippingAddress: usePreviousAddress ? previousOrderAddress._id : selectedAddress,
      paymentMethod,
      totalPrice: cartItems.reduce((acc, item) => acc + item.totalPrice, 0),
    };

    try {
      const response = await dispatch(createOrder(orderData));
      if (response.payload && response.payload._id) {
        const orderId = response.payload._id;
        if (paymentMethod === 'Online') {
          // Handle online payment (implement your own online payment logic)
        } else {
          await dispatch(makeCODPayment(orderId));
        }
        dispatch(clearCart()); // Clear the cart after successful order placement
        navigate(`/order-status/${orderId}`);
      } else {
        throw new Error('Order ID is undefined');
      }
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        {/* Left Side - Cart Items and Address */}
        <div className="w-full lg:w-2/3 p-4">
          <h2 className="text-2xl font-bold mb-4">Cart Items</h2>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item._id} className="flex justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">Size: {item.size}</p>
                    <p className="text-gray-600">Color: {item.color}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">₹{item.price}</p>
                  {item.discountPrice && <p className="text-gray-600 line-through">₹{item.originalPrice}</p>}
                </div>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Select Address</h2>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="address"
                value="previous"
                checked={usePreviousAddress}
                onChange={() => setUsePreviousAddress(true)}
              />
              <span className="ml-2">Use Previous Order Address</span>
            </label>
            {usePreviousAddress && previousOrderAddress && (
              <div className="p-4 border border-gray-200 rounded-lg mt-2">
                <p className="text-lg font-semibold">{previousOrderAddress.name}</p>
                <p className="text-gray-600">{previousOrderAddress.address1}</p>
                <p className="text-gray-600">{previousOrderAddress.city}, {previousOrderAddress.state} {previousOrderAddress.zipcode}</p>
                <p className="text-gray-600">{previousOrderAddress.country}</p>
                <p className="text-gray-600">{previousOrderAddress.phone}</p>
              </div>
            )}
          </div>

          <ul className="space-y-4">
            {addresses.map((address) => (
              <li
                key={address._id}
                onClick={() => handleAddressChange(address._id)}
                className={`p-4 border ${selectedAddress === address._id ? 'border-blue-500' : 'border-gray-200'} rounded-lg cursor-pointer`}
              >
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="address"
                    value={address._id}
                    checked={selectedAddress === address._id}
                    onChange={() => handleAddressChange(address._id)}
                  />
                  <span className="ml-2">
                    <p className="text-lg font-semibold">{address.name}</p>
                    <p className="text-gray-600">{address.address1}</p>
                    <p className="text-gray-600">{address.city}, {address.state} {address.zipcode}</p>
                    <p className="text-gray-600">{address.country}</p>
                    <p className="text-gray-600">{address.phone}</p>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side - Total Price and Payment Options */}
        <div className="w-full lg:w-1/3 p-4 bg-gray-50 rounded-lg shadow-md mt-8 lg:mt-0">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="mb-4">
            <p className="text-lg font-semibold">Total Price:</p>
            <p className="text-2xl font-bold">₹{totalPrice}</p>
          </div>
          <button
            className={`w-full py2 mb-4 ${paymentMethod === 'Online' ? 'bg-blue-700' : 'bg-blue-600'} text-white font-bold py-2 px-2 rounded-lg hover:bg-blue-700`}
            onClick={() => setPaymentMethod('Online')}
          >
            Pay Online
          </button>
          <button
            className={`w-full py-2 ${paymentMethod === 'COD' ? 'bg-green-700' : 'bg-green-600'} text-white font-bold rounded-lg hover:bg-green-700`}
            onClick={() => setPaymentMethod('COD')}
          >
            Cash on Delivery
          </button>

          {paymentMethod === 'Online' && (
            <div className="mb-4">
              <Elements stripe={stripePromise}>
                <form onSubmit={handlePlaceOrder}>
                  <CardElement />
                  <button type="submit" className="w-full py-2 mt-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">
                    Place Order
                  </button>
                </form>
              </Elements>
            </div>
          )}

          {paymentMethod === 'COD' && (
            <button
              className="w-full py-2 mt-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder