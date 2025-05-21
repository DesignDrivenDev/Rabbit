import React from 'react'
import { FaBoxOpen, FaClipboardList, FaSign, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../redux/slices/authSlice'
import { clearCart } from '../../redux/slices/cartSlice'
import { useDispatch } from 'react-redux'

const AdminSidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        dispatch(clearCart())
        navigate("/")
    }
    return (
        <div className='p-6'>
            <div className="mb-6">
                <Link to="/admin" className='text-2xl font-medium'>
                    Rabbit
                </Link>
            </div>
            <h2 className="text-xl font-medium mb-6">Admin Dashboard</h2>
            <nav className='flex flex-col sapce-y-2'>

                <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'bg-gray-700 text-white py-2 px-4 rounded flex items-center space-x-2' : 'text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2')}>
                    <FaUser />
                    <span className=''>Users</span>
                </NavLink>
                <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'bg-gray-700 text-white py-2 px-4 rounded flex items-center space-x-2' : 'text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2')}>
                    <FaBoxOpen />
                    <span className=''>Products</span>
                </NavLink>
                <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'bg-gray-700 text-white py-2 px-4 rounded flex items-center space-x-2' : 'text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2')}>
                    <FaClipboardList />
                    <span className=''>Orders</span>
                </NavLink>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'bg-gray-700 text-white py-2 px-4 rounded flex items-center space-x-2' : 'text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2')}>
                    <FaStore />
                    <span className=''>Shop</span>
                </NavLink>
            </nav>
            <div className="mt-6">
                <button onClick={handleLogout} className='w-full p-2 bg-red-600  hover:bg-red-700 text-white rounded-md transition-colors duration-300 flex items-center space-x-2 justify-center'>
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default AdminSidebar