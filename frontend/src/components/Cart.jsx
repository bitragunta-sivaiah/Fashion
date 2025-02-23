import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, updateCartItem, deleteCartItem, clearCart } from "../store/cartSlice";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa6";
import { FaPercent } from "react-icons/fa";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoFlashOutline } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { BiSolidOffer } from "react-icons/bi";
import { IoAlertCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
 
import Checkout from "../page/Checkout";
const Cart = ({ userId,handleCartClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { cartItems, status, error } = useSelector((state) => state.cart);
  const [checkout,setCheckout] = useState(false)
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCart(userId));
  }, [dispatch, userId]);

  const handleIncrease = (item) => {
    dispatch(
      updateCartItem({
        id: item._id,
        cartItem: { ...item, quantity: item.quantity + 1 },
      })
    );
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateCartItem({
          id: item._id,
          cartItem: { ...item, quantity: item.quantity - 1 },
        })
      );
    } else {
      dispatch(deleteCartItem(item._id));
    }
  };

  const handleRemove = (itemId) => {
    const userId = user._id;
    dispatch(deleteCartItem({ itemId, userId }));
  };
  const  checkOut =() => {
    handleCartClick()
      navigate('/checkout')
      
  }
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalDiscountPrice = cartItems.reduce(
    (total, item) => total + item.discountPrice * item.quantity,
    0
  );
  const totalOriginalPrice = cartItems.reduce(
    (total, item) =>
      total + (item.price / (1 - item.discountPrice / 100)) * item.quantity,
    0
  );
  const totalDiscount = totalOriginalPrice - totalPrice;
  
  const deliveryCharges = totalPrice > 100 ? 'Free' : 50;
  const totalAmount = totalPrice + (deliveryCharges === 'Free' ? 0 :deliveryCharges);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryDateString = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const totalSavings = totalPrice- totalDiscount ;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <div className="flex items-center">
        {Array(fullStars)
          .fill()
          .map((_, index) => (
            <FaStar key={`full-${index}`} className="text-[#07850d]" />
          ))}
        {halfStar === 1 && (
          <FaStarHalfAlt key="half" className="text-[#07850d]" />
        )}
        {Array(emptyStars)
          .fill()
          .map((_, index) => (
            <FaRegStar key={`empty-${index}`} className="text-[#07850d]" />
          ))}
      </div>
    );
  };

  const getDeliveryChargeColor = (color) => {
    return color === "Green" ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      <div className="flex justify-between gap-8 lg:flex-row flex-col">
        <div className="flex w-full flex-col">
          {cartItems.map((item) => {
            const randomRating = (Math.random() * 4 + 1).toFixed(1);
            const reviews = Math.floor(Math.random() * 1000) + 1;
            const originalPrice = item.price / (1 - item.discountPrice / 100);

            return (
              <div className="flex flex-col">
                <div
                  key={item._id}
                  className="flex relative items-center justify-between p-4 border-b border-gray-300"
                >
                  <div className="flex items-center flex-col gap-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div className="flex items-center ml-[-10px]">
                      <button
                        className="bg-gray-200 text-black px-2 py-0 mr-2"
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="bg-gray-200 text-black px-2 py-0 ml-2"
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 gap-2">
                    <h2 className="font-semibold line-clamp-1">{item.name}</h2>
                    <div className="flex items-center gap-1 text-sm">
                      <p className="text-gray-600">{item.color}</p>|
                      <p className="text-gray-600">{item.size}</p>
                    </div>
                    <div className="flex items-center text-sm my-1 gap-2">
                      {renderStars(randomRating)}
                      <span className="text-[12px]">({reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-sm mt-2 gap-1">
                      <p className="font-bold text-[#07850d] gap-[1px] flex items-center">
                        <FaArrowDown size={12} />
                        {item.discountPrice}
                        <FaPercent size={11} />
                      </p>
                      <p className="font-bold flex items-center line-through text-gray-400">
                        <MdOutlineCurrencyRupee />
                        {originalPrice.toFixed(0)}
                      </p>
                      <p className="font-bold flex items-center">
                        <MdOutlineCurrencyRupee />
                        {item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-[1px]">
                    <p className="text-gray-900 text-sm">Delivery by: {deliveryDateString}</p>
                    <GoDotFill size={8}/>
                    <p className={`font-medium text-sm ${item.price > 100 ? 'text-[#07850d]':'text-red-500'} `}>
                       {item.price > 100 ? 'Free': '₹50'}
                    </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center w-full justify-between p-2 mt-2 border-b border-gray-300">
                  <button
                    className="flex items-center gap-1 font-semibold text-gray-500"
                    onClick={() => handleRemove(item._id)}
                  >
                    <RiDeleteBinLine size={17} className="mt-[-1px]" /> Remove
                  </button>
                  <button className="flex items-center gap-1 font-semibold text-gray-500">
                    <IoFlashOutline size={17} /> Buy this now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 hidden md:block   p-2 px-5 w-[500px] h-fit">
          <div className="flex items-center flex-col bg-gray-100 mb-5">
          <h1 className="text-center my-2 font-bold text-gray-900 text-2xl mb-5">
            Cart Price Details
          </h1>
          <h2 className="font-semibold text-md mb-2 flex items-center justify-between">
            Price ({totalItems} items):
            <p className="flex items-center">
              <MdOutlineCurrencyRupee /> {totalDiscount.toFixed(0)}
            </p>
          </h2>
          <h2 className="font-semibold text-md mb-2 flex items-center justify-between">
            Discount :
            <p className="flex items-center text-[#029002]">
              -<MdOutlineCurrencyRupee /> {totalSavings.toFixed(0)}
            </p>
          </h2>
          <h2 className="font-semibold text-md mb-2 flex items-center justify-between">
            Delivery Charges:
            <p className={`flex items-center ${deliveryCharges === 50 ? "text-[#d50508]":'text-[#029002]'} `}>
              {deliveryCharges === 50 ? <>+  <MdOutlineCurrencyRupee size={14} />{deliveryCharges}</>:"Free" }
             
            </p>
          </h2>
          <hr className="w-full h-[2px] border-none bg-gray-300" />
          <h2 className="font-bold text-xl my-2 flex items-center justify-between">
            Total Amount:
            <p className="flex items-center">
              <MdOutlineCurrencyRupee /> {totalAmount.toFixed(0)}
            </p>
          </h2>
          <h2 className="flex items-center text-md justify-center text-[#029002] my-2">
            You will save <MdOutlineCurrencyRupee/>{totalSavings.toFixed(0)} on this order
            </h2>
          </div>
        <button  onClick={checkOut}  className="text-[17px] w-full  mt-5 rounded-lg font-semibold cursor-pointer py-2 px-4 bg-[#2141e1] text-white">
                Checkout
              </button>
        </div>
        {/* Mobile Cart details */}
        <div className=" md:hidden bottom-0 left-0 z-50 fixed bg-white p-0 pb-5 w-full h-fit ">
          <div className="flex items-center justify-center ">
          <h2 className="flex items-center text-md font-semibold py-1 w-full bg-[#bef7be] justify-center text-[#026c02] my-2">
            <BiSolidOffer/> You'll save <MdOutlineCurrencyRupee/>{totalSavings.toFixed(0)} on this order
            </h2>
          </div>
          <div className="flex flex-col ">
            {/* left part */}
            <div className="flex flex-col py-1 px-2">
              <h2 className="line-through text-sm text-gray-400">{totalDiscount.toFixed(0)}</h2>
            </div>
            {/* main part */}
            <div className="flex text-2xl justify-between px-2  ">
              <h2 className="inline-flex items-center "><MdOutlineCurrencyRupee/>{totalAmount.toFixed(0)} <IoAlertCircleOutline className="text-sm mt-1 ml-1 text-gray-400"/></h2>
              <button onClick={checkOut} className="text-[17px] rounded-lg font-semibold cursor-pointer py-2 px-4 bg-[#2141e1] text-white">
                Checkout
              </button>
            </div>
          </div>
        </div>
        {/* checkOut page */}
        {
          checkout && (
            <Checkout />) }
      </div>
    </div>
  );
};

export default Cart;
