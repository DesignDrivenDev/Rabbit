import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// Async Thunk to fetch all products by collection and optional filters
export const fetchProductsByFilters = createAsyncThunk('products/fetchByFilters', async (
    { collection, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit }, { rejectWithValue }) => {

    const queryParams = new URLSearchParams();
    if (collection) queryParams.append('collection', collection);
    if (size) queryParams.append('size', size);
    if (color) queryParams.append('color', color);
    if (gender) queryParams.append('gender', gender);
    if (minPrice) queryParams.append('minPrice', minPrice);
    if (maxPrice) queryParams.append('maxPrice', maxPrice);
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (search) queryParams.append('search', search);
    if (category) queryParams.append('category', category);
    if (material) queryParams.append('material', material);
    if (brand) queryParams.append('brand', brand);
    if (limit) queryParams.append('limit', limit);

    try {
        const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/products?${queryParams.toString()}`)
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// Async Thunk to fetch a single product by ID
export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/products/${id}`)
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// async thunk to update a product by id
export const updateProductById = createAsyncThunk('products/updateProduct', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${import.meta.env?.VITE_BACKEND_URL}/api/products/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// Async Thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk('products/fetchSimilarProducts', async ({ id }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/products/similar/${id}`)
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        selectedProduct: null,// store the details of the single product
        similarProducts: [],
        product: {},
        loading: false,
        error: null,
        filters: {
            collection: '',
            size: '',
            color: '',
            gender: '',
            minPrice: '',
            maxPrice: '',
            sortBy: '',
            search: '',
            category: '',
            material: '',
            brand: '',
            limit: ''
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        clearFilters: (state) => {
            state.filters = {
                collection: '',
                size: '',
                color: '',
                gender: '',
                minPrice: '',
                maxPrice: '',
                sortBy: '',
                search: '',
                category: '',
                material: '',
                brand: '',
                limit: ''
            }
        }
    },
    extraReducers: (builder) => {
        // handle fetching products with filters
        builder.addCase(fetchProductsByFilters.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(fetchProductsByFilters.fulfilled, (state, action) => {
            state.loading = false
            state.products = Array.isArray(action.payload) ? action.payload : []
        })
        builder.addCase(fetchProductsByFilters.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message
        })
        // handle fetching a single product
        builder.addCase(fetchProductById.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(fetchProductById.fulfilled, (state, action) => {
            state.loading = false
            state.selectedProduct = action.payload
        })
        builder.addCase(fetchProductById.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message
        })
        // handle updating a product
        builder.addCase(updateProductById.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(updateProductById.fulfilled, (state, action) => {
            state.loading = false
            const updatedProduct = action.payload
            const index = state.products.findIndex(product => product._id === updatedProduct._id)
            if (index !== -1) {
                state.products[index] = updatedProduct
            }
            // state.product = action.payload
            // state.products = state.products.map((product) => {
            //     if (product._id === action.payload._id) {
            //         return action.payload
            //     }
            //     return product
            // })
        })
        builder.addCase(updateProductById.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message
        })
        // handle fetching similar products
        builder.addCase(fetchSimilarProducts.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(fetchSimilarProducts.fulfilled, (state, action) => {
            state.loading = false
            state.similarProducts = Array.isArray(action.payload) ? action.payload : []
        })
        builder.addCase(fetchSimilarProducts.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message
        })
    }
})

export const { setFilters, clearFilters } = productSlice.actions
export default productSlice.reducer