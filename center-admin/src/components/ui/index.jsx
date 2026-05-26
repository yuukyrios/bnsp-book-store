import './ui.css'

export function Spinner() {
  return <div className="spinner-wrap"><div className="spinner" /></div>
}

export function Empty({ icon = '○', title, desc }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {desc && <div className="empty-desc">{desc}</div>}
    </div>
  )
}

export function Btn({ children, variant = 'default', size = 'md', danger, onClick, disabled, type = 'button', style }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${danger ? 'btn-danger' : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  )
}

export function Badge({ children, color = 'gray' }) {
  return <span className={`badge badge-${color}`}>{children}</span>
}

export function Card({ children, style }) {
  return <div className="card" style={style}>{children}</div>
}

export function Input({ label, ...props }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <input className="field-input" {...props} />
    </div>
  )
}

export function Select({ label, children, ...props }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <select className="field-input" {...props}>{children}</select>
    </div>
  )
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export function StatCard({ label, value, icon, color = 'accent' }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export function Table({ children }) {
  return (
    <div className="table-wrap">
      <table className="table">{children}</table>
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-bar">
      <span className="search-icon">⌕</span>
      <input
        className="search-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && <button className="search-clear" onClick={() => onChange('')}>✕</button>}
    </div>
  )
}
