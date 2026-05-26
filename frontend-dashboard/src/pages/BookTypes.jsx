import { useState, useEffect } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import {
  Btn, Card, Table, Spinner, Empty,
  Field, Input, PageHeader, SearchInput
} from '../components/ui'
import { Modal, ConfirmModal } from '../components/modals/Modal'
import './pages.css'
 
function BookTypeModal({ bookType, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: bookType?.name ?? '',
  })
  const [loading, setLoading] = useState(false)
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
 
  const save = async () => {
    if (!form.name.trim()) {
      toast.error('Please enter a book type name')
      return
    }
    setLoading(true)
    try {
      if (bookType) {
        await api.put(`/book-types/${bookType.id}`, form)
      } else {
        await api.post('/book-types', form)
      }
      toast.success(bookType ? 'Book type updated!' : 'Book type created!')
      onSaved()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <Modal
      title={bookType ? 'Edit Book Type' : 'New Book Type'}
      onClose={onClose}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="accent" onClick={save} disabled={loading}>{loading ? 'Saving…' : 'Save Book Type'}</Btn>
        </>
      }
    >
      <Field label="Book Type Name" required>
        <Input value={form.name} onChange={f('name')} placeholder="e.g. Novel, Comic, Manga, Short Story" />
      </Field>
    </Modal>
  )
}
 
export default function BookTypes() {
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch] = useState('')
 
  const load = async () => {
    try {
      const data = await api.get('/book-types')
      setTypes(data)
    } catch {}
    setLoading(false)
  }
 
  useEffect(() => {
    load()
  }, [])
 
  const del = async () => {
    try {
      await api.delete(`/book-types/${confirm.id}`)
      toast.success('Book type deleted')
      load()
    } catch (e) {
      toast.error(e.message)
    }
    setConfirm(null)
  }
 
  const filtered = types.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
 
  if (loading) return <Spinner />
 
  return (
    <div>
      <PageHeader>
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search book types…" />
        <Btn variant="accent" onClick={() => setModal('new')}>
          ＋ New Type
        </Btn>
      </PageHeader>
 
      <Card>
        {filtered.length === 0 ? (
          <Empty icon="📚" title="No book types" desc={search ? 'No results match your search' : 'Create your first book type (Novel, Comic, etc.)'} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="td-bold">{t.name}</td>
                  <td>
                    <div className="row-actions">
                      <Btn variant="ghost" size="sm" onClick={() => setModal(t)}>✏️</Btn>
                      <Btn variant="danger" size="sm" onClick={() => setConfirm(t)}>🗑</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
 
      {modal && (
        <BookTypeModal
          bookType={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null)
            load()
          }}
        />
      )}
      {confirm && (
        <ConfirmModal
          title="Delete Book Type"
          message="Are you sure you want to delete"
          name={confirm.name}
          onClose={() => setConfirm(null)}
          onConfirm={del}
        />
      )}
    </div>
  )
}
 