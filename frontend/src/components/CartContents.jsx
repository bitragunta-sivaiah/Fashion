import React from 'react';
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { removeFromCart, updateCartQuantity } from '../store/cartSlice';

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Handle the adding or subtracting to cart 
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartQuantity({
          productId,
          quantity: newQuantity,
          size,
          color,
          userId,
          guestId
        })
      );
    }
  };
  
  // Handle the removal from cart
  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(
      removeFromCart({
        productId,
        size,
        color,
        userId,
        guestId
      })
    );
  };

  return (
    <div>
      {cart?.products?.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product?.image}
              alt={product.name}
              className="w-20 rounded h-24 mr-4 object-cover"
            />
            <div>
              <h3>{product.name}</h3>
              <p className='text-sm text-gray-500'>
                Size: {product.size} | Color: {product.color}
              </p>
              <div className="flex items-center mt-2">
                <button 
                  onClick={() => handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)}
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button 
                  onClick={() => handleAddToCart(product.productId, 1, product.quantity, product.size, product.color)}
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p>$ {product.price.toLocaleString()}</p>
            <button 
              onClick={() => handleRemoveFromCart(product.productId, product.size, product.color)}
            >
              <RiDeleteBin3Line className='w-6 h-6 mt-3 text-red-600' />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
