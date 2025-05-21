import { useEffect, useState } from "react"
import ProductForm from "./ProductForm"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../../redux/slices/productSlice";
import { updateProduct } from "../../redux/slices/adminProductSlice";
import axios from "axios";

const EditProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams()
    const { selectedProduct, loading, error } = useSelector(state => state.products)

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: [],

    })
    const [uploading, setUploading] = useState(false); //Image uploading state

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id))
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedProduct) {
            setProductData(selectedProduct);
        }
    }, [selectedProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        try {
            setUploading(true);
            const { data } = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            })
            console.log(data, "image upload")
            setProductData(prev => ({ ...prev, images: [...prev.images, { url: data.url, altText: "" }] }));
            setUploading(false);
        } catch (error) {
            console.log(error)
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProduct({ id, productData }))
        navigate("/admin/products")
    }
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div className="max-w-4xl mx-auto p-6 shadow-md rounded-md">
            <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="name" className="block font-medium mb-2">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter product name"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="description" className="block font-medium mb-2">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter product description"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="price" className="block font-medium mb-2">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter product price"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="countInStock" className="block font-medium mb-2">Count in Stock</label>
                    <input
                        type="number"
                        id="countInStock"
                        name="countInStock"
                        value={productData.countInStock}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter product count in stock"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="sku" className="block font-medium mb-2">SKU</label>
                    <input
                        type="text"
                        id="sku"
                        name="sku"
                        value={productData.sku}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter product sku"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="sizes" className="block font-medium mb-2">Sizes (Comma-separated)</label>
                    <input
                        type="text"
                        id="sizes"
                        name="sizes"
                        value={productData.sizes.join(", ")}
                        onChange={(e) => setProductData({ ...productData, sizes: e.target.value.split(",").map((size) => size.trim()) })}
                        className="w-full p-2 border rounded"
                        placeholder="Enter product sizes"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="colors" className="block font-medium mb-2">Colors (Comma-separated)</label>
                    <input
                        type="text"
                        id="colors"
                        name="colors"
                        value={productData.colors.join(", ")}
                        onChange={(e) => setProductData({ ...productData, colors: e.target.value.split(",").map((color) => color.trim()) })}
                        className="w-full p-2 border rounded"
                        placeholder="Enter product colors"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="colors" className="block font-medium mb-2">Colors (Comma-separated)</label>
                    <input
                        type="text"
                        id="colors"
                        name="colors"
                        value={productData.colors.join(", ")}
                        onChange={(e) => setProductData({ ...productData, colors: e.target.value.split(",").map((size) => size.trim()) })}
                        className="w-full p-2 border rounded"
                        placeholder="Enter product colors"
                    />
                </div>

                {/* image upload */}
                <div className="mb-6">
                    <label htmlFor="image" className="block font-medium mb-2">Upload Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageUpload}
                        className="w-full p-2 border rounded"
                    />
                    {uploading && <p>Uploading Image...</p>}
                    <div className="flex gap-4 mt-4">
                        {productData.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={image.altText}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        ))}
                    </div>

                </div>
                <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors">Update Product</button>
            </form>
        </div>
    )
}

export default EditProductPage


// condition: "",
// tags: "",
// originalPrice: 0,
// discount: 0,
// rating: 0,
// numReviews: 0,
// isFeatured: false,
// isBestSeller: false,
// isNewArrival: false,
// isOnSale: false,
// isTrending: false,
// isBestValue: false,
// isNewCollection: false,
// isNewLaunch: false,
// isHot: false,
// isSale: false,
// isNew: false,
// isLimitedTimeOffer: false,