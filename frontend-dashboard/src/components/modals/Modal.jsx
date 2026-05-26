import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Btn } from '../ui'
import './Modal.css'

export function Modal({ title, onClose, children, footer, width = 520 }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: width }}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmModal({ title, message, name, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose} width={400}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="danger" onClick={onConfirm}>Delete</Btn>
        </>
      }
    >
      <p className="confirm-msg">
        {message} <strong className="confirm-name">"{name}"</strong>?
      </p>
      <p className="confirm-note">This action cannot be undone.</p>
    </Modal>
  )
}

export function FormRow({ children }) {
  return <div className="form-row">{children}</div>
}

export function UploadZone({ preview, onClick, label, hint }) {
  return (
    <div className="upload-zone" onClick={onClick}>
      {preview
        ? <img src={preview} alt="preview" className="upload-preview" onError={e => e.target.style.display='none'} />
        : <>
            <div className="upload-icon">📷</div>
            <div className="upload-label">{label || 'Click to upload image'}</div>
            <div className="upload-hint">{hint || 'PNG, JPG — max 5MB'}</div>
          </>
      }
    </div>
  )
}
