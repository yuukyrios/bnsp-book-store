// src/pages/Home.jsx

import { useState, useEffect } from 'react'
import api from '../lib/api'
import ProductCard from '../components/ui/ProductCard'
import Spinner from '../components/ui/Spinner'
import './Home.css'

const CATEGORIES_ICONS = ['📖','📚','🧙','💕','🚀','🕵️','👻','🌎','⚔️','🎓']

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const PAGE_SIZE = 10

  useEffect(() => {
    loadData()

    // changed from /categories → /genres
    api.get('/genres').then(setCategories).catch(() => {})
  }, [])

  const loadData = async (p = 1) => {
    if (p === 1) setLoading(true)
    else setLoadingMore(true)

    try {
      const all = await api.get('/products')

      const sorted = all.sort((a, b) => b.id - a.id)
      const slice = sorted.slice(0, p * PAGE_SIZE)

      setProducts(slice)
      setHasMore(slice.length < sorted.length)
      setPage(p)
    } catch {}

    setLoading(false)
    setLoadingMore(false)
  }

  const loadMore = () => loadData(page + 1)

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <p className="hero-eyebrow">DISCOVER NEW WORLDS THROUGH BOOKS</p>

            <h1 className="hero-title">
              Your next great
              <br />
              <em>book adventure</em>
            </h1>

            <p className="hero-sub">
              Explore bestselling novels, timeless classics,
              fantasy epics, manga, educational books,
              and hidden indie gems from readers worldwide.
            </p>
          </div>

          <div className="hero-deco">
            <div className="hero-blob"/>
            <div className="hero-orb hero-orb--1">📚</div>
            <div className="hero-orb hero-orb--2">✨</div>
            <div className="hero-orb hero-orb--3">📖</div>
          </div>
        </div>
      </section>

      {/* Genres */}
      {categories.length > 0 && (
        <section className="cats-section">
          <div className="section-inner">

            {/* changed title */}
            <h2 className="section-title">Browse by Genre</h2>

            <div className="cats-row">
              {categories.slice(0, 10).map((c, i) => (
                <a
                  key={c.id}
                  href={`/search?q=${encodeURIComponent(c.name)}`}
                  className="cat-pill"
                >
                  <span className="cat-icon">
                    {CATEGORIES_ICONS[i % CATEGORIES_ICONS.length]}
                  </span>

                  <span>{c.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="products-section">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">Latest Books</h2>
            <span className="section-count">{products.length} items</span>
          </div>

          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No Books Yet</h3>
              <p>Check back soon — bookstores are adding new titles.</p>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {hasMore && (
                <div className="load-more-wrap">
                  <button
                    className="load-more-btn"
                    onClick={loadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading…' : 'Load More Books'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}