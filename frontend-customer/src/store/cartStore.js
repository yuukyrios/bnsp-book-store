import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export const useCartStore = create(persist(
  (set, get) => ({
    items: [],
    add: (product, qty = 1) => {
      const items = get().items
      const ex = items.find(i => i.product.id === product.id)
      if (ex) {
        set({ items: items.map(i => i.product.id === product.id
          ? { ...i, quantity: Math.min(i.quantity + qty, product.quantity) } : i) })
      } else {
        set({ items: [...items, { product, quantity: qty }] })
      }
    },
    remove: (id) => set({ items: get().items.filter(i => i.product.id !== id) }),
    updateQty: (id, qty) => {
      if (qty < 1) { get().remove(id); return }
      set({ items: get().items.map(i => i.product.id === id ? { ...i, quantity: qty } : i) })
    },
    clear: () => set({ items: [] }),
    total: () => get().items.reduce((s, i) => s + parseFloat(i.product.price) * i.quantity, 0),
    count: () => get().items.reduce((s, i) => s + i.quantity, 0),
  }),
  { name: 'user-cart' }
))
