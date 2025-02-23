import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaUser, FaClipboardList, FaCog, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const UserMenu = ({ close, logout }) => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user && user.role === 'admin'; // Adjust according to your role management

  const menuItems = [
    { path: '/profile', label: 'Profile', icon: <FaUser className="text-blue-600" /> },
    { path: '/orders', label: 'Orders', icon: <FaClipboardList className="text-red-600" /> },
    { path: '/settings', label: 'Settings', icon: <FaCog className="text-yellow-600" /> }
  ];

  const adminMenuItems = [
    { path: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="text-purple-600" /> },
  ];

  return (
    <div className="p-4">
      {!isAdmin && menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
          onClick={close}
        >
          {item.icon}
          <span className="ml-2">{item.label}</span>
        </Link>
      ))}

      {isAdmin && adminMenuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md"
          onClick={close}
        >
          {item.icon}
          <span className="ml-2">{item.label}</span>
        </Link>
      ))}

      <button onClick={close} className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">
        <FaSignOutAlt className="text-red-600" />
        <button onClick={logout} className="ml-2">Logout</button>
      </button>
    </div>
  );
};

export default UserMenu;
