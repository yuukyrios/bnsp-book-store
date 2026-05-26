import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuthStore from '../../hooks/useAuthStore'
import toast from 'react-hot-toast'
import './Layout.css'

const NAV = [
  { to: '/',          icon: '◈', label: 'Overview',      end: true },
  { to: '/users',     icon: '○', label: 'Users'                    },
  { to: '/merchants', icon: '◇', label: 'Merchants'                },
  { to: '/stores',    icon: '□', label: 'Stores'                   },
  { to: '/products',  icon: '◻', label: 'Products'                 },
  { to: '/orders',    icon: '◁', label: 'Orders'                   },
  { to: '/taxonomy',  icon: '◈', label: 'Genres & Types'           },
]

export default function Layout() {
  const { admin, logout } = useAuthStore()
  const nav = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    nav('/login')
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-mark">⬡</span>
          <div>
            <div className="logo-name">AKASHA</div>
            <div className="logo-sub">CONTROL CENTER</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ to, icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-chip">
            <div className="admin-dot" />
            <div>
              <div className="admin-name">{admin?.username || 'Admin'}</div>
              <div className="admin-role">CENTER ADMIN</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>⏻</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
