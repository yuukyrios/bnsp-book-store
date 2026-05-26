import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import StorePage from './pages/StorePage'
import SearchResults from './pages/SearchResults'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import AuthPage from './pages/AuthPage'

function Guard({ children }) {
  const token = useAuthStore(s => s.token)
  return token ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/store/:id" element={<StorePage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<Guard><Cart /></Guard>} />
          <Route path="/orders" element={<Guard><Orders /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}
