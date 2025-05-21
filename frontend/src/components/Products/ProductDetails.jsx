import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchSimilarProducts } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";



const ProductDetails = ({ productId }) => {

    const { id } = useParams()
    const dispatch = useDispatch()
    const { selectedProduct, similarProducts, loading, error } = useSelector((state) => state.products);
    const { user, guestId } = useSelector(state => state.auth)

    const [thumbnail, setThumbnail] = useState("");
    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColor, setSelectedColor] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

    const productFetchId = productId || id;

    useEffect(() => {
        if (productFetchId) {
            dispatch(fetchProductById(productFetchId))
            dispatch(fetchSimilarProducts({ id: productFetchId }))
        }

    }, [dispatch, productFetchId])

    const hnadleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1)
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1)
    }

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setThumbnail(selectedProduct.images[0].url)
        }
    }, [selectedProduct])

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            toast.error("Please select both size and color before adding to the cart.", {
                duration: 1000
            })
            return;
        }
        setIsButtonDisabled(true)
        dispatch(addToCart({
            productId: productFetchId,
            quantity,
            size: selectedSize,
            color: selectedColor,
            userId: user?._id,
            guestId,
        })).then(() => {
            toast.success("Item added to cart successfully.", {
                duration: 1000
            })
        }).finally(() => {
            setIsButtonDisabled(false)
        })
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>
    return (
        <div className='p-6'>
            {selectedProduct && (
                <div className="max-w-7xl mx-auto bg-white rounded-lg">
                    <div className='flex flex-col md:flex-row'>
                        {/* left thumbnails */}
                        <div className='hidden md:flex flex-col space-y-4 mr-6 gap-x-4'>
                            {selectedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${thumbnail === image.url ? "border-black" : "border-gray-300"}`}
                                    onClick={() => setThumbnail(image.url)}
                                />
                            ))}
                        </div>
                        {/* Main Image */}
                        <div className="md:w-1/2 ">
                            <div className="mb-4">
                                <img
                                    src={thumbnail || selectedProduct.images[0].url}
                                    alt="Main Product"
                                    className="w-full h-auto object-cover rounded-lg" />
                            </div>
                        </div>
                        {/* mobile thumbnails*/}
                        <div className="md:hidden flex overscroll-x-auto mb-4 gap-x-4">
                            {selectedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url} alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${thumbnail === image.url ? "border-black" : "border-gray-300"}`}
                                    onClick={() => setThumbnail(image.url)}
                                />
                            ))}
                        </div>
                        {/* Right  Side*/}
                        <div className="md:w-1/2 md:ml-10">
                            <h1 className="text-2xl md:text-3xl font-semibold mb-2">{selectedProduct.name}</h1>
                            <p className="text-lg text-gray-600 mb-1 line-through">{selectedProduct.originalPrice && selectedProduct.originalPrice}</p>
                            <p className="text-xl text-gray-500 mb-2">${selectedProduct.price}</p>
                            <p className="text-gray-600 mb-4">
                                {selectedProduct.description}
                            </p>
                            <div className="mb-4">
                                <p className="text-gray-700 ">Color:</p>
                                <div className="flex gap-2 mt-2">
                                    {selectedProduct.colors.map((color, index) => (
                                        <button key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`h-8 w-8 rounded-full border ${selectedColor === color ? "border-4 border-white" : "border-gray-300"}`}
                                            style={{ backgroundColor: color.toLowerCase(), filter: "brightness(0.5)" }}> </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4 ">
                                <p className="text-gray-700">Size:</p>
                                <div className="flex gap-2 mt-2">
                                    {selectedProduct.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-2 py-2 rounded border ${selectedSize === size ? "bg-black text-white" : ""}`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6 ">
                                <p className="text-gray-700 ">Quantity:</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <button
                                        onClick={() => hnadleQuantityChange("minus")}
                                        className="px-2 py-2 bg-gray-200 text-lg rounded-md"
                                    >-</button>
                                    <span className="text-lg">{quantity}</span>
                                    <button onClick={() => hnadleQuantityChange("plus")} className="px-2 py-2 bg-gray-200 text-lg rounded-md">+</button>
                                </div>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                                className={`w-full py-3.5 cursor-pointer font-medium bg-black text-white  transition rounded ${isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"}`} >
                                {isButtonDisabled ? "Adding.." : "Add to Cart"}
                            </button>
                            <div className="mt-10 text-gray-700">
                                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                                <table className="w-full text-left text-sm text-gray-600">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 font-semibold ">Brand</td>
                                            <td className="py-1 ">{selectedProduct.brand}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold  ">Material</td>
                                            <td className="py-1 ">{selectedProduct.matarial}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Suggestion section */}
                    <div className="mt-20">
                        <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
                        <ProductGrid products={similarProducts} />
                    </div>
                </div>
            )}
        </div >
    )
}

export default ProductDetails


