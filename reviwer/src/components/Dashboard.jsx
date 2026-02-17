import React from 'react'
import useAuthStore from '../stores/authStore'
import BusinessList from './BusinessList'
import ReviewForm from './ReviewForm'
import useReviewStore from '../stores/reviewStore'
import { LogOut, Check, X, User } from 'lucide-react'

export default function Dashboard() {
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const pending = useReviewStore(state => state.reviews)
  const fetchPending = useReviewStore(state => state.fetchPendingReviews)

  React.useEffect(() => {
    if (user?.role === 'admin') {
      fetchPending()
    }
  }, [user])
  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Welcome, {user?.email}</h2>
            <p className="text-sm text-gray-500">Role: <span className="font-medium">{user?.role}</span></p>
          </div>
        </div>
        <div>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg shadow-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="animate-fadeInUp">
          <BusinessList />
        </div>
        <div className="animate-fadeInUp">
          <ReviewForm />
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Pending reviews</h3>
            <span className="text-sm text-gray-500">{pending.length} awaiting</span>
          </div>
          <ul className="mt-3 space-y-3">
            {pending.map(r => (
            <li key={r._id} className="border rounded-lg p-3 flex items-start justify-between">
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
      )}
    </div>
  )
}

