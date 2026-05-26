import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../hooks/useAuthStore'
import {
  LayoutDashboard, Store, BookOpen, ShoppingCart,
  Tag, Layers, LogOut, Menu, X, ChevronRight
} from 'lucide-react'
import './DashboardLayout.css'

const NAV = [
  { to: '/',           label: 'Overview',    icon: LayoutDashboard, section: 'MAIN' },
  { to: '/stores',     label: 'Stores',      icon: Store },
  { to: '/books',      label: 'Books',       icon: BookOpen },
  { to: '/orders',     label: 'Orders',      icon: ShoppingCart },
  { to: '/genres',     label: 'Genres',      icon: Tag,    section: 'CATALOG' },
  { to: '/book-types', label: 'Book Types',  icon: Layers },
]

const PAGE_TITLES = {
  '/':           'Dashboard',
  '/stores':     'Stores',
  '/books':      'Books',
  '/orders':     'Orders',
  '/genres':     'Genres',
  '/book-types': 'Book Types',
}

export default function DashboardLayout() {
  const { merchant, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }
  const title = PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <div className="dl-root">
      {/* Mobile overlay */}
      {open && <div className="dl-overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`dl-sidebar ${open ? 'dl-sidebar--open' : ''}`}>
        <div className="dl-logo">
          <span className="dl-logo-text">Akasha<span>Hub</span></span>
          <button className="dl-close-btn" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="dl-merchant-card">
          <div className="dl-avatar">{merchant?.username?.[0]?.toUpperCase() ?? 'M'}</div>
          <div>
            <div className="dl-merchant-name">{merchant?.username}</div>
            <div className="dl-merchant-email">{merchant?.email}</div>
          </div>
        </div>

        <nav className="dl-nav">
          {NAV.map((item, i) => {
            const Icon = item.icon
            const prev = NAV[i - 1]
            const showSection = item.section && (!prev || prev.section !== item.section)
            return (
              <div key={item.to}>
                {showSection && <div className="dl-nav-section">{item.section}</div>}
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `dl-nav-item ${isActive ? 'dl-nav-item--active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  <ChevronRight size={14} className="dl-nav-arrow" />
                </NavLink>
              </div>
            )
          })}
        </nav>

        <div className="dl-sidebar-footer">
          <button className="dl-logout" onClick={handleLogout}>
            <LogOut size={17} strokeWidth={1.8} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="dl-main">
        <header className="dl-topbar">
          <div className="dl-topbar-left">
            <button className="dl-hamburger" onClick={() => setOpen(true)}>
              <Menu size={22} />
            </button>
            <h1 className="dl-page-title">{title}</h1>
          </div>
          <div className="dl-topbar-right">
            <div className="dl-topbar-avatar">{merchant?.username?.[0]?.toUpperCase() ?? 'M'}</div>
          </div>
        </header>

        <main className="dl-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}