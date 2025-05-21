import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import AdminSidebar from './AdminSidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className='min-h-screen flex flex-col md:flex-row relative'>
            {/* mobile toggle button */}
            <div className="flex md:hidden p-4 bg-gray-900 text-white z-20">
                <button onClick={toggleSidebar}>
                    <FaBars size={20} />
                </button>
                <h1 className="ml-4 text-lg font-medium">Admin Dashboard</h1>
            </div>
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black opacity-50 z-20 md:hidden" onClick={toggleSidebar}>
                </div>
            )}

            {/* sidebar */}
            <div className={`bg-gray-900 w-64 text-white min-h-screen absolute md:relative transform  ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:translate-x-0 z-20 md:static md:block'}`}>
                {/* Sidebar */}
                <AdminSidebar />

            </div>
            {/* main content */}
            <div className="flex-grow p-4 overflow-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout