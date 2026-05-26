import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Search, User, Package, LogOut, X, Menu } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import toast from 'react-hot-toast'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const cartCount = useCartStore(s => s.count())
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const userRef = useRef()

  useEffect(() => {
    const p = new URLSearchParams(location.search)
    setQuery(p.get('q') || '')
  }, [location.search])

  useEffect(() => {
    const h = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setMobileOpen(false)
  }

  const handleLogout = () => {
    logout(); setUserOpen(false); toast.success('Logged out'); navigate('/')
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-mark">✦</span>Akasha
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <Search size={15} className="ns-icon" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products & stores…" />
          {query && <button type="button" className="ns-clear" onClick={() => setQuery('')}><X size={13}/></button>}
          <button type="submit" className="ns-btn">Search</button>
        </form>

        <div className="nav-right">
          <Link to="/cart" className="nav-cart">
            <ShoppingBag size={20} strokeWidth={1.8}/>
            {cartCount > 0 && <span className="cart-dot">{cartCount > 9 ? '9+' : cartCount}</span>}
          </Link>

          {user ? (
            <div className="nav-user" ref={userRef}>
              <button className="nav-user-btn" onClick={() => setUserOpen(v => !v)}>
                <span className="nav-avatar">{user.username[0].toUpperCase()}</span>
                <span className="nav-uname">{user.username}</span>
              </button>
              {userOpen && (
                <div className="nav-dropdown">
                  <Link to="/orders" className="nd-item" onClick={() => setUserOpen(false)}>
                    <Package size={14}/> My Orders
                  </Link>
                  <div className="nd-divider"/>
                  <button className="nd-item nd-item--red" onClick={handleLogout}>
                    <LogOut size={14}/> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="nav-signin">Sign In</Link>
          )}

          <button className="nav-burger" onClick={() => setMobileOpen(v => !v)} aria-label="menu">
            {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav-mobile">
          <form onSubmit={handleSearch} className="nm-search">
            <Search size={15}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" autoFocus/>
            <button type="submit">Go</button>
          </form>
          <nav className="nm-links">
            <Link to="/cart" onClick={() => setMobileOpen(false)}>🛍 Cart {cartCount > 0 && `(${cartCount})`}</Link>
            {user ? (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)}>📦 My Orders</Link>
                <button onClick={handleLogout}>↩ Log Out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)}>👤 Sign In</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
