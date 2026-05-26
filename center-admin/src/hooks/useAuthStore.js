import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'

const useAuthStore = create(persist(
  (set) => ({
    token: null,
    admin: null,
    login: async (email, password) => {
      const data = await api.post('/auth/merchant/login', { email, password })
      localStorage.setItem('ca_token', data.token)
      set({ token: data.token, admin: data.merchant })
    },
    logout: () => {
      localStorage.removeItem('ca_token')
      set({ token: null, admin: null })
    }
  }),
  { name: 'ca-auth', partialize: s => ({ token: s.token, admin: s.admin }) }
))

export default useAuthStore
