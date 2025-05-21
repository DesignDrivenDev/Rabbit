import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { fetchAdminProducts, deleteProduct } from "../../redux/slices/adminProductSlice"

const ProductManagement = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth.user)
    const { products, loading, error } = useSelector(state => state.adminProducts)
    useEffect(() => {
        const fetchProducts = async () => {
            const res = await dispatch(fetchAdminProducts())
        }
        fetchProducts()
    }, [dispatch])

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id))
        }
    }

    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error: {error}</p>
    }
    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Product Management</h1>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                SKU
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? products.map((product) => (
                            <tr key={product._id} className="border-b hover:bg-gray-50 cursor-pointer">
                                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                                <td className="p-4">{product.price}</td>
                                <td className="p-4">{product.sku}</td>
                                <td className="p-4">{product.category}</td>
                                <td className="p-4 flex gap-x-3 text-sm">
                                    <Link
                                        to={`/admin/products/${product._id}/edit`}
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white  rounded mr-2 text-center flex justify-center items-center px-2 py-1"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center text-gray-500 py-4">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductManagement