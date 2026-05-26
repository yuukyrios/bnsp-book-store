import { useState, useEffect } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import {
  Btn, Card, Table, Spinner, Empty,
  Field, Input, PageHeader, SearchInput
} from '../components/ui'
import { Modal, ConfirmModal } from '../components/modals/Modal'
import './pages.css'

function GenreModal({ genre, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: genre?.name ?? '',
  })
  const [loading, setLoading] = useState(false)
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const save = async () => {
    if (!form.name.trim()) {
      toast.error('Please enter a genre name')
      return
    }
    setLoading(true)
    try {
      if (genre) {
        await api.put(`/genres/${genre.id}`, form)
      } else {
        await api.post('/genres', form)
      }
      toast.success(genre ? 'Genre updated!' : 'Genre created!')
      onSaved()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={genre ? 'Edit Genre' : 'New Genre'}
      onClose={onClose}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="accent" onClick={save} disabled={loading}>{loading ? 'Saving…' : 'Save Genre'}</Btn>
        </>
      }
    >
      <Field label="Genre Name" required>
        <Input value={form.name} onChange={f('name')} placeholder="e.g. Romance, Fantasy, Sci-Fi" />
      </Field>
    </Modal>
  )
}

export default function Genres() {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch] = useState('')

  const load = async () => {
    try {
      const data = await api.get('/genres')
      setGenres(data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const del = async () => {
    try {
      await api.delete(`/genres/${confirm.id}`)
      toast.success('Genre deleted')
      load()
    } catch (e) {
      toast.error(e.message)
    }
    setConfirm(null)
  }

  const filtered = genres.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <Spinner />

  return (
    <div>
      <PageHeader>
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search genres…" />
        <Btn variant="accent" onClick={() => setModal('new')}>
          ＋ New Genre
        </Btn>
      </PageHeader>

      <Card>
        {filtered.length === 0 ? (
          <Empty icon="🏷️" title="No genres" desc={search ? 'No results match your search' : 'Create your first genre to organize books'} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id}>
                  <td className="td-bold">{g.name}</td>
                  <td>
                    <div className="row-actions">
                      <Btn variant="ghost" size="sm" onClick={() => setModal(g)}>✏️</Btn>
                      <Btn variant="danger" size="sm" onClick={() => setConfirm(g)}>🗑</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {modal && (
        <GenreModal
          genre={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null)
            load()
          }}
        />
      )}
      {confirm && (
        <ConfirmModal
          title="Delete Genre"
          message="Are you sure you want to delete"
          name={confirm.name}
          onClose={() => setConfirm(null)}
          onConfirm={del}
        />
      )}
    </div>
  )
}