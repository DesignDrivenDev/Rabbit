import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// Retrive user from localStorage if it exists
const user = localStorage.getItem('userInfo')

const userFromStorage = user ? JSON.parse(localStorage.getItem('userInfo')) : null

// Check for an exsting guest ID in the localStorage or generate a new one
const initialGuestId = localStorage.getItem('guestId') || `guest_${new Date().getTime()}`
localStorage.setItem('guestId', initialGuestId)


// initial state
const initialState = {
    isLoggedIn: userFromStorage ? true : false,
    user: userFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null
}

// Async Thunk to login a user
export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/users/login`, userData)
        localStorage.setItem('userInfo', JSON.stringify(response?.data))
        localStorage.setItem('userToken', response?.data?.token)

        return response?.data?.user
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


// Async Thunk to login a Registration
export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/users/register`, userData)
        localStorage.setItem('userInfo', JSON.stringify(response?.data))
        localStorage.setItem('userToken', response?.data?.token)

        return response?.data?.user
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state, action) => {
            state.user = null
            state.isLoggedIn = false
            state.guestId = `guest_${new Date().getTime()}` //Reset guest ID on logout
            localStorage.removeItem('userInfo')
            localStorage.removeItem('userToken')
            localStorage.setItem('guestId', state.guestId)//Set guest ID in localStorage
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`
            localStorage.setItem('guestId', state.guestId)
        }
    },
    extraReducers: (builder) => {
        // login
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
            state.isLoggedIn = true
        })
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message
        })
        // register
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
            state.isLoggedIn = true
        })
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message
        })
    }
})

export const { logout, generateNewGuestId } = authSlice.actions
export default authSlice.reducer