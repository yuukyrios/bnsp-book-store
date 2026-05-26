import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import api from '../lib/api'
import toast from 'react-hot-toast'
import './Cart.css'

export default function Cart() {
  const { items, remove, updateQty, total, clear } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState({}) // { [product_id]: message }
  const navigate = useNavigate()

  const setMessage = (id, val) => setMessages(prev => ({ ...prev, [id]: val }))

  const checkout = async () => {
    if (items.length === 0) return
    setLoading(true)
    const errors = []
    for (const item of items) {
      try {
        await api.post('/orders', {
          product_id: item.product.id,
          quantity: item.quantity,
          message: messages[item.product.id] || null
        })
      } catch (e) {
        errors.push(`${item.product.name}: ${e.message}`)
      }
    }
    setLoading(false)
    if (errors.length === 0) {
      clear()
      toast.success('Order placed! 🎉')
      navigate('/orders')
    } else {
      errors.forEach(e => toast.error(e))
      if (errors.length < items.length) {
        toast.success('Some items ordered successfully')
        navigate('/orders')
      }
    }
  }

  if (items.length === 0) return (
    <div className="cart-page">
      <div className="cart-inner">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛍</div>
          <h2>Your cart is empty</h2>
          <p>Browse products and add something you love.</p>
          <Link to="/" className="cart-browse-btn">Start Shopping</Link>
        </div>
      </div>
    </div>
  )

  const subtotal = total()

  return (
    <div className="cart-page">
      <div className="cart-inner">
        <h1 className="cart-title">Shopping Cart <span>({items.length} item{items.length !== 1 ? 's' : ''})</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(({ product: p, quantity }) => (
              <div key={p.id} className="cart-item">
                <Link to={`/product/${p.id}`} className="ci-img">
                  {p.image
                    ? <img src={p.image} alt={p.name} onError={e => e.target.style.display='none'}/>
                    : <span>🛍</span>}
                </Link>
                <div className="ci-info">
                  <Link to={`/product/${p.id}`} className="ci-name">{p.name}</Link>
                  {p.store_name && <div className="ci-store">{p.store_name}</div>}
                  <div className="ci-price">${parseFloat(p.price).toFixed(2)}</div>
                  <textarea
                    className="ci-message"
                    placeholder="Send a note to the seller (optional)"
                    rows={2}
                    value={messages[p.id] || ''}
                    onChange={e => setMessage(p.id, e.target.value)}
                  />
                </div>
                <div className="ci-controls">
                  <div className="ci-qty">
                    <button onClick={() => updateQty(p.id, quantity - 1)}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => updateQty(p.id, Math.min(p.quantity, quantity + 1))}>+</button>
                  </div>
                  <div className="ci-subtotal">${(parseFloat(p.price) * quantity).toFixed(2)}</div>
                  <button className="ci-remove" onClick={() => remove(p.id)} aria-label="Remove">✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <div className="cs-title">Order Summary</div>
            <div className="cs-rows">
              {items.map(({ product: p, quantity }) => (
                <div key={p.id} className="cs-row">
                  <span className="cs-pname">{p.name} × {quantity}</span>
                  <span>${(parseFloat(p.price) * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="cs-divider"/>
            <div className="cs-total">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button className="cs-checkout" onClick={checkout} disabled={loading}>
              {loading ? 'Placing order…' : 'Checkout →'}
            </button>
            <Link to="/" className="cs-continue">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}