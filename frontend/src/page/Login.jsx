import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { toast, Toaster } from 'react-hot-toast'; // Import react-hot-toast

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleOnChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (user) {
      navigate('/'); // Navigate to the dashboard or any protected route after login
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className='w-[100vw] h-[100vh] fixed top-0 left-0 bg-gray-50 flex items-center justify-center'>
      <Toaster /> {/* Toast container */}
      <div className="w-full max-w-xl p-3 relative bg-white shadow rounded-lg">
        <Link to={'/'} className='right-2 top-4 text-2xl text-gray-600 absolute border border-dashed'>
          <IoCloseSharp />
        </Link>
        <h1 className='text-center text-xl md:text-4xl font-bold'>Welcome Back!</h1>
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <input
              type="email"
              className="w-full px-3 h-[50px] text-md text-gray-700 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-blue-500"
              placeholder="Email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="w-full px-3 h-[50px] text-md text-gray-700 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-blue-500"
              placeholder="Password"
              name="password"
              value={data.password}
              onChange={handleOnChange}
            />
          </div>
          <button type="submit" className="w-full px-4 cursor-pointer py-2 text-[20px] text-white bg-blue-500 rounded-md hover:bg-blue-700">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p>{error}</p>}
        </form>
        <p className="mt-4 text-center text-sm">Don't have an account? <Link to={'/register'} className="text-blue-500">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;
