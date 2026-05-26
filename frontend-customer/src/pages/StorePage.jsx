import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import ProductCard from '../components/ui/ProductCard'
import Spinner from '../components/ui/Spinner'
import './StorePage.css'

export default function StorePage() {
  const { id } = useParams()

  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])

  const [genres, setGenres] = useState([])
  const [bookTypes, setBookTypes] = useState([])

  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    sort: 'newest',
    genre: '',
    book_type: '',
  })

  useEffect(() => {
    ;(async () => {
      try {
        const [s, p, gens, btypes] = await Promise.all([
          api.get(`/stores/${id}`),
          api.get(`/products?store_id=${id}`),
          api.get('/genres'),       // fixed: was '/api/genres'
          api.get('/book-types'),   // fixed: was '/api/book-types'
        ])

        setStore(s)
        setProducts(p)
        setGenres(gens)
        setBookTypes(btypes)
      } catch (err) {
        console.error(err)
      }

      setLoading(false)
    })()
  }, [id])

  useEffect(() => {
    let list = [...products]

    if (filters.genre) {
      list = list.filter(
        p => String(p.genre_id) === filters.genre
      )
    }

    if (filters.book_type) {
      list = list.filter(
        p => String(p.book_type_id) === filters.book_type
      )
    }

    if (filters.sort === 'newest') {
      list.sort((a, b) => b.id - a.id)
    }

    if (filters.sort === 'oldest') {
      list.sort((a, b) => a.id - b.id)
    }

    if (filters.sort === 'price-asc') {
      list.sort(
        (a, b) => parseFloat(a.price) - parseFloat(b.price)
      )
    }

    if (filters.sort === 'price-desc') {
      list.sort(
        (a, b) => parseFloat(b.price) - parseFloat(a.price)
      )
    }

    setFiltered(list)
  }, [products, filters])

  const sf = (k, v) =>
    setFilters(prev => ({
      ...prev,
      [k]: v,
    }))

  if (loading) return <Spinner />

  if (!store) {
    return (
      <div className="store-notfound">
        <h2>Store not found.</h2>
        <Link to="/">← Home</Link>
      </div>
    )
  }

  return (
    <div className="store-page">
      {/* Store Header */}
      <div className="store-hero">
        <div className="store-hero-inner">
          <div className="store-logo-wrap">
            {store.store_logo ? (
              <img
                src={store.store_logo}
                alt={store.store_name}
                className="store-logo-img"
                onError={e => (e.target.style.display = 'none')}
              />
            ) : (
              <div className="store-logo-fallback">🏪</div>
            )}
          </div>

          <div>
            <h1 className="store-name">
              {store.store_name}
            </h1>

            <p className="store-meta">
              {filtered.length} product
              {filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="store-body">
        {/* Filters */}
        <div className="store-filters">
          {/* Sort */}
          <select
            value={filters.sort}
            onChange={e => sf('sort', e.target.value)}
            className="sf-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>

          {/* Genre */}
          <select
            value={filters.genre}
            onChange={e => sf('genre', e.target.value)}
            className="sf-select"
          >
            <option value="">All Genres</option>
            {genres.map(g => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Book Type */}
          <select
            value={filters.book_type}
            onChange={e => sf('book_type', e.target.value)}
            className="sf-select"
          >
            <option value="">All Types</option>
            {bookTypes.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {(filters.genre ||
            filters.book_type ||
            filters.sort !== 'newest') && (
            <button
              className="sf-clear"
              onClick={() =>
                setFilters({
                  sort: 'newest',
                  genre: '',
                  book_type: '',
                })
              }
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}