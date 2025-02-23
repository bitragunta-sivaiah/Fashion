import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const AddAddress = ({ onAddAddress, closeAddAddress }) => {
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    address1: '',
    address2: '',
    address3: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    deliverPlace: 'Home',
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAddress(address);
  };
  

  return (
    <div className="fixed top-0 bg-black/50 left-0 w-full h-full overflow-y-scroll">
      <form onSubmit={handleSubmit} className="max-w-xl relative mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Add New Address</h2>
        <span onClick={closeAddAddress} className="top-3 right-5 absolute p-1 text-gray-500 border border-dashed border-gray-700">
          <FaTimes />
        </span>
        {Object.entries(address).map(([key, value]) => (
          key !== 'deliverPlace' && (
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
              name="deliverPlace"
              value="Home"
              checked={address.deliverPlace === 'Home'}
              onChange={handleChange}
              className="form-radio"
            />
            <span>Home</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="deliverPlace"
              value="Work"
              checked={address.deliverPlace === 'Work'}
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
          Add Address
        </button>
      </form>
    </div>
  );
};

export default AddAddress;
