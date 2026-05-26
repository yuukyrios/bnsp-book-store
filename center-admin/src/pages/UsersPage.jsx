import { useState, useEffect } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Card, Table, Spinner, Empty, Btn, Badge, SearchBar, Modal } from '../components/ui'
import '../components/layout/Layout.css'

export default function UsersPage() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    try { setUsers(await api.get('/users')) } catch {}
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const del = async (id) => {
    try {
      await api.delete(`/users/${id}`)
      toast.success('User deleted')
      setUsers(p => p.filter(u => u.id !== id))
    } catch (e) { toast.error(e.message) }
    setConfirm(null)
  }

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Spinner />

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">All <span>Users</span></div>
          <div className="page-sub">{users.length} registered users</div>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
      </div>

      <Card>
        {filtered.length === 0
          ? <Empty icon="○" title="No users found" />
          : (
            <Table>
              <thead>
                <tr><th>#ID</th><th>Username</th><th>Email</th><th>Joined</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td className="td-mono">#{u.id}</td>
                    <td className="td-bold">{u.username}</td>
                    <td className="td-muted">{u.email}</td>
                    <td className="td-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <Btn size="sm" danger onClick={() => setConfirm(u)}>Delete</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        }
      </Card>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete User">
        <p className="confirm-text">Delete user <strong>{confirm?.username}</strong>? This cannot be undone.</p>
        <div className="modal-actions">
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn danger onClick={() => del(confirm.id)}>Delete</Btn>
        </div>
      </Modal>
    </div>
  )
}
