import { useState, useEffect } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Card, Table, Spinner, Empty, Btn, SearchBar, Modal } from '../components/ui'
import '../components/layout/Layout.css'

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [confirm, setConfirm]     = useState(null)

  const load = async () => {
    try { setMerchants(await api.get('/merchants')) } catch {}
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const del = async (id) => {
    try {
      await api.delete(`/merchants/${id}`)
      toast.success('Merchant deleted')
      setMerchants(p => p.filter(m => m.id !== id))
    } catch (e) { toast.error(e.message) }
    setConfirm(null)
  }

  const filtered = merchants.filter(m =>
    m.username?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Spinner />

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">All <span>Merchants</span></div>
          <div className="page-sub">{merchants.length} registered merchants</div>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search merchants..." />
      </div>

      <Card>
        {filtered.length === 0
          ? <Empty icon="◇" title="No merchants found" />
          : (
            <Table>
              <thead>
                <tr><th>#ID</th><th>Username</th><th>Email</th><th>Joined</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id}>
                    <td className="td-mono">#{m.id}</td>
                    <td className="td-bold">{m.username}</td>
                    <td className="td-muted">{m.email}</td>
                    <td className="td-muted">{new Date(m.created_at).toLocaleDateString()}</td>
                    <td>
                      <Btn size="sm" danger onClick={() => setConfirm(m)}>Delete</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        }
      </Card>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete Merchant">
        <p className="confirm-text">Delete merchant <strong>{confirm?.username}</strong>? All their stores and products will also be deleted.</p>
        <div className="modal-actions">
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn danger onClick={() => del(confirm.id)}>Delete</Btn>
        </div>
      </Modal>
    </div>
  )
}
