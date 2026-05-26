import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { add } = useCartStore()
  const { token } = useAuthStore()

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${id}`).then(p => { setProduct(p); setLoading(false) }).catch(() => setLoading(false))
  }, [id])

  const handleAdd = () => {
    if (!token) { toast.error('Sign in to add to cart'); navigate('/auth'); return }
    if (product.quantity === 0) { toast.error('Out of stock'); return }
    add(product, qty)
    setAdded(true)
    toast.success('Added to cart!')
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <Spinner />
  if (!product) return <div className="pd-notfound"><h2>Product not found.</h2><Link to="/" className="pd-back">← Back to home</Link></div>

  const price = parseFloat(product.price).toLocaleString('en', { minimumFractionDigits: 2 })
  const inStock = product.quantity > 0

  return (
    <div className="pd-page">
      <div className="pd-inner">
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> <span>/</span>
          {product.store_name && <><Link to={`/store/${product.store_id}`}>{product.store_name}</Link><span>/</span></>}
          <span>{product.name}</span>
        </div>

        <div className="pd-layout">
          {/* Image */}
          <div className="pd-image-wrap">
            {product.image
              ? <img src={product.image} alt={product.name} className="pd-image" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}/>
              : null}
            <div className="pd-image-placeholder" style={{ display: product.image ? 'none' : 'flex' }}>🛍</div>
          </div>

          {/* Info */}
          <div className="pd-info">
            <div className="pd-tags">
              {product.genre_name && <span className="pd-tag pd-tag--teal">{product.genre_name}</span>}
              {product.book_type_name && <span className="pd-tag pd-tag--gold">{product.book_type_name}</span>}
            </div>

            <h1 className="pd-name">{product.name}</h1>
            <div className="pd-price">${price}</div>

            {product.description && (
              <p className="pd-desc">{product.description}</p>
            )}

            <div className="pd-stock">
              {inStock
                ? <span className="pd-stock--ok">✓ In stock ({product.quantity} available)</span>
                : <span className="pd-stock--out">✕ Out of stock</span>}
            </div>

            {inStock && (
              <div className="pd-qty-row">
                <span className="pd-qty-label">Quantity</span>
                <div className="pd-qty-ctrl">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.quantity, q + 1))}>+</button>
                </div>
              </div>
            )}

            <button className={`pd-add-btn ${!inStock ? 'disabled' : ''} ${added ? 'added' : ''}`} onClick={handleAdd} disabled={!inStock}>
              {added ? '✓ Added to Cart' : '🛍 Add to Cart'}
            </button>

            {product.store_id && (
              <Link to={`/store/${product.store_id}`} className="pd-store-link">
                <span className="pd-store-icon">🏪</span>
                <div>
                  <div className="pd-store-label">Sold by</div>
                  <div className="pd-store-name">{product.store_name}</div>
                </div>
                <span className="pd-store-arrow">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
