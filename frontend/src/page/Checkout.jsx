import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAddresses, deleteAddress, addAddress } from '../store/addressSlice';
import AddAddress from '../components/AddAddress';
import UpdateAddress from '../components/UpdateAddress';
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineDone } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { BiSolidOffer } from 'react-icons/bi';
import { IoAlertCircleOutline } from 'react-icons/io5';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addresses } = useSelector((state) => state.address);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddAddressVisible, setIsAddAddressVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  useEffect(() => {
    dispatch(getAllAddresses());
  }, [dispatch]);

  const addAddressHandler = (address) => {
    console.log("Dispatching addAddress:", address);
    dispatch(addAddress(address));
    setIsAddAddressVisible(false);
  };

  const handleAddressSelect = (id) => {
    setSelectedAddressId((prevId) => (prevId === id ? null : id));
  };

  const handleDeleteAddress = () => {
    if (selectedAddressId) {
      dispatch(deleteAddress(selectedAddressId));
      setSelectedAddressId(null);
      setIsEditing(false);
    }
  };

  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find(addr => addr._id === id);
    setSelectedAddress(addressToEdit);
    setIsEditing(true);
  };

  const placeOrder = () => {
    // Place order logic here
    navigate('/placeorder');
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalDiscount = cartItems.reduce((total, item) => total + item.discountPrice * item.quantity, 0);
  const deliveryCharges = totalPrice > 100 ? 'Free' : 50;
  const totalAmount = totalPrice + (deliveryCharges === 'Free' ? 0 : deliveryCharges);
  const totalSavings = totalDiscount;

  return (
    <div className="flex  max-w-7xl lg:flex-row flex-col w-full justify-between">
      <div className="w-full   mx-auto p-3  shadow">
        {/* Login Section */}
        <div className="w-full max-w-4xl flex   items-center justify-between bg-gray-50 p-4 shadow-sm rounded-lg">
          {user?._id ? (
            <div className="flex flex-col w-full md:w-auto">
              <div className="flex gap-2 items-center">
                <p className="text-center font-bold py-1 px-2 bg-gray-200 text-blue-600 rounded">1</p>
                <p className="text-center text-md uppercase font-bold text-gray-800">Login</p>
                <MdOutlineDone className='text-xl text-blue-800' />
              </div>
              <div className="flex flex-wrap pl-6 text-black text-sm md:text-base">
                <span className="font-semibold mr-1">{user.name}</span>
                <span>-</span>
                <span className="font-semibold ml-1">{user.email}</span>
              </div>
            </div>
          ) : (
            <span className='text-red-500 text-sm'>Please Login</span>
          )}
          <Link to={'/login'} className='px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600'>
            {user?._id ? 'Change' : 'Login'}
          </Link>
        </div>
        
        {/* Address Section */}
        {user?._id && (
          <div className="w-full max-w-4xl mt-4 bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center bg-blue-600 p-3 rounded-t-lg">
              <p className="font-bold w-5 h-5 flex items-center justify-center bg-gray-200 text-blue-600 rounded">2</p>
              <span className="ml-2 uppercase text-white font-bold">Delivery Address</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {(showAllAddresses ? addresses : addresses.slice(0, 4)).map((address) => (
                <div key={address._id} className={`p-4 border rounded-lg cursor-pointer ${selectedAddressId === address._id ? 'border-blue-500' : 'border-gray-300'}`} onClick={() => handleAddressSelect(address._id)}>
                  <div className="flex items-center gap-2">
                    <input type="radio" id={address._id} name="address" value={address._id} checked={selectedAddressId === address._id} readOnly className="mr-2" />
                    <div className='text-gray-800 flex items-center font-bold  gap-2 flex-wrap'>
                      <p className='font-bold '>{address?.name}</p>
                      <p className='text-sm text-gray-600 flex items-center flex-wrap'>
                        <p className='bg-green-100 p-1 py-[3px] text-green-600'>{address?.deliverPlace}</p> - {address?.phone}</p>
                    </div>
                  </div>
                  <p className='text-sm text-gray-700 mt-1'>{address?.address1}, {address?.street}, {address?.city}, {address?.state} - {address?.zipcode}</p>
                  {selectedAddressId === address._id && (
                    <div className="mt-2 flex gap-3 text-sm font-semibold">
                      <button onClick={() => handleEditAddress(address._id)} className="text-blue-500">Edit</button>
                      <button onClick={handleDeleteAddress} className="text-red-500">Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {addresses.length > 4 && (
              <button onClick={() => setShowAllAddresses(!showAllAddresses)} className="w-full flex items-center justify-center gap-2 mt-3 p-2 bg-gray-200 text-blue-600 font-bold rounded-lg">
                {showAllAddresses ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                {showAllAddresses ? 'View Less' : `View All (${addresses.length}) Addresses`}
              </button>
            )}
          </div>
        )}
        
        {/* Add Address */}
        <div className="flex p-3 bg-gray-100 cursor-pointer text-blue-500 font-semibold max-w-4xl mt-4 rounded-lg shadow-md">
          <button onClick={() => setIsAddAddressVisible(true)} className="flex items-center gap-2">
            <FaPlus /> Add New Address
          </button>
          {isAddAddressVisible && <AddAddress closeAddAddress={() => setIsAddAddressVisible(false)} onAddAddress={addAddressHandler} />}
        </div>
        
        {/* Update Address */}
        {isEditing && <UpdateAddress closeEditAddress={() => setIsEditing(false)} address={selectedAddress} />}
      </div>

      {/* Order Summary */}     
      <div className="hidden lg:block mt-8 bg-gray-100 p-6 w-[400px] h-fit rounded-lg">
        <h1 className="text-center text-3xl font-bold mb-6">Order Summary</h1>
        <div className="space-y-3 text-lg font-medium">
          <h2 className="flex justify-between">Price ({totalItems} items):
            <p className="flex items-center"><MdOutlineCurrencyRupee className="mr-1" /> {totalPrice.toFixed(0)}</p>
          </h2>
          <h2 className="flex justify-between">Discount:
            <p className="text-green-500 flex items-center">-<MdOutlineCurrencyRupee className="mr-1" /> {totalDiscount.toFixed(0)}</p>
          </h2>
          <h2 className="flex justify-between">Delivery Charges:
            <p className={`flex items-center ${deliveryCharges === 'Free' ? "text-green-500" : "text-red-500"}`}>{deliveryCharges}</p>
          </h2>
          <h2 className="text-xl font-bold flex justify-between">Total Amount:
            <p className="flex items-center"><MdOutlineCurrencyRupee className="mr-1" /> {totalAmount}</p>
          </h2>

          <h2 className="text-xl font-bold flex justify-between">Total Amount:
            <p className="flex items-center"><MdOutlineCurrencyRupee className="mr-1" /> {totalAmount}</p>
          </h2>
        </div>
        <button onClick={placeOrder} className="text-lg w-full mt-6 rounded-xl font-semibold py-3 bg-blue-600 text-white shadow-md hover:bg-blue-700 transition duration-300">
          Place Order
        </button>
      </div>
        {/* Mobile summary */}
      <div className="md:hidden bottom-0 left-0 z-10 fixed p-0 pb-5 w-full h-fit bg-white shadow-lg border-t border-gray-200">
        <div className="flex items-center justify-center p-2 bg-green-100 text-green-700 font-semibold">
          <BiSolidOffer className="mr-1"/> You'll save <MdOutlineCurrencyRupee className="mx-1"/>{totalSavings.toFixed(0)} on this order
        </div>
        <div className="flex flex-col px-2">
          <div className="flex justify-between items-center text-gray-500 text-sm">
            <span className="line-through">{totalDiscount.toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-semibold mt-1">
            <span className="flex items-center">
              <MdOutlineCurrencyRupee className="mr-1"/>{totalAmount.toFixed(0)} 
              <IoAlertCircleOutline className="text-sm mt-1 ml-1 text-gray-400"/>
            </span>
            <button onClick={placeOrder} className="text-white bg-blue-600 hover:bg-blue-700 transition duration-300 font-semibold py-2 px-4 rounded-lg">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Checkout;
