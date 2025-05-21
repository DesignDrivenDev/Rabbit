import React, { use, useEffect, useState } from 'react'
import { IoMdTrash } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addUser, deleteUser, fetchUsers, updateUser } from '../../redux/slices/adminSlice'

const UserManagement = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth.user)
    const { users, loading, error } = useSelector(state => state.admin)
    console.log(user, "user")
    useEffect(() => {
        if (user && user.role !== "admin") {
            navigate("/")
        }
    }, [user, navigate])

    useEffect(() => {
        if (user && user.role === "admin") {
            dispatch(fetchUsers())
        }
    }, [dispatch])

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "customer", //default role
        password: "",
    })

    // const [error, setError] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(addUser(formData))
        // reset form after submit
        setFormData({ name: "", email: "", role: "customer", password: "" })
        // setError("")
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleRoleChange = (userId, newRole) => {
        dispatch(updateUser({ id: userId, role: newRole }))
    }


    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(userId))
        }
    }


    return (
        <div className='max-w-7xl mx-auto p-6'>
            <div className=''>
                <h2 className="text-lg font-bold mb-4">User Management</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className='block text-sm font-semibold mb-2' >Name</label>
                        <input
                            type="text"
                            name='name'
                            value={formData.name}
                            // onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            onChange={handleChange}
                            className='w-full p-2 border rounded'
                            placeholder='Enter your name'
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className='block text-sm font-semibold mb-2' >Email</label>
                        <input
                            type="email"
                            name='email'
                            value={formData.email}
                            // onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onChange={handleChange}
                            className='w-full p-2 border rounded'
                            placeholder='Enter your email'
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className='block text-sm font-semibold mb-2' >Password</label>
                        <input
                            type="password"
                            name='password'
                            value={formData.password}
                            // onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            onChange={handleChange}
                            className='w-full p-2 border rounded'
                            placeholder='Enter your password'
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className='block text-sm font-semibold mb-2' >Role</label>
                        <select
                            name='role'
                            value={formData.role}
                            // onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            onChange={handleChange}
                            className='w-full p-2 border rounded'
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'>Add User</button>
                </form>
            </div>
            {/* User List Management */}
            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Users</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-gray-700 border border-gray-200">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                            <tr className="divide-x divide-gray-200">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users && users.length > 0 ? users.map((user) => (
                                <tr key={user._id} className="divide-x divide-gray-200">
                                    <td className="px-4 py-3">{user.name}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className='p-2 border rounded'
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleDeleteUser(user._id)} className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 '>
                                            Delete
                                        </button>
                                    </td>
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
        </div>
    )
}

export default UserManagement