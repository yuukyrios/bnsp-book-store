import { useState, useEffect } from 'react'
import api from '../lib/api'
import { StatCard, Card, CardHeader, Table, Badge, Spinner, Empty } from '../components/ui'
import './pages.css'

function statusBadge(s) {
  if (s === 'processed') return <Badge color="yellow">Processed</Badge>
  if (s === 'on the way') return <Badge color="purple">On the Way</Badge>
  return <Badge color="green">Arrived</Badge>
}

export default function Overview() {
  const [data, setData] = useState({ stores: 0, products: 0, orders: 0, revenue: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const [stores, orders] = await Promise.all([
          api.get('/stores'),
          api.get('/orders/merchant/all'),
        ])
        let productCount = 0
        for (const s of stores) {
          const p = await api.get(`/products?store_id=${s.id}`)
          productCount += p.length
        }
        const revenue = orders.reduce((a, o) => a + parseFloat(o.total_price || 0), 0)
        setData({ stores: stores.length, products: productCount, orders: orders.length, revenue })
        setRecent(orders.slice(0, 8))
      } catch {}
      setLoading(false)
    })()
  }, [])

  if (loading) return <Spinner />

  return (
    <div>
      <div className="stats-grid">
        <StatCard label="Total Stores" value={data.stores} sub="Active storefronts" accent="var(--accent)" />
        <StatCard label="Products" value={data.products} sub="Across all stores" accent="var(--accent2)" />
        <StatCard label="Total Orders" value={data.orders} sub="All time" accent="var(--success)" />
        <StatCard
          label="Revenue"
          value={`$${data.revenue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub="All time earnings"
          accent="var(--warning)"
        />
      </div>

      <Card>
        <CardHeader>Recent Orders</CardHeader>
        {recent.length === 0
          ? <Empty icon="🛒" title="No orders yet" desc="Orders will show up here once customers start buying" />
          : (
            <Table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Store</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
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
