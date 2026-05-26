import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import './AuthPage.css'

export default function AuthPage() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (tab === 'register' && !form.username) { setError('Username is required.'); return }
    setLoading(true)
    try {
      const ep = tab === 'login' ? '/api/auth/user/login' : '/api/auth/user/register'
      const body = tab === 'login' ? { email: form.email, password: form.password } : form
      const res = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!data.success) { setError(data.message); return }
      login(data.data.user, data.data.token)
      toast.success(tab === 'login' ? 'Welcome back! 👋' : 'Account created! 🎉')
      navigate('/')
    } catch { setError('Cannot connect to server.') }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">✦ Bazaar</div>
        <p className="auth-sub">{tab === 'login' ? 'Sign in to continue shopping' : 'Create your account'}</p>
        <div className="auth-tabs">
          <button className={tab==='login'?'active':''} onClick={() => { setTab('login'); setError('') }}>Sign In</button>
          <button className={tab==='register'?'active':''} onClick={() => { setTab('register'); setError('') }}>Register</button>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-fields">
          {tab === 'register' && (
            <div className="auth-field">
              <label>Username</label>
              <input value={form.username} onChange={f('username')} placeholder="yourname" onKeyDown={e => e.key==='Enter'&&submit()} />
            </div>
          )}
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={f('email')} placeholder="you@email.com" onKeyDown={e => e.key==='Enter'&&submit()} />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={f('password')} placeholder="••••••••" onKeyDown={e => e.key==='Enter'&&submit()} />
          </div>
          <button className="auth-submit" onClick={submit} disabled={loading}>
            {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
