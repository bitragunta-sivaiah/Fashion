import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaUsers, FaImage, FaProductHunt, FaClipboardList, FaBars, FaTimes } from 'react-icons/fa';
import UserMenu from '../components/UserMenu';
import { Outlet, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { path: 'usermanagement', label: 'User Management', icon: <FaUsers className="text-green-600" /> },
    { path: 'bannermanager', label: 'Banner Management', icon: <FaImage className="text-blue-600" /> },
    { path: 'productmanagement', label: 'Product Management', icon: <FaProductHunt className="text-red-600" /> },
    { path: 'ordermanagement', label: 'Order Management', icon: <FaClipboardList className="text-yellow-600" /> },
  ];

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <section className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto w-full h-full gap-3 flex">
        {/** Left for menu */}
        <div className="py-4 sticky top-4 max-h-[calc(100vh-32px)] p-3 w-fit overflow-y-auto bg-white shadow-md rounded-lg">
          <button onClick={handleMenuToggle} className="flex items-center justify-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">
            {menuOpen ? <FaTimes className="text-red-600" /> : <FaBars className="text-blue-600" />}
          </button>
          <div className={`mt-4 ${menuOpen ? 'block' : 'hidden'} w-full text-xl`}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-gray-800 gap-4 w-full hover:bg-gray-200 rounded-md ${menuOpen ? 'justify-start' : 'justify-center'}`}
              >
                {item.icon}
                {menuOpen && <span className="text-md font-bold">{item.label}</span>}
              </Link>
            ))}
          </div>
          <div className={`mt-4 ${menuOpen ? 'hidden' : 'block'}`}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-4 py-2 text-2xl text-gray-800 gap-2 w-full hover:bg-gray-200 rounded-md justify-center"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>

        {/** Right for content */}
        <div className="bg-white min-h-[75vh] w-full p-4 shadow-md rounded-lg">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
