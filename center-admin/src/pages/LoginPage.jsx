import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../hooks/useAuthStore'
import toast from 'react-hot-toast'
import './LoginPage.css'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const { login } = useAuthStore()
  const nav = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Access granted')
      nav('/')
    } catch (err) {
      toast.error(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-bg">
        {[...Array(12)].map((_, i) => <div key={i} className="grid-line" style={{ '--i': i }} />)}
      </div>

      <div className="login-card">
        <div className="login-logo">
          <span className="login-mark">⬡</span>
          <div>
            <div className="login-name">AKASHA</div>
            <div className="login-sub">CONTROL CENTER</div>
          </div>
        </div>

        <div className="login-divider" />

        <p className="login-hint">Sign in with a merchant account to access the control panel.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@akasha.com"
              required
            />
          </div>
          <div className="login-field">
            <label>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'AUTHENTICATING...' : 'ENTER CONTROL CENTER →'}
          </button>
        </form>
      </div>
    </div>
  )
}
