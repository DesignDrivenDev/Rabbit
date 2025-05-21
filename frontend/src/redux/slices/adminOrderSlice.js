import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = `${import.meta.env?.VITE_BACKEND_URL}`
const USER_TOKEN = `Bearer ${localStorage.getItem('userToken')}`

// Async thunk to get all orders (admin)
export const fetchAllOrders = createAsyncThunk('adminOrders/fetchAllOrders', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/orders`, {
            headers: {
                Authorization: USER_TOKEN
            }
        })
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// Update the order delivery status
export const updateOrderStatus = createAsyncThunk('adminOrders/updateOrderStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/api/admin/orders/${id}`, { status }, {
            headers: {
                Authorization: USER_TOKEN
            }
        })
        console.log(response, "response")
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// Delete an order
export const deleteOrder = createAsyncThunk('adminOrders/deleteOrder', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/api/admin/orders/${id}`, {
            headers: {
                Authorization: USER_TOKEN
            }
        })
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const adminOrdersSlice = createSlice({
    name: 'adminOrders',
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch all orders
        builder.addCase(fetchAllOrders.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.loading = false
            state.orders = action.payload
            state.error = null

            // Calculate total orders and total sales
            state.totalOrders = state.orders.length
            state.totalSales = state.orders.reduce((total, order) => total + order.totalPrice, 0)
        })
        builder.addCase(fetchAllOrders.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message || 'Failed to fetch orders'
        })
        // Update the order delivery status
        builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
            const updatedOrder = action.payload

            console.log(action.payload, "firstOrder")
            const orderIndex = state.orders.findIndex(order => order._id === updatedOrder._id)
            if (orderIndex !== -1) {
                state.orders[orderIndex] = updatedOrder
            }
        })
        // Delete an order
        builder.addCase(deleteOrder.fulfilled, (state, action) => {
            state.orders = state.orders.filter(order => order._id !== action.payload)
        })
    }
})

export default adminOrdersSlice.reducer