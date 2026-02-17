import create from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'
import useAuthStore from './authStore'

const useReviewStore = create(persist((set, get) => ({
  reviews: [],
  loading: false,
  fetchReviewsForBusiness: async (businessId, params = {}) => {
    set({ loading: true })
    try {
      const res = await api.get(`/api/reviews/business/${businessId}`, { params })
      set({ reviews: res.data })
      return res.data
    } catch (err) {
      console.error('Failed to fetch reviews', err)
      return []
    } finally {
      set({ loading: false })
    }
  },
  submitReview: async (review) => {
    try {
      const token = useAuthStore.getState().token
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await api.post('/api/reviews', review, { headers })
      // pending admin approval; do not add to approved reviews list
      set(state => ({ reviews: [res.data.review, ...state.reviews] }))
      return res.data.review
    } catch (err) {
      console.error('Failed to submit review', err)
      throw err
    }
  },
  approveReview: async (id) => {
    const token = useAuthStore.getState().token
    await api.put(`/api/admin/reviews/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } })
    // remove from pending list locally
    set(state => ({ reviews: state.reviews.map(r => r._id === id ? { ...r, status: 'approved' } : r) }))
  },
  rejectReview: async (id) => {
    const token = useAuthStore.getState().token
    await api.put(`/api/admin/reviews/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } })
    set(state => ({ reviews: state.reviews.filter(r => r._id !== id) }))
  },
  pendingReviews: () => get().reviews.filter(r => r.status !== 'approved'),
  approvedReviewsForBusiness: (businessId) => get().reviews.filter(r => r.business === businessId && r.status === 'approved')
}), { name: 'reviwer_reviews' }))

export default useReviewStore

