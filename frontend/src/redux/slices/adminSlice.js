import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk to fetch all users(admin only)
export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        console.log(response.data, "response")
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// Add the create user action
export const addUser = createAsyncThunk('admin/addUser', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/admin/users`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// Update the user Info
export const updateUser = createAsyncThunk('admin/updateUser', async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${import.meta.env?.VITE_BACKEND_URL}/api/admin/users/${id}`, { name, email, role }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        return response?.data?.user
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// Delete the user
export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${import.meta.env?.VITE_BACKEND_URL}/api/admin/users/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetch users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'Failed to fetch users'
            })
            // update the user
            .addCase(updateUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            // 13:08 hrs
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false
                state.users = state.users.map(user => user._id === action.payload._id ? action.payload : user)
                state.error = null
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'Failed to update user'
            })
            // delete the user
            .addCase(deleteUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false
                state.users = state.users.filter(user => user._id !== action.payload)
                state.error = null
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'Failed to delete user'
            })
            // add user
            .addCase(addUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false
                state.users.push(action.payload)
                state.error = null
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'Failed to add user'
            })
    }
})

export default adminSlice.reducer