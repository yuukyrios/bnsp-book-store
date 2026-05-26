import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './hooks/useAuthStore'
import AuthPage from './pages/AuthPage'
import DashboardLayout from './components/layout/DashboardLayout'
import Overview from './pages/Overview'
import Stores from './pages/Stores'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Genres from './pages/Genres'
import BookTypes from './pages/BookTypes'

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="stores" element={<Stores />} />
        <Route path="books" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="genres" element={<Genres />} />
        <Route path="book-types" element={<BookTypes />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}