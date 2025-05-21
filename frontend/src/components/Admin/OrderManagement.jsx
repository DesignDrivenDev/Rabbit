import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchAllOrders, updateOrderStatus } from "../../redux/slices/adminOrderSlice"

const OrderManagement = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth.user)
    const { orders, loading, error } = useSelector((state) => state.adminOrders)

    useEffect(() => {
        if (!user && user.role !== "admin") {
            navigate("/")
        } else {
            dispatch(fetchAllOrders())
        }
    }, [dispatch, user, navigate])

    const handleStatusChange = (orderId, newStatus) => {
        console.log(orderId, newStatus, "handleStatusChange")
        dispatch(updateOrderStatus({ id: orderId, status: newStatus }))
    }

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error: {error}</p>
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Order Management</h2>
            <div className="overflow-x-auto shadow-md sm:rounded">
                <table className="min-w-full text-left text-gray-700">
                    <thead className=" bg-gray-100 text-sm font-semibold uppercase text-gray-700">
                        <tr>
                            <td className="py-3 px-4">Order ID</td>
                            <td className="py-3 px-4">Customer Name</td>
                            <td className="py-3 px-4">Total Amount</td>
                            <td className="py-3 px-4">Status</td>
                            <td className="py-3 px-4">Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order._id} className="border-b hover:bg-gray-50 cursor-pointer">
                                    <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                                        #{order._id}
                                    </td>
                                    <td className="p-4">{order.user.name}</td>
                                    <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        >
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="canceled">Canceled</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleStatusChange(order._id, "delivered")}
                                            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                                        >
                                            Mark as Delivered
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderManagement