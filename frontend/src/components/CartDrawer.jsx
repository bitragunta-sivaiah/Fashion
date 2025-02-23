import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import CartContents from "./CartContents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleDrawer }) => {
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;
  const navigate = useNavigate(); // Corrected 'naviagete' to 'navigate'
  
  const handleCheckout = () => {
    toggleDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-full max-w-sm sm:w-1/2 h-full bg-white shadow-lg 
        transform transition-transform duration-300 flex flex-col z-50 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      {/*  Close Button */}
      <div className="flex justify-end p-4">
        <button onClick={toggleDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      {/*  Cart content with Scrollable area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {/* Components for Cart Contents */}
        {cart?.products?.length > 0 ? (
          <CartContents cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <div className="text-center my-10">Your cart is empty.</div>
        )}
      </div>
      {/*  CheckOut button fixed at the bottom */}
      <div className="p-4 bg-white sticky bottom-0 ">
        {cart?.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold cursor-pointer hover:bg-gray-800"
            >
              CheckOut
            </button>
            <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
              Shipping, taxes, and discount codes calculated at checkout {/* Corrected 'caculated' to 'calculated' */}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
