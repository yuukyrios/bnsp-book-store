import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import Spinner from '../components/ui/Spinner'
import './Orders.css'

const STATUS_MAP = {
  processed:    { label: 'Processing', color: 'orange', icon: '⏳', step: 0 },
  'on the way': { label: 'On the Way', color: 'blue',   icon: '🚚', step: 1 },
  arrived:      { label: 'Delivered',  color: 'green',  icon: '✓',  step: 2 },
}

function StatusTracker({ status }) {
  const steps  = ['processed', 'on the way', 'arrived']
  const labels = ['Processing', 'Shipped', 'Delivered']
  const icons  = ['📦', '🚚', '🏠']
  const current = STATUS_MAP[status]?.step ?? 0

  return (
    <div className="status-tracker">
      {steps.map((s, i) => (
        <div key={s} className={`st-step ${i <= current ? 'st-step--done' : ''} ${i === current ? 'st-step--active' : ''}`}>
          <div className="st-dot">{i <= current ? icons[i] : ''}</div>
          <div className="st-label">{labels[i]}</div>
          {i < steps.length - 1 && <div className={`st-line ${i < current ? 'st-line--done' : ''}`}/>}
        </div>
      ))}
    </div>
  )
}

export default function Orders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    api.get('/orders/mine').then(setOrders).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const statuses = ['all', 'processed', 'on the way', 'arrived']
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (loading) return <Spinner />

  return (
    <div className="orders-page">
      <div className="orders-inner">
        <h1 className="orders-title">My Orders</h1>

        <div className="orders-filters">
          {statuses.map(s => {
            const cnt = s === 'all' ? orders.length : orders.filter(o => o.status === s).length
            return (
              <button
                key={s}
                className={`of-btn ${filter === s ? 'of-btn--active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s === 'all' ? 'All' : STATUS_MAP[s]?.label || s}
                <span className="of-count">{cnt}</span>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>{filter === 'all' ? 'No orders yet' : `No ${STATUS_MAP[filter]?.label || filter} orders`}</h3>
            <p>{filter === 'all' ? 'Your order history will appear here.' : 'Try another filter.'}</p>
            {filter === 'all' && <Link to="/" className="orders-shop-btn">Start Shopping</Link>}
          </div>
        ) : (
          <div className="orders-list">
            {filtered.map(o => {
              const st = STATUS_MAP[o.status] || STATUS_MAP.processed
              return (
                <div key={o.id} className="order-card">
                  <div className="oc-header">
                    <div>
                      <span className="oc-id">Order #{o.id}</span>
                      <span className="oc-date">
                        {new Date(o.ordered_at).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <span className={`oc-badge oc-badge--${st.color}`}>{st.icon} {st.label}</span>
                  </div>

                  <div className="oc-product">
                    <div className="oc-img">
                      {o.product_image
                        ? <img src={o.product_image} alt={o.product_name} onError={e => e.target.style.display='none'} />
                        : <span>📦</span>}
                    </div>
                    <div className="oc-info">
                      <div className="oc-name">{o.product_name}</div>
                      <div className="oc-store">{o.store_name}</div>
                      <div className="oc-meta">
                        Qty: {o.quantity} · Total: <strong>${parseFloat(o.total_price).toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>

                  {o.message && (
                    <div className="oc-message">
                      <span className="oc-message-label">📝 Your note to seller</span>
                      <p className="oc-message-text">{o.message}</p>
                    </div>
                  )}

                  <StatusTracker status={o.status} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}