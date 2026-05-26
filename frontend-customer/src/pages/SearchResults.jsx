import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../lib/api'
import ProductCard from '../components/ui/ProductCard'
import Spinner from '../components/ui/Spinner'
import './SearchResults.css'

const PAGE_SIZE = 10

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!q.trim()) { setLoading(false); return }
    setLoading(true)
    setPage(1)
    ;(async () => {
      try {
        const [prods, allStores] = await Promise.all([
          api.get(`/products?search=${encodeURIComponent(q)}`),
          api.get('/products'),
        ])
        setProducts(prods)
        // Find stores whose name matches the query
        const storeMap = {}
        allStores.forEach(p => {
          if (p.store_name && p.store_name.toLowerCase().includes(q.toLowerCase()) && p.store_id) {
            storeMap[p.store_id] = { id: p.store_id, store_name: p.store_name, store_logo: null }
          }
        })
        setStores(Object.values(storeMap))
      } catch {}
      setLoading(false)
    })()
  }, [q])

  const visible = products.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < products.length

  if (!q) return (
    <div className="sr-page">
      <div className="sr-inner">
        <div className="empty-state"><div className="empty-icon">🔍</div><h3>Enter a search term</h3></div>
      </div>
    </div>
  )

  return (
    <div className="sr-page">
      <div className="sr-inner">
        <div className="sr-header">
          <h1 className="sr-title">Results for <em>"{q}"</em></h1>
          <span className="sr-count">{products.length} product{products.length !== 1 ? 's' : ''} found</span>
        </div>

        {loading ? <Spinner /> : (
          <>
            {/* Matching Stores */}
            {stores.length > 0 && (
              <section className="sr-section">
                <h2 className="sr-section-title">🏪 Stores</h2>
                <div className="sr-stores">
                  {stores.map(s => (
                    <Link key={s.id} to={`/store/${s.id}`} className="sr-store-card">
                      <div className="sr-store-icon">🏪</div>
                      <div className="sr-store-name">{s.store_name}</div>
                      <span className="sr-store-arrow">→</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Products */}
            <section className="sr-section">
              <h2 className="sr-section-title">📦 Products</h2>
              {visible.length === 0
                ? <div className="empty-state"><div className="empty-icon">🔍</div><h3>No products found</h3><p>Try a different keyword.</p></div>
                : (
                  <>
                    <div className="product-grid">
                      {visible.map(p => <ProductCard key={p.id} product={p}/>)}
                    </div>
                    {hasMore && (
                      <div className="load-more-wrap">
                        <button className="load-more-btn" onClick={() => setPage(p => p + 1)}>
                          Load More ({products.length - visible.length} remaining)
                        </button>
                      </div>
                    )}
                  </>
                )
              }
            </section>
          </>
        )}
      </div>
    </div>
  )
}
