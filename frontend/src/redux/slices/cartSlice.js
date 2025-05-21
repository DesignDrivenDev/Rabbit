import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// Helper function to load cart from localStorage if it exists
const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cart')
    return storedCart ? JSON.parse(storedCart) : { products: [] }
}

// Helper function to save cart to localStorage
const saveCartToLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart))
}

// Fetch cart for a user/guest
export const fetchCart = createAsyncThunk('cart/fetchCart', async ({ userId, guestId }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/cart`,
            {
                params: { userId, guestId }
            }
        )
        return response?.data
    } catch (error) {
        console.log("Error fetching cart for user/guest:", error)
        return rejectWithValue(error.response.data)
    }
})

// Add a item to the cart for a user or guest
export const addToCart = createAsyncThunk('cart/addToCart', async ({
    productId,
    quantity,
    size,
    color,
    userId,
    guestId

}, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/cart`, { productId, quantity, size, color, userId, guestId })
        return response?.data
    } catch (error) {
        console.log("Error adding item to cart:", error)
        return rejectWithValue(error.response.data)
    }
})

// Update the quantity of a product in the cart
export const updateCartItemQuantity = createAsyncThunk('cart/updateCartItemQuantity', async ({ productId, quantity, userId, guestId, size, color }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${import.meta.env?.VITE_BACKEND_URL}/api/cart`, { productId, quantity, size, color, userId, guestId, })
        return response?.data
    } catch (error) {
        console.log("Error updating cart:", error)
        return rejectWithValue(error.response.data)
    }
})

// Remove an item form the cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ productId, userId, guestId, size, color }, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${import.meta.env?.VITE_BACKEND_URL}/api/cart`, { data: { productId, size, color, userId, guestId } })
        return response?.data
    } catch (error) {
        console.log("Error removing item from cart:", error)
        return rejectWithValue(error.response.data)
    }
})

// Merge guest cart into user cart
export const mergeGuestCart = createAsyncThunk('cart/mergeGuestCart', async ({ guestId, user }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/cart/merge`, { guestId, user }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        return response?.data
    } catch (error) {
        console.log("Error merging guest cart into user cart:", error)
        return rejectWithValue(error.response.data)
    }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: loadCartFromLocalStorage(),
        loading: false,
        error: null
    },
    reducers: {
        clearCart: (state) => {
            state.cart = { products: [] }
            localStorage.removeItem('cart')
        }
    },
    extraReducers: (builder) => {
        // Fetch cart for a user/guest
        builder.addCase(fetchCart.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.loading = false
            state.cart = action.payload
            saveCartToLocalStorage(action.payload)
        })
        builder.addCase(fetchCart.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || 'Failed to fetch cart'
        })
        // Add a item to the cart for a user or guest
        builder.addCase(addToCart.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(addToCart.fulfilled, (state, action) => {
            state.loading = false
            state.cart = action.payload
            saveCartToLocalStorage(action.payload)
        })
        builder.addCase(addToCart.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || "Failed to add item to cart"
        })
        // Update the quantity of a product in the cart
        builder.addCase(updateCartItemQuantity.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(updateCartItemQuantity.fulfilled, (state, action) => {
            state.loading = false
            state.cart = action.payload
            saveCartToLocalStorage(action.payload)
        })
        builder.addCase(updateCartItemQuantity.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || "Failed to update cart item quantity"
        })
        // Remove an item form the cart
        builder.addCase(removeFromCart.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(removeFromCart.fulfilled, (state, action) => {
            state.loading = false
            state.cart = action.payload
            saveCartToLocalStorage(action.payload)
        })
        builder.addCase(removeFromCart.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || "Failed to remove item from cart"
        })
        // Merge guest cart into user cart
        builder.addCase(mergeGuestCart.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(mergeGuestCart.fulfilled, (state, action) => {
            state.loading = false
            state.cart = action.payload
            saveCartToLocalStorage(action.payload)
        })
        builder.addCase(mergeGuestCart.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || "Failed to merge guest cart into user cart"
        })
    }
})


export const { clearCart } = cartSlice.actions
export default cartSlice.reducer