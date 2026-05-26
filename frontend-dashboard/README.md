# MerchHub — Merchant Admin Dashboard

A Vite + React merchant dashboard that connects to the Express/MySQL backend.

## Prerequisites
- Node.js 18+
- Backend running on `http://localhost:5000`

## Setup

```bash
cd merchant-admin
npm install
npm run dev
```

Open http://localhost:3000

## Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
merchant-admin/
├── index.html
├── vite.config.js          # Proxy /api → localhost:5000
├── src/
│   ├── main.jsx            # Entry point
│   ├── App.jsx             # Routes
│   ├── index.css           # CSS variables & global styles
│   ├── lib/
│   │   └── api.js          # Axios instance with auth interceptor
│   ├── hooks/
│   │   └── useAuthStore.js # Zustand auth state (persisted)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx   # Sidebar + topbar shell
│   │   │   └── DashboardLayout.css
│   │   ├── ui/
│   │   │   ├── index.jsx    # Btn, Badge, Card, Table, Field, Input…
│   │   │   └── ui.css
│   │   └── modals/
│   │       ├── Modal.jsx    # Modal, ConfirmModal, UploadZone
│   │       └── Modal.css
│   └── pages/
│       ├── AuthPage.jsx     # Login + Register
│       ├── Overview.jsx     # Stats + recent orders
│       ├── Stores.jsx       # CRUD stores
│       ├── Products.jsx     # CRUD products
│       ├── Orders.jsx       # View + update order status
│       ├── Categories.jsx   # CRUD categories (+ Brands export)
│       └── Brands.jsx       # Re-exports Brands from Categories
```

## Features
- JWT auth persisted in localStorage via Zustand
- Vite dev proxy: no CORS issues during development
- All images (store logo, product image) upload via multipart form
- Responsive sidebar — collapses to hamburger on mobile
- Toast notifications via react-hot-toast
- Filter orders by status; update delivery status inline
