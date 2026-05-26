import { useState, useEffect } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Card, Spinner, Btn, Modal, Input } from '../components/ui'
import '../components/layout/Layout.css'
import './TaxonomyPage.css'

function TagManager({ title, icon, endpoint }) {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName]       = useState('')
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    try { setItems(await api.get(endpoint)) } catch {}
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openAdd  = () => { setEditing(null); setName(''); setModal(true) }
  const openEdit = (item) => { setEditing(item); setName(item.name); setModal(true) }

  const save = async () => {
    if (!name.trim()) return
    try {
      if (editing) {
        await api.put(`${endpoint}/${editing.id}`, { name })
        setItems(p => p.map(i => i.id === editing.id ? { ...i, name } : i))
        toast.success('Updated')
      } else {
        const created = await api.post(endpoint, { name })
        setItems(p => [...p, created])
        toast.success('Added')
      }
      setModal(false)
    } catch (e) { toast.error(e.message) }
  }

  const del = async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`)
      setItems(p => p.filter(i => i.id !== id))
      toast.success('Deleted')
    } catch (e) { toast.error(e.message) }
    setConfirm(null)
  }

  return (
    <div className="tag-section">
      <div className="tag-header">
        <div>
          <div className="tag-title">{icon} {title}</div>
          <div className="tag-count">{items.length} entries</div>
        </div>
        <Btn size="sm" variant="accent" onClick={openAdd}>+ Add</Btn>
      </div>

      <Card>
        {loading
          ? <Spinner />
          : items.length === 0
            ? <div className="tag-empty">No {title.toLowerCase()} yet</div>
            : (
              <div className="tag-list">
                {items.map(item => (
                  <div key={item.id} className="tag-row">
                    <span className="tag-id td-mono">#{item.id}</span>
                    <span className="tag-name">{item.name}</span>
                    <div className="tag-actions">
                      <Btn size="sm" variant="ghost" onClick={() => openEdit(item)}>Edit</Btn>
                      <Btn size="sm" danger onClick={() => setConfirm(item)}>Delete</Btn>
                    </div>
                  </div>
                ))}
              </div>
            )
        }
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? `Edit ${title}` : `Add ${title}`}>
        <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder={`Enter ${title.toLowerCase()} name`} />
        <div className="modal-actions">
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn variant="accent" onClick={save}>Save</Btn>
        </div>
      </Modal>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={`Delete ${title}`}>
        <p className="confirm-text">Delete <strong>{confirm?.name}</strong>? Products using this tag will lose the reference.</p>
        <div className="modal-actions">
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn danger onClick={() => del(confirm.id)}>Delete</Btn>
        </div>
      </Modal>
    </div>
  )
}

export default function TaxonomyPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Genres & <span>Book Types</span></div>
          <div className="page-sub">Manage product classification tags</div>
        </div>
      </div>
      <div className="taxonomy-grid">
        <TagManager title="Genres"     icon="◈" endpoint="/genres" />
        <TagManager title="Book Types" icon="◻" endpoint="/book-types" />
      </div>
    </div>
  )
}
