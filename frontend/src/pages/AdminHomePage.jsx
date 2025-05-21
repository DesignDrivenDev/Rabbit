import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchAdminProducts } from "../redux/slices/adminProductSlice"
import { fetchAllOrders } from "../redux/slices/adminOrderSlice"

const AdminHomePage = () => {

    const dispatch = useDispatch()
    const { products, loading: productsLoading, error: productsError } = useSelector((state) => state.adminProducts)
    const { orders, totalOrders, totalSales, loading: ordersLoading, error: ordersError } = useSelector((state) => state.adminOrders)

    console.log(products, "products")

    useEffect(() => {
        dispatch(fetchAdminProducts())
        dispatch(fetchAllOrders())
    }, [dispatch])
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-emerald-700 mb-6">Admin Dashboard</h1>
            {productsLoading || ordersLoading ? (
                <p>Loading...</p>
            ) : productsError ? (
                <p className="text-red-500">Error while fetching products: {productsError}</p>
            ) : ordersError ? (
                <p>Error while fetching orders: {ordersError}</p>
            ) : (
                // Your actual content goes here, for example:
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Revenue</h2>
                        <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
                    </div>
                    <div className="p-4 shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
                        <p className="text-2xl font-bold">{totalOrders}</p>
                        <Link to="/admin/orders" className="text-blue-500 hover:underline text-sm">Manage Orders</Link>
                    </div>
                    <div className="p-4 shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Total Products</h2>
                        <p className="text-2xl font-bold">{products.products && products?.products.length}</p>
                        <Link to="/admin/products" className="text-blue-500 hover:underline text-sm">Manage Products</Link>
                    </div>
                </div>
            )}

            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-gray-700 border border-gray-200">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                            <tr className="divide-x divide-gray-200">
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">User</th>
                                {/* <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Shipping Address</th> */}
                                <th className="px-4 py-3">Total Price</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order._id} className="divide-x divide-gray-200">
                                    <td className="px-4 py-3">{order._id}</td>
                                    <td className="px-4 py-3">{order.user.name}</td>
                                    {/* <td className="px-4 py-3">{order.createdAt.toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{order.shippingAddress.city}, {order.shippingAddress.country}</td> */}
                                    <td className="px-4 py-3">{order.totalPrice.toFixed(2)}</td>
                                    <td className="px-4 py-3">{order.status}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-500">No recentorders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}

export default AdminHomePage