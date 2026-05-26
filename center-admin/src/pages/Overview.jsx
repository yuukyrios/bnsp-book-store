import { useState, useEffect } from 'react'
import api from '../lib/api'
import { StatCard, Card, Table, Badge, Spinner } from '../components/ui'
import '../../src/components/layout/Layout.css'

function statusBadge(s) {
  if (s === 'processed') return <Badge color="yellow">Processed</Badge>
  if (s === 'on the way') return <Badge color="purple">On the Way</Badge>
  return <Badge color="green">Arrived</Badge>
}

export default function Overview() {
  const [stats, setStats]   = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/users').catch(() => []),
      api.get('/merchants').catch(() => []),
      api.get('/stores').catch(() => []),
      api.get('/products').catch(() => []),
      api.get('/orders/merchant/all').catch(() => []),
    ]).then(([users, merchants, stores, products, orders]) => {
      setStats({
        users: Array.isArray(users) ? users.length : 0,
        merchants: Array.isArray(merchants) ? merchants.length : 0,
        stores: Array.isArray(stores) ? stores.length : 0,
        products: Array.isArray(products) ? products.length : 0,
        orders: Array.isArray(orders) ? orders.length : 0,
        revenue: Array.isArray(orders) ? orders.reduce((s, o) => s + parseFloat(o.total_price || 0), 0) : 0,
      })
      setOrders(Array.isArray(orders) ? orders.slice(0, 8) : [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">System <span>Overview</span></div>
          <div className="page-sub">All platform data at a glance</div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Users"     value={stats.users}     icon="○" color="accent" />
        <StatCard label="Merchants"       value={stats.merchants} icon="◇" color="blue" />
        <StatCard label="Stores"          value={stats.stores}    icon="□" color="warn" />
        <StatCard label="Products"        value={stats.products}  icon="◻" color="purple" />
        <StatCard label="Orders"          value={stats.orders}    icon="◁" color="red" />
        <StatCard label="Total Revenue"   value={`$${stats.revenue.toFixed(2)}`} icon="◈" color="accent" />
      </div>

      <div className="page-title" style={{ fontSize: 14, marginBottom: 14, color: 'var(--muted)', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>RECENT ORDERS</div>
      <Card>
        {orders.length === 0
          ? <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>No orders yet</div>
          : (
            <Table>
              <thead>
                <tr>
                  <th>#</th><th>Product</th><th>Buyer</th><th>Store</th><th>Total</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td className="td-mono">#{o.id}</td>
                    <td className="td-bold">{o.product_name}</td>
                    <td className="td-muted">{o.buyer}</td>
                    <td className="td-muted">{o.store_name}</td>
                    <td className="td-bold">${parseFloat(o.total_price).toFixed(2)}</td>
                    <td>{statusBadge(o.status)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        }
      </Card>
    </div>
  )
}
