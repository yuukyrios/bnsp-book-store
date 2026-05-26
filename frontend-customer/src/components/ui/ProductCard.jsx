import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const price = parseFloat(product.price).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return (
    <Link to={`/product/${product.id}`} className="pcard">
      <div className="pcard-img">
        {product.image
          ? <img src={product.image} alt={product.name} loading="lazy" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}/>
          : null}
        <div className="pcard-placeholder" style={{ display: product.image ? 'none' : 'flex' }}>🛍</div>
      </div>
      <div className="pcard-body">
        {product.store_name && <div className="pcard-store">{product.store_name}</div>}
        <div className="pcard-name">{product.name}</div>
        <div className="pcard-footer">
          <span className="pcard-price">${price}</span>
          {product.quantity === 0 && <span className="pcard-oos">Out of stock</span>}
        </div>
        {product.category_name && <div className="pcard-tag">{product.category_name}</div>}
      </div>
    </Link>
  )
}
