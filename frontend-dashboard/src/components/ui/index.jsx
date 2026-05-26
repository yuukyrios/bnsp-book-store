import './ui.css'

/* ── Button ── */
export function Btn({ children, variant = 'ghost', size = 'md', className = '', ...props }) {
  return (
    <button className={`btn btn--${variant} btn--${size} ${className}`} {...props}>
      {children}
    </button>
  )
}

/* ── Badge ── */
export function Badge({ children, color = 'default' }) {
  return <span className={`badge badge--${color}`}>{children}</span>
}

/* ── Card ── */
export function Card({ children, className = '', ...props }) {
  return <div className={`card ${className}`} {...props}>{children}</div>
}

export function CardHeader({ children, action }) {
  return (
    <div className="card-header">
      <span className="card-title">{children}</span>
      {action && <div>{action}</div>}
    </div>
  )
}

/* ── Table ── */
export function Table({ children }) {
  return <div className="table-wrap"><table className="tbl">{children}</table></div>
}

/* ── Spinner ── */
export function Spinner() {
  return <div className="spinner-wrap"><div className="spinner" /></div>
}

/* ── Empty State ── */
export function Empty({ icon, title, desc }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      {desc && <p className="empty-desc">{desc}</p>}
    </div>
  )
}

/* ── Field (form) ── */
export function Field({ label, children, required }) {
  return (
    <div className="field">
      <label className="field-label">{label}{required && <span className="field-required">*</span>}</label>
      {children}
    </div>
  )
}

export function Input(props) {
  return <input className="input" {...props} />
}

export function Textarea(props) {
  return <textarea className="textarea" {...props} />
}

export function Select({ children, ...props }) {
  return <select className="select" {...props}>{children}</select>
}

/* ── Stats card ── */
export function StatCard({ label, value, sub, accent }) {
  return (
    <div className="stat-card" style={{ '--sc-accent': accent }}>
      <div className="stat-glow" />
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

/* ── Page header row ── */
export function PageHeader({ children }) {
  return <div className="page-header">{children}</div>
}

/* ── Search input ── */
export function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="search-wrap">
      <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input className="input search-input" value={value} onChange={onChange} placeholder={placeholder || 'Search…'} />
    </div>
  )
}
