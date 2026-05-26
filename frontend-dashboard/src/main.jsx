import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: 'var(--accent)', secondary: '#000' } },
      }}
    />
  </BrowserRouter>
)
