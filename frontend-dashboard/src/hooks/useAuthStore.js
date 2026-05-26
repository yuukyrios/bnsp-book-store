import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      merchant: null,
      token: null,
      login: (merchant, token) => set({ merchant, token }),
      logout: () => set({ merchant: null, token: null }),
    }),
    { name: 'merchant-auth' }
  )
)
