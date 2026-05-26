import { useState, useEffect } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Card, Table, Badge, Spinner, Empty, Btn } from '../components/ui'
import './pages.css'

const STATUSES = ['all', 'processed', 'on the way', 'arrived']

function statusBadge(s) {
  if (s === 'processed') return <Badge color="yellow">Processed</Badge>
  if (s === 'on the way') return <Badge color="purple">On the Way</Badge>
  return <Badge color="green">Arrived</Badge>
}

export default function Orders() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [updating, setUpdating] = useState(null)

  const load = async () => {
    try { setOrders(await api.get('/orders/merchant/all')) } catch {}
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      await api.patch(`/orders/${id}/status`, { status })
      toast.success('Order status updated')
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const count = (s) => s === 'all' ? orders.length : orders.filter((o) => o.status === s).length

  if (loading) return <Spinner />

  return (
    <div>
      <div className="filter-bar">
        {STATUSES.map((s) => (
          <Btn
            key={s}
            variant={filter === s ? 'accent' : 'ghost'}
            size="sm"
            onClick={() => setFilter(s)}
            style={{ textTransform: 'capitalize' }}
          >
            {s === 'all' ? 'All' : s} <span style={{ opacity: 0.7, marginLeft: 2 }}>({count(s)})</span>
          </Btn>
        ))}
      </div>

      <Card>
        {filtered.length === 0
          ? <Empty icon="🛒" title="No orders found" desc={filter !== 'all' ? `No orders with status "${filter}"` : 'Orders will appear here once customers place them'} />
          : (
            <Table>
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Store</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td className="td-mono">#{o.id}</td>
                    <td>
                      <div className="img-thumb">
                        {o.product_image
                          ? <img src={o.product_image} alt={o.product_name} onError={e => e.target.style.display='none'} />
                          : '📦'}
                      </div>
                    </td>
                    <td className="td-bold">{o.product_name}</td>
                    <td className="td-muted">{o.buyer}</td>
                    <td className="td-muted">{o.store_name}</td>
                    <td>{o.quantity}</td>
                    <td className="td-bold">${parseFloat(o.total_price).toFixed(2)}</td>
                    <td className="td-muted" style={{ maxWidth: 180, fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {o.message || <span style={{ opacity: 0.3 }}>—</span>}
                    </td>
                    <td>{statusBadge(o.status)}</td>
                    <td>
                      {o.status !== 'arrived' ? (
                        <select
                          className="order-status-select"
                          value={o.status}
                          disabled={updating === o.id}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                        >
                          <option value="processed">Processed</option>
                          <option value="on the way">On the Way</option>
                          <option value="arrived">Arrived</option>
                        </select>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Completed</span>
                      )}
                    </td>
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