import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home'
import { Toaster } from 'sonner'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CollectionPage from './pages/CollectionPage'
import ProductDetails from './components/Products/ProductDetails'
import Checkout from './components/Cart/Checkout'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import MyOrdersPage from './pages/MyOrdersPage'
import AdminLayout from './components/Admin/AdminLayout'
import AdminHomePage from './pages/AdminHomePage'
import UserManagement from './components/Admin/UserManagement'
import ProductManagement from './components/Admin/ProductManagement'
import EditProductPage from './components/Admin/EditProductPage'
import OrderManagement from './components/Admin/OrderManagement'

import { Provider } from "react-redux"
import store from './redux/store'
import PageNotFound from './pages/PageNotFound'
import ProtectedRoute from './components/Common/ProtectedRoute'
import UnAuthorize from './pages/UnAuthorize'

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position='top-right' />
        <Routes>
          {/* User Layout */}
          <Route path='/' element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='profile' element={<Profile />} />
            <Route path='collections/:collection' element={<CollectionPage />} />
            <Route path='product/:id' element={<ProductDetails />} />
            <Route path='checkout' element={<Checkout />} />
            <Route path='order-confirmation' element={<OrderConfirmationPage />} />
            <Route path='my-orders' element={<MyOrdersPage />} />
            <Route path='order/:id' element={<OrderDetailsPage />} />
          </Route>
          {/*Admin Layout */}
          <Route path='/admin' element={
            <ProtectedRoute role='admin'>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminHomePage />} />
            <Route path='users' element={<UserManagement />} />
            <Route path='products' element={<ProductManagement />} />
            <Route path='products/:id/edit' element={<EditProductPage />} />
            <Route path='orders' element={<OrderManagement />} />
          </Route>
          <Route path='/unauthorized' element={<UnAuthorize />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
