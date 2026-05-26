import { useState, useEffect } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Card, Table, Spinner, Empty, Btn, Badge, SearchBar, Modal } from '../components/ui'
import '../components/layout/Layout.css'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [confirm, setConfirm]   = useState(null)

  const load = async () => {
    try { setProducts(await api.get('/products')) } catch {}
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const del = async (id) => {
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      setProducts(p => p.filter(x => x.id !== id))
    } catch (e) { toast.error(e.message) }
    setConfirm(null)
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.store_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.genre_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Spinner />

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">All <span>Products</span></div>
          <div className="page-sub">{products.length} books listed</div>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
      </div>

      <Card>
        {filtered.length === 0
          ? <Empty icon="◻" title="No products found" />
          : (
            <Table>
              <thead>
                <tr><th>#ID</th><th>Image</th><th>Name</th><th>Store</th><th>Genre</th><th>Type</th><th>Price</th><th>Stock</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td className="td-mono">#{p.id}</td>
                    <td>
                      <div className="img-thumb">
                        {p.image
                          ? <img src={p.image} alt={p.name} onError={e => e.target.style.display='none'} />
                          : '📚'}
                      </div>
                    </td>
                    <td className="td-bold">{p.name}</td>
                    <td className="td-muted">{p.store_name}</td>
                    <td><Badge color="blue">{p.genre_name || '—'}</Badge></td>
                    <td><Badge color="purple">{p.book_type_name || '—'}</Badge></td>
                    <td className="td-bold">${parseFloat(p.price).toFixed(2)}</td>
                    <td>
                      <Badge color={p.quantity === 0 ? 'red' : p.quantity < 5 ? 'yellow' : 'green'}>
                        {p.quantity}
                      </Badge>
                    </td>
                    <td>
                      <Btn size="sm" danger onClick={() => setConfirm(p)}>Delete</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        }
      </Card>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete Product">
        <p className="confirm-text">Delete <strong>{confirm?.name}</strong>? This cannot be undone.</p>
        <div className="modal-actions">
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn danger onClick={() => del(confirm.id)}>Delete</Btn>
        </div>
      </Modal>
    </div>
  )
}
