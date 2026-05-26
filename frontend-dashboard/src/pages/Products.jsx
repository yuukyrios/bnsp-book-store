import { useState, useEffect, useRef } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import {
  Btn, Card, Table, Badge, Spinner, Empty,
  Field, Input, Textarea, Select, PageHeader, SearchInput
} from '../components/ui'
import { Modal, ConfirmModal, FormRow, UploadZone } from '../components/modals/Modal'
import './pages.css'

function ProductModal({ product, stores, genres, types, onClose, onSaved }) {
  const [form, setForm] = useState({
    store_id: product?.store_id ?? (stores[0]?.id ?? ''),
    genre_id: product?.genre_id ?? '',
    type_id: product?.type_id ?? '',
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? '',
    quantity: product?.quantity ?? '',
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(product?.image || null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const save = async () => {
    if (!form.name.trim() || !form.price || form.quantity === '' || !form.store_id || !form.genre_id || !form.type_id) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '') fd.append(k, v)
      })
      if (file) fd.append('image', file)
      if (product) {
        await api.put(`/products/${product.id}`, fd)
      } else {
        await api.post('/products', fd)
      }
      toast.success(product ? 'Book updated!' : 'Book created!')
      onSaved()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={product ? 'Edit Book' : 'New Book'}
      onClose={onClose}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="accent" onClick={save} disabled={loading}>{loading ? 'Saving…' : 'Save Book'}</Btn>
        </>
      }
    >
      <Field label="Store" required>
        <Select value={form.store_id} onChange={f('store_id')}>
          {stores.map((s) => <option key={s.id} value={s.id}>{s.store_name}</option>)}
        </Select>
      </Field>

      <Field label="Book Name" required>
        <Input value={form.name} onChange={f('name')} placeholder="e.g. The Great Gatsby" />
      </Field>

      <FormRow>
        <Field label="Price (USD)" required>
          <Input type="number" value={form.price} onChange={f('price')} placeholder="0.00" min="0" step="0.01" />
        </Field>
        <Field label="Stock Quantity" required>
          <Input type="number" value={form.quantity} onChange={f('quantity')} placeholder="0" min="0" />
        </Field>
      </FormRow>

      <FormRow>
        <Field label="Genre" required>
          <Select value={form.genre_id} onChange={f('genre_id')}>
            <option value="">— Select Genre —</option>
            {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </Select>
        </Field>
        <Field label="Book Type" required>
          <Select value={form.type_id} onChange={f('type_id')}>
            <option value="">— Select Type —</option>
            {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
        </Field>
      </FormRow>

      <Field label="Description">
        <Textarea value={form.description} onChange={f('description')} placeholder="Describe the book…" />
      </Field>

      <Field label="Book Image">
        <UploadZone preview={preview} onClick={() => fileRef.current.click()} label="Click to upload book cover" hint="PNG, JPG, WEBP — max 5MB" />
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => { const f2 = e.target.files[0]; if (f2) { setFile(f2); setPreview(URL.createObjectURL(f2)) } }} />
      </Field>
    </Modal>
  )
}

function stockBadge(qty) {
  if (qty === 0) return <Badge color="red">Out of stock</Badge>
  if (qty < 10) return <Badge color="orange">{qty}</Badge>
  return <Badge color="green">{qty}</Badge>
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [genres, setGenres] = useState([])
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch] = useState('')

  const load = async () => {
    try {
      const [storeList, genreList, typeList] = await Promise.all([
        api.get('/stores'),
        api.get('/genres'),
        api.get('/book-types'),
      ])
      setStores(storeList)
      setGenres(genreList)
      setTypes(typeList)
      let all = []
      for (const s of storeList) {
        const p = await api.get(`/products?store_id=${s.id}`)
        all = [...all, ...p]
      }
      setProducts(all)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const del = async () => {
    try {
      await api.delete(`/products/${confirm.id}`)
      toast.success('Book deleted')
      load()
    } catch (e) {
      toast.error(e.message)
    }
    setConfirm(null)
  }

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <Spinner />

  return (
    <div>
      <PageHeader>
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books…" />
        <Btn variant="accent" onClick={() => setModal('new')} disabled={stores.length === 0}>
          ＋ New Book
        </Btn>
      </PageHeader>

      {stores.length === 0 && (
        <div style={{ background: 'rgba(255,183,77,0.1)', border: '1px solid rgba(255,183,77,0.25)', color: 'var(--warning)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 16 }}>
          ⚠️ You need to create a store before adding books.
        </div>
      )}

      {genres.length === 0 && (
        <div style={{ background: 'rgba(255,183,77,0.1)', border: '1px solid rgba(255,183,77,0.25)', color: 'var(--warning)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 16 }}>
          ⚠️ You need to create genres and book types before adding books.
        </div>
      )}

      <Card>
        {filtered.length === 0 ? (
          <Empty icon="📚" title="No books" desc={search ? 'No results match your search' : 'Add your first book to start selling'} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Store</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Genre</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="img-thumb">
                      {p.image ? (
                        <img src={p.image} alt={p.name} onError={(e) => e.target.style.display = 'none'} />
                      ) : (
                        '📖'
                      )}
                    </div>
                  </td>
                  <td className="td-bold">{p.name}</td>
                  <td className="td-muted">{p.store_name}</td>
                  <td className="td-bold">${parseFloat(p.price).toFixed(2)}</td>
                  <td>{stockBadge(p.quantity)}</td>
                  <td className="td-muted">{p.genre_name || '—'}</td>
                  <td className="td-muted">{p.type_name || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <Btn variant="ghost" size="sm" onClick={() => setModal(p)}>
                        ✏️
                      </Btn>
                      <Btn variant="danger" size="sm" onClick={() => setConfirm(p)}>
                        🗑
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal}
          stores={stores}
          genres={genres}
          types={types}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null)
            load()
          }}
        />
      )}
      {confirm && (
        <ConfirmModal
          title="Delete Book"
          message="Are you sure you want to delete"
          name={confirm.name}
          onClose={() => setConfirm(null)}
          onConfirm={del}
        />
      )}
    </div>
  )
}