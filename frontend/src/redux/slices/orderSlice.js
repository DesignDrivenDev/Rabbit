import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// Async Thunk to fetch user orders
export const fetcUserhOrders = createAsyncThunk('orders/fetchUserOrders', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/orders/my-orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// Async thunk to fetch order details by id
export const fetchOrderDetails = createAsyncThunk('orders/fetchOrderDetails', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetch user orders
            .addCase(fetcUserhOrders.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetcUserhOrders.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload
            })
            .addCase(fetcUserhOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || 'Failed to fetch user orders'
            })
            // fetch order details
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false
                state.orderDetails = action.payload
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default orderSlice.reducer