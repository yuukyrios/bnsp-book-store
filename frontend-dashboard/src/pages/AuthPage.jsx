import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../hooks/useAuthStore'
import toast from 'react-hot-toast'
import './AuthPage.css'

export default function AuthPage() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (tab === 'register' && !form.username) { setError('Username is required.'); return }
    setLoading(true)
    try {
      const ep = tab === 'login' ? '/api/auth/merchant/login' : '/api/auth/merchant/register'
      const body = tab === 'login'
        ? { email: form.email, password: form.password }
        : { username: form.username, email: form.email, password: form.password }

      const res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message); return }
      login(data.data.merchant, data.data.token)
      toast.success(tab === 'login' ? 'Welcome back! 👋' : 'Account created! 🎉')
      navigate('/')
    } catch {
      setError('Could not connect to server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') submit() }

  return (
    <div className="auth-root">
      <div className="auth-bg">
        <div className="auth-blob auth-blob--1" />
        <div className="auth-blob auth-blob--2" />
        <div className="auth-grid" />
      </div>

      <div className="auth-box">
        <div className="auth-brand">
          <span className="auth-brand-name">Akasha<span>Hub</span></span>
          <p className="auth-brand-sub">AkashaControl Center</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'auth-tab--active' : ''}`} onClick={() => { setTab('login'); setError('') }}>
            Sign In
          </button>
          <button className={`auth-tab ${tab === 'register' ? 'auth-tab--active' : ''}`} onClick={() => { setTab('register'); setError('') }}>
            Register
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
          {tab === 'register' && (
            <div className="auth-field">
              <label>Username</label>
              <input value={form.username} onChange={f('username')} onKeyDown={handleKey} placeholder="yourname" autoComplete="username" />
            </div>
          )}
          <div className="auth-field">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={f('email')} onKeyDown={handleKey} placeholder="you@store.com" autoComplete="email" />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={f('password')} onKeyDown={handleKey} placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button className="auth-submit" onClick={submit} disabled={loading}>
            {loading ? <span className="auth-spinner" /> : null}
            {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
