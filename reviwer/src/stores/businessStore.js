import create from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

const useBusinessStore = create(persist((set, get) => ({
  businesses: [],
  loading: false,
  fetchBusinesses: async (params = {}) => {
    set({ loading: true })
    try {
      const res = await api.get('/api/businesses', { params })
      set({ businesses: res.data })
    } catch (err) {
      console.error('Failed to fetch businesses', err)
    } finally {
      set({ loading: false })
    }
  },
  addBusiness: async (b) => {
    const res = await api.post('/api/businesses', b)
    set(state => ({ businesses: [res.data.business, ...state.businesses] }))
    return res.data.business
  },
  updateBusinessRating: (businessId, rating) => {
    set(state => {
      const businesses = state.businesses.map(b => {
        if (b._id !== businessId) return b
        const total = (b.averageRating || 0) * (b.totalReviews || 0) + rating
        const count = (b.totalReviews || 0) + 1
        return { ...b, averageRating: +(total / count).toFixed(2), totalReviews: count }
      })
      return { businesses }
    })
  },
  getById: (id) => get().businesses.find(b => b._id === id)
}), { name: 'reviwer_businesses' }))

export default useBusinessStore

