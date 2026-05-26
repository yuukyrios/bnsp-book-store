import { useState, useEffect } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Card, Table, Spinner, Empty, Btn, SearchBar, Modal } from '../components/ui'
import '../components/layout/Layout.css'

export default function StoresPage() {
  const [stores, setStores]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    try { setStores(await api.get('/stores')) } catch {}
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const del = async (id) => {
    try {
      await api.delete(`/stores/${id}`)
      toast.success('Store deleted')
      setStores(p => p.filter(s => s.id !== id))
    } catch (e) { toast.error(e.message) }
    setConfirm(null)
  }

  const filtered = stores.filter(s =>
    s.store_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.merchant_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Spinner />

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">All <span>Stores</span></div>
          <div className="page-sub">{stores.length} active stores</div>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search stores..." />
      </div>

      <Card>
        {filtered.length === 0
          ? <Empty icon="□" title="No stores found" />
          : (
            <Table>
              <thead>
                <tr><th>#ID</th><th>Logo</th><th>Store Name</th><th>Merchant</th><th>Created</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td className="td-mono">#{s.id}</td>
                    <td>
                      <div className="img-thumb">
                        {s.store_logo
                          ? <img src={s.store_logo} alt={s.store_name} onError={e => e.target.style.display='none'} />
                          : '🏪'}
                      </div>
                    </td>
                    <td className="td-bold">{s.store_name}</td>
                    <td className="td-muted">{s.merchant_name || `#${s.merchant_id}`}</td>
                    <td className="td-muted">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td>
                      <Btn size="sm" danger onClick={() => setConfirm(s)}>Delete</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        }
      </Card>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete Store">
        <p className="confirm-text">Delete store <strong>{confirm?.store_name}</strong>? All products in this store will also be deleted.</p>
        <div className="modal-actions">
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn danger onClick={() => del(confirm.id)}>Delete</Btn>
        </div>
      </Modal>
    </div>
  )
}
