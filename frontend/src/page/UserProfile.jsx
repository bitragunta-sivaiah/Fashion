import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, updateUserProfile, uploadImage } from '../store/authSlice';
import { FaTimes, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ name: '', email: '', avatar: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, avatar: user.avatar });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const response = await dispatch(uploadImage(file));
      if (response.payload && response.payload.data.secure_url) {
        const imageUrl = response.payload.data.secure_url;
        setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ ...formData, id: user._id }));
  };

  return (
    <div className="fixed top-0 left-0 bg-white w-full h-full flex items-center justify-center">
      <div className="w-full relative max-w-md p-6 bg-gray-50  shadow rounded-lg">
        <Link to={'/'} className="top-5 right-5 absolute border-dashed border p-1 text-gray-700 cursor-pointer">
            <FaTimes size={20} />
        </Link>
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='w-24 h-24 overflow-hidden rounded-full border-4 border-gray-200 shadow-md'
          >
            {formData.avatar ? (
              <img src={formData.avatar} alt="User Avatar" className="w-full h-full object-cover " />
            ) : (
              <FaUserCircle className="w-24 h-24 text-gray-400" />
            )}
          </motion.div>
          <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
          <label htmlFor="fileInput" className="cursor-pointer text-blue-700 font-semibold ">Change Avatar</label>
          {file && (
            <button onClick={handleUpload} className="mt-2 px-4 py-2 bg-blue-500 rounded text-white  cursor-pointer hover:bg-blue-600">Upload</button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm ml-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full bg-gray-100 border-none   p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm ml-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="mt-1 block w-full bg-gray-100 border-none text-gray-400   cursor-not-allowed p-2 rounded"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-4 py-2 rounded" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          <div className="flex flex-wrap gap-5">
            <Link to={'/orders'} className='py-2 font-semibold px-4 bg-gray-200 rounded-lg' >My Order</Link>
            <Link to={'/collections/all'} className='py-2 font-semibold px-4 bg-gray-200 rounded-lg' >Shop Now</Link>
            <Link to={'/cart'} className='py-2 font-semibold px-4 bg-gray-200 rounded-lg' >Shop Now</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
