import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PaypalButton from "./PaypalButton"
import { useDispatch, useSelector } from "react-redux"
import { createCheckout } from "../../redux/slices/checkoutSlice"
import axios from "axios"

const Checkout = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { cart, loading, error } = useSelector((state) => state.cart)

    const { user } = useSelector((state) => state.auth)
    const [checkoutId, setCheckoutId] = useState(null)
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: ""
    })

    // Ensure cart is loaded before proceeding
    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/")
        }
    }, [cart, navigate])

    const handleCreateCheckout = async (e) => {
        e.preventDefault()
        if (cart && cart.products && cart.products.length > 0) {
            const response = await dispatch(createCheckout({
                checkoutItems: cart.products,
                shippingAddress,
                paymentMethod: "Paypal",
                totalPrice: cart.totalPrice
            }))

            if (response.payload && response.payload._id) {
                setCheckoutId(response.payload._id) // Set the checkout ID if successful
            }
        }
    }

    const handlePaymentSuccess = async (details) => {
        try {
            const response = await axios.put(`${import.meta.env?.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`, {
                paymentStatus: "paid",
                paymentDetails: details
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            })
            await handleFinalizeCheckout(checkoutId)// Finalize the checkout if payment is successful
        } catch (error) {
            console.error(error)
        }
    }

    const handleFinalizeCheckout = async (checkoutId) => {
        try {
            const token = localStorage.getItem('userToken');
            console.log('Token:', token);
            if (!token) {
                throw new Error('No user token found in localStorage');
            }
            const url = `${import.meta.env?.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`;
            const response = await axios.post(
                url,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            navigate("/order-confirmation");
        } catch (error) {
            console.error(error)
        }
    };

    if (loading) return <p>Loading...</p>
    if (error) return <h1>Error: {error}</h1>
    if (!cart || !cart.products || cart.products.length === 0) {
        return <p>Your cart is empty</p>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
            {/* left section */}
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl uppercase mb-6">Checkout</h2>
                <form onSubmit={handleCreateCheckout}>
                    <h3 className="text-lg mb-4">Contact Details</h3>
                    <div className="mb-4">
                        <label htmlFor="" className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={user?.user?.email}
                            className="w-full p-2 border rounded"
                            disabled
                        />
                    </div>
                    <h3 className="text-lg mb-4">Delivery</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={shippingAddress.firstName}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={shippingAddress.lastName}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            value={shippingAddress.address}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">City</label>
                            <input
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Postal Code</label>
                            <input
                                type="text"
                                value={shippingAddress.postalCode}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">Country</label>
                            <input
                                type="text"
                                value={shippingAddress.country}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Phone</label>
                            <input
                                type="text"
                                value={shippingAddress.phone}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        {!checkoutId ? (<button type="submit" className="w-full bg-black text-white py-3 rounded">Continue to Payment</button>) : (
                            <div>
                                <h3 className="text-lg mb-4">Pay with Paypal</h3>
                                {/* Paypal button component */}
                                <PaypalButton
                                    amount={cart.totalPrice}
                                    onSuccess={handlePaymentSuccess}
                                    onError={(err) => alert("Payment failed. Try again. ")}
                                />
                            </div>
                        )}
                    </div>
                </form>
            </div>
            {/* right section */}
            <div className="bg-gray-50 p-6 rounded-lg h-[73vh] overflow-y-auto">
                <h3 className="text-lg mb-4">Order Summary</h3>
                <div className="border-t py-4 mb-4 border-gray-300">
                    {cart.products.map((product) => (
                        <div key={product?.productId} className="py-2 flex items-start justify-between border-b border-gray-300">
                            <div className="flex items-start">
                                <img src={product?.image} alt={product?.name} className="w-20 h-20 object-cover rounded mr-4" />
                                <div className="space-y-1">
                                    <h3 className="">{product?.name}</h3>
                                    <div className="text-gray-500">Size: {product?.size}</div>
                                    <div className="text-gray-500">Color: {product?.color}</div>
                                </div>
                            </div>
                            <p className="text-lg">
                                ${product.price?.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center text-lg mb-4">
                    <p>Sub total</p>
                    <p>${cart.totalPrice?.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center text-lg ">
                    <p>Shipping</p>
                    <p>FREE</p>
                </div>
                <div className="flex justify-between items-center text-lg mt-4 border-t pt-4 border-gray-300">
                    <p>Total</p>
                    <p>${cart.totalPrice?.toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}

export default Checkout