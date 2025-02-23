import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateAddress } from "../store/addressSlice";
import { FaTimes } from "react-icons/fa";

const UpdateAddress = ({ address, closeEditAddress }) => {
  const dispatch = useDispatch();
  const [updatedAddress, setUpdatedAddress] = useState({});

  useEffect(() => {
    if (address) {
      setUpdatedAddress(address);
    }
  }, [address]);

  const handleChange = (e) => {
    setUpdatedAddress({ ...updatedAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateAddress({ id: updatedAddress._id, address: updatedAddress }));
    closeEditAddress();
  };

  return (
    <div className="fixed top-0 bg-black/50 left-0 w-full h-full overflow-y-scroll">
      <form onSubmit={handleSubmit} className="max-w-xl relative mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-4 text-black">
        <h2 className="text-2xl font-semibold text-gray-800">Update Address</h2>
        <span onClick={closeEditAddress} className="top-3 right-5 absolute p-1 text-gray-500 border border-dashed border-gray-700 cursor-pointer">
          <FaTimes />
        </span>
        {updatedAddress && Object.entries(updatedAddress).map(([key, value]) => (
          (key !== 'deliveryPlace' && key !== '_id' && key !== 'user' && key !== '__v') && (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="text-sm font-medium text-gray-600 capitalize">{key.replace(/\d+/g, ' ')}</label>
              <input
                id={key}
                name={key}
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={`Enter ${key.replace(/\d+/g, ' ')}`}
                required={!(key === 'address2' || key === 'address3')}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )
        ))}

        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="deliveryPlace"
              value="Home"
              checked={updatedAddress.deliveryPlace === "Home"}
              onChange={handleChange}
              className="form-radio"
            />
            <span>Home</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="deliveryPlace"
              value="Work"
              checked={updatedAddress.deliveryPlace === "Work"}
              onChange={handleChange}
              className="form-radio"
            />
            <span>Work</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        >
          Update Address
        </button>
      </form>
    </div>
  );
};

export default UpdateAddress;
