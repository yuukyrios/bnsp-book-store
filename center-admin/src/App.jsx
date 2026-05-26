import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './hooks/useAuthStore'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import Overview from './pages/Overview'
import UsersPage from './pages/UsersPage'
import MerchantsPage from './pages/MerchantsPage'
import StoresPage from './pages/StoresPage'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'
import TaxonomyPage from './pages/TaxonomyPage'

function Guard({ children }) {
  const token = useAuthStore(s => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a1a1a', color: '#e8e8e8', border: '1px solid #2e2e2e', fontFamily: 'Syne, sans-serif', fontSize: 13 }
      }} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Guard><Layout /></Guard>}>
          <Route index element={<Overview />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="merchants" element={<MerchantsPage />} />
          <Route path="stores" element={<StoresPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="taxonomy" element={<TaxonomyPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
