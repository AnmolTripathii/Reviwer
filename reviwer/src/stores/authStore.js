import create from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'react-hot-toast'
import api from '../utils/api'

const useAuthStore = create(persist((set, get) => ({
  user: null,
  token: null,
  setToken: (token) => set({ token }),
  login: async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const { token, user } = res.data
      // store token and user
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      set({ user, token })
      toast.success('Logged in')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
      return false
    }
  },
  logout: () => {
    api.defaults.headers.common['Authorization'] = ''
    set({ user: null, token: null })
    toast('Logged out')
  },
  loadProfile: async () => {
    try {
      const res = await api.get('/api/auth/profile')
      set({ user: res.data })
    } catch (err) {
      // ignore
    }
  },
  // initialize store after rehydrate: set api header and optionally load profile
  initialize: async () => {
    const { token } = get()
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      try {
        await get().loadProfile()
      } catch (e) {
        // ignore
      }
    }
  },
  isAdmin: () => {
    const u = get().user
    return u && u.role === 'admin'
  }
}), { name: 'reviwer_auth' }))

export default useAuthStore

