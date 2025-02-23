import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, updateUserRole, deleteUser } from '../store/authSlice';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleRoleChange = (id, role) => {
    dispatch(updateUserRole({ id, role }))
      .unwrap()
      .then(() => toast.success('User role updated successfully!'))
      .catch((err) => toast.error(err.message));
  };

  const handleDelete = (id) => {
    dispatch(deleteUser(id))
      .unwrap()
      .then(() => toast.success('User deleted successfully!'))
      .catch((err) => toast.error(err.message));
  };

  const filteredUsers = users.filter((user) => {
    return (
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === '' || user.role === roleFilter)
    );
  });

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-4 gap-8 bg-white  text-black rounded-lg shadow-md p-3 items-center">
      <h1 className="text-4xl font-bold  text-left  ">User Management</h1>
        <div className="flex-1 mr-4 w-[300px]">
          <input
            type="text"
            placeholder="Search by name or email"
            className=" p-2 w-full border-2 rounded focus:outline-none placeholder:text-black focus:ring-2 focus:ring-indigo-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 font-bold focus:ring-indigo-400   transition duration-150 ease-in-out"
          >
            <option value="" className='font-bold'>All Roles</option>
            <option value="admin" className="text-green-500 font-bold">Admin</option>
            <option value="customer" className="text-blue-500 font-bold">Customer</option>
          </select>
        </div>
      </div>
      {loading && <p className="text-left text-gray-600">Loading...</p>}
      {error && <p className="text-left text-red-500">{error}</p>}
      {!loading && !error && (
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-indigo-500 text-white rounded-lg ">
              <th className="py-3 px-6 text-left font-semibold uppercase">Sr. No</th>
              <th className="py-3 px-6 text-left font-semibold uppercase">Name</th>
              <th className="py-3 px-6 text-left font-semibold uppercase">Email</th>
              <th className="py-3 px-6 text-left font-semibold uppercase">Image</th>
              <th className="py-3 px-6 text-left font-semibold uppercase">Role</th>
              <th className="py-3 px-6 text-left font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="border-b hover:bg-gray-200 rounded-lg">
                <td className="py-3 px-6 text-left">{index + 1}</td>
                <td className="py-3 px-6">{user.name}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">
                  <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                </td>
                <td className="py-3 px-6 text-left">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={`border p-2 rounded focus:outline-none focus:ring-2 font-bold focus:ring-indigo-400 bg-gray-50 hover:bg-gray-100 transition duration-150 ease-in-out ${user.role === 'admin' ? 'text-green-500' : 'text-blue-500'}`}
                  >
                    <option value="admin" className="text-green-500 font-bold">Admin</option>
                    <option value="customer" className="text-blue-500 font-bold">Customer</option>
                  </select>
                </td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
