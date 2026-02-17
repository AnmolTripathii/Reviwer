import React from 'react'
import useReviewStore from '../stores/reviewStore'
import useAuthStore from '../stores/authStore'
import { Check, X } from 'lucide-react'

export default function AdminPending() {
  const reviews = useReviewStore(state => state.reviews)
  const fetchPending = useReviewStore(state => state.fetchPendingReviews)
  const user = useAuthStore(state => state.user)

  React.useEffect(() => {
    if (user?.role === 'admin') {
      fetchPending()
    }
  }, [user])

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Pending reviews</h2>
        <div className="text-gray-500">No pending reviews.</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Pending reviews</h2>
      <ul className="space-y-3">
        {reviews.map(r => (
          <li key={r._id} className="flex items-start justify-between border rounded-lg p-4">
            <div>
              <div className="text-sm text-gray-700">{r.comment}</div>
              <div className="text-xs text-gray-400 mt-2">By {r.user?.email || r.authorEmail} • {new Date(r.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => useReviewStore.getState().approveReview(r._id)} className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded">
                <Check className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => useReviewStore.getState().rejectReview(r._id)} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-gray-700">
                <X className="w-4 h-4" /> Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

