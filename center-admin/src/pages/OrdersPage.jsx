import { useState, useEffect } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Card, Table, Spinner, Empty, Btn, Badge, SearchBar, Modal } from '../components/ui'
import '../components/layout/Layout.css'

const STATUSES = ['all', 'processed', 'on the way', 'arrived']

function statusBadge(s) {
  if (s === 'processed') return <Badge color="yellow">Processed</Badge>
  if (s === 'on the way') return <Badge color="purple">On the Way</Badge>
  return <Badge color="green">Arrived</Badge>
}

export default function OrdersPage() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    try { setOrders(await api.get('/orders/merchant/all')) } catch {}
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const del = async (id) => {
    try {
      await api.delete(`/orders/${id}`)
      toast.success('Order deleted')
      setOrders(p => p.filter(o => o.id !== id))
    } catch (e) { toast.error(e.message) }
    setConfirm(null)
  }

  const filtered = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o =>
      o.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer?.toLowerCase().includes(search.toLowerCase()) ||
      o.store_name?.toLowerCase().includes(search.toLowerCase())
    )

  const count = s => s === 'all' ? orders.length : orders.filter(o => o.status === s).length

  if (loading) return <Spinner />

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">All <span>Orders</span></div>
          <div className="page-sub">{orders.length} total orders across all stores</div>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search orders..." />
        <div className="toolbar-right">
          {STATUSES.map(s => (
            <Btn key={s} size="sm" variant={filter === s ? 'accent' : 'ghost'} onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : s} ({count(s)})
            </Btn>
          ))}
        </div>
      </div>

      <Card>
        {filtered.length === 0
          ? <Empty icon="◁" title="No orders found" />
          : (
            <Table>
              <thead>
                <tr><th>#ID</th><th>Image</th><th>Product</th><th>Buyer</th><th>Store</th><th>Qty</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(o => (
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
                    <td>{statusBadge(o.status)}</td>
                    <td className="td-muted">{new Date(o.ordered_at).toLocaleDateString()}</td>
                    <td>
                      <Btn size="sm" danger onClick={() => setConfirm(o)}>Delete</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        }
      </Card>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete Order">
        <p className="confirm-text">Delete order <strong>#{confirm?.id}</strong> for <strong>{confirm?.product_name}</strong>? This cannot be undone.</p>
        <div className="modal-actions">
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn danger onClick={() => del(confirm.id)}>Delete</Btn>
        </div>
      </Modal>
    </div>
  )
}
