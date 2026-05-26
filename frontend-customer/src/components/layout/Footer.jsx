import { Link } from 'react-router-dom'
import './Footer.css'
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-logo">✦ Akasha</div>
          <p className="footer-tagline">Your everyday marketplace.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/search?q=">Browse All</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My Orders</Link>
        </div>
      </div>
      <div className="footer-copy">© 2025 Akasha. All rights reserved.</div>
    </footer>
  )
}
