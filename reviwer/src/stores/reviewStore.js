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
      console.log('fetchReviewsForBusiness called with id:', businessId, 'params:', params)
      const res = await api.get(`/api/reviews/business/${businessId}`, { params })
      console.log('fetchReviewsForBusiness response:', res.status, res.data?.length)
      set({ reviews: res.data })
      return res.data
    } catch (err) {
      console.error('Failed to fetch reviews', err)
      return []
    } finally {
      set({ loading: false })
    }
  },
  fetchPendingReviews: async () => {
    set({ loading: true })
    try {
      const token = useAuthStore.getState().token
      if (!token) {
        console.warn('fetchPendingReviews called without token')
        set({ reviews: [] })
        return []
      }
      const res = await api.get('/api/admin/reviews/pending', { headers: { Authorization: `Bearer ${token}` } })
      set({ reviews: res.data })
      return res.data
    } catch (err) {
      console.error('Failed to fetch pending reviews', err)
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
    try {
      const res = await api.put(`/api/admin/reviews/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } })
      // refresh pending list from backend
      await get().fetchPendingReviews()
      // refresh businesses and reviews for the affected business so UI reflects approval
      const updatedReview = res.data?.review
      if (updatedReview && updatedReview.business) {
        // refresh business list (to update ratings)
        const businessStore = await import('./businessStore').then(m => m.default)
        businessStore.getState().fetchBusinesses()
        // refresh reviews for that business in the review store
        await get().fetchReviewsForBusiness(updatedReview.business)
      }
    } catch (err) {
      console.error('approveReview failed', err)
      throw err
    }
  },
  rejectReview: async (id) => {
    const token = useAuthStore.getState().token
    try {
      const res = await api.put(`/api/admin/reviews/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } })
      await get().fetchPendingReviews()
      const updatedReview = res.data?.review
      if (updatedReview && updatedReview.business) {
        const businessStore = await import('./businessStore').then(m => m.default)
        businessStore.getState().fetchBusinesses()
        await get().fetchReviewsForBusiness(updatedReview.business)
      }
    } catch (err) {
      console.error('rejectReview failed', err)
      throw err
    }
  },
  pendingReviews: () => get().reviews.filter(r => r.status !== 'approved'),
  approvedReviewsForBusiness: (businessId) => get().reviews.filter(r => r.business === businessId && r.status === 'approved')
}), { name: 'reviwer_reviews' }))

export default useReviewStore

