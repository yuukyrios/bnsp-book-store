import { useState, useEffect, useRef } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Btn, Spinner, Empty, Field, Input, PageHeader } from '../components/ui'
import { Modal, ConfirmModal, UploadZone } from '../components/modals/Modal'
import './pages.css'

function StoreModal({ store, onClose, onSaved }) {
  const [name, setName] = useState(store?.store_name || '')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(store?.store_logo || null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const pickFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const save = async () => {
    if (!name.trim()) { toast.error('Store name is required'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('store_name', name)
      if (file) fd.append('store_logo', file)
      if (store) {
        await api.put(`/stores/${store.id}`, fd)
      } else {
        await api.post('/stores', fd)
      }
      toast.success(store ? 'Store updated!' : 'Store created!')
      onSaved()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={store ? 'Edit Store' : 'New Store'}
      onClose={onClose}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="accent" onClick={save} disabled={loading}>{loading ? 'Saving…' : 'Save Store'}</Btn>
        </>
      }
    >
      <Field label="Store Name" required>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Store" />
      </Field>
      <Field label="Store Logo">
        <UploadZone preview={preview} onClick={() => fileRef.current.click()} label="Click to upload logo" hint="PNG, JPG — max 2MB" />
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={pickFile} />
      </Field>
    </Modal>
  )
}

export default function Stores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)   // null | 'new' | store obj
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    try { setStores(await api.get('/stores')) } catch {}
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const del = async () => {
    try {
      await api.delete(`/stores/${confirm.id}`)
      toast.success('Store deleted')
      load()
    } catch (e) { toast.error(e.message) }
    setConfirm(null)
  }

  if (loading) return <Spinner />

  return (
    <div>
      <PageHeader>
        <span />
        <Btn variant="accent" onClick={() => setModal('new')}>＋ New Store</Btn>
      </PageHeader>

      {stores.length === 0
        ? <Empty icon="🏪" title="No stores yet" desc="Create your first store to start selling products" />
        : (
          <div className="store-grid">
            {stores.map((s) => (
              <div className="store-card" key={s.id}>
                <div className="store-card-img">
                  {s.store_logo
                    ? <img src={s.store_logo} alt={s.store_name} onError={(e) => { e.target.style.display = 'none' }} />
                    : '🏪'}
                </div>
                <div className="store-card-body">
                  <div className="store-card-name">{s.store_name}</div>
                  <div className="store-card-meta">Store ID: #{s.id}</div>
                  <div className="store-card-actions">
                    <Btn variant="ghost" size="sm" onClick={() => setModal(s)}>✏️ Edit</Btn>
                    <Btn variant="danger" size="sm" onClick={() => setConfirm(s)}>🗑 Delete</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {modal && (
        <StoreModal
          store={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
      {confirm && (
        <ConfirmModal
          title="Delete Store"
          message="Are you sure you want to delete"
          name={confirm.store_name}
          onClose={() => setConfirm(null)}
          onConfirm={del}
        />
      )}
    </div>
  )
}
