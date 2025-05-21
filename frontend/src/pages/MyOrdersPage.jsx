import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetcUserhOrders } from '../redux/slices/orderSlice'

const MyOrdersPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { orders, loading, error } = useSelector((state) => state?.orders)

    useEffect(() => {
        dispatch(fetcUserhOrders())
    }, [dispatch])

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`)
    }
    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error}</div>
    }
    return (
        <div className='max-w-7xl mx-auto p-4 sm:p-6'>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
            <div className="relative shadow-md sm:rounded-lg overflow-hidden">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="py-2 px-4 sm:py-3">Image</th>
                            <th className="py-2 px-4 sm:py-3">Order ID</th>
                            <th className="py-2 px-4 sm:py-3">Created</th>
                            <th className="py-2 px-4 sm:py-3">Shipping Address</th>
                            <th className="py-2 px-4 sm:py-3">Items</th>
                            <th className="py-2 px-4 sm:py-3">Price</th>
                            <th className="py-2 px-4 sm:py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {orders && orders?.length > 0 ? orders.map((order) => (
                            <tr
                                key={order._id}
                                onClick={() => handleRowClick(order._id)}
                                className='border-b hover:border-gray-500 cursor-pointer text-sm'
                            >
                                <td className="py-2 px-2 sm:py-4 sm:px-4">
                                    <img src={order.orderItems[0].image} alt={order.orderItems[0].name} className='w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg' />
                                </td>
                                <td className='p-2 sm:p-4 font-medium text-gray-900 whitespace-nowrap'>#{order._id}</td>
                                <td className='p-2 sm:p-4 font-medium text-gray-900 whitespace-nowrap'>{order.createdAt.toLocaleString()}</td>

                                <td className='p-2 sm:p-4 font-medium text-gray-900 whitespace-nowrap'>{order.shippingAddress && order.shippingAddress.city}, {order.shippingAddress && order.shippingAddress.country}</td>
                                <td className='p-2 sm:p-4 font-medium text-gray-900 whitespace-nowrap'>{order.orderItems.length}</td>
                                <td className='p-2 sm:p-4 font-medium text-gray-900 whitespace-nowrap'>${order.totalPrice}</td>
                                <td className='p-2 sm:p-4 font-medium text-gray-900 whitespace-nowrap'>
                                    {/* {order.isPaid === true ? "paid" : "unpaid"} */}
                                    <span className={`${order.isPaid ? "text-green-700 bg-green-100" : "bg-red-100 text-red-700"} px-2 py-1 text-xs sm:text-sm font-medium rounded-3xl`}>
                                        {order.isPaid ? "Paid" : "Pending"}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className='py-4 px-4 text-center text-gray-500'
                                >
                                    You have no orders.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyOrdersPage