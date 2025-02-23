import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrder } from '../store/orderSlice';
import AdminOrderCard from './AdminOrderCard';

const AdminOrderManagement = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    const handleStatusChange = (orderId, status) => {
        dispatch(updateOrder({ _id: orderId, status }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

  const sortedOrders = orders.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Order Management</h1>
            <div className="flex flex-col ">
                {sortedOrders.map((order) => (
                    <AdminOrderCard key={order._id} order={order} onStatusChange={handleStatusChange} />
                ))}
            </div>
        </div>
    );
};

export default AdminOrderManagement;
