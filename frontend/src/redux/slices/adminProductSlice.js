import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = `${import.meta.env?.VITE_BACKEND_URL}`
const USER_TOKEN = `Bearer ${localStorage.getItem('userToken')}`

// Async thunk to get all products (admin)
export const fetchAdminProducts = createAsyncThunk('adminProducts/fetchAdminProducts', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/products`, {
            headers: {
                Authorization: USER_TOKEN
            }
        })
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// async function to create a new product
export const createProduct = createAsyncThunk('adminProducts/createProduct', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/admin/products`, data, {
            headers: {
                Authorization: USER_TOKEN
            }
        })
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// async thunk to update a product an existing product
export const updateProduct = createAsyncThunk('adminProducts/updateProduct', async ({ id, productData }, { rejectWithValue }) => {
    try {
        console.log(productData, "productData")
        const response = await axios.put(`${API_URL}/api/products/${id}`, productData, {
            headers: {
                Authorization: USER_TOKEN
            }
        })
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// async thunk to delete a product
export const deleteProduct = createAsyncThunk('adminProducts/deleteProduct', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_URL}/api/products/${id}`, {
            headers: {
                Authorization: USER_TOKEN
            }
        })
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const adminProductsSlice = createSlice({
    name: 'adminProducts',
    initialState: {
        products: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetch all products
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload.products
                state.error = null
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'Failed to fetch products'
            })
            // update a product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false
                const index = state.products.findIndex(product => product._id === action.payload._id)
                if (index !== -1) state.products[index] = action.payload
                state.error = null
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'Failed to update product'
            })
            // create a new product
            .addCase(createProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products.push(action.payload)
                state.error = null
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'Failed to create product'
            })
            // delete a product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products = state.products.filter(product => product._id !== action.payload)
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'Failed to delete product'
            })
    }
})

export default adminProductsSlice.reducer