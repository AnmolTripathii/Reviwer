import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useBusinessStore from '../stores/businessStore'
import useReviewStore from '../stores/reviewStore'
import { Star, ArrowLeft } from 'lucide-react'

export default function BusinessDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const getById = useBusinessStore(state => state.getById)
  const business = getById(id)
  const fetchReviewsForBusiness = useReviewStore(state => state.fetchReviewsForBusiness)
  const reviews = React.useMemo(() => [], [])

  React.useEffect(() => {
    fetchReviewsForBusiness(id)
  }, [id])

  const reviewsState = useReviewStore(state => state.reviews)

  if (!business) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="text-gray-600">Business not found.</div>
        <button onClick={() => navigate('/businesses')} className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded">Back</button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-semibold mt-2">{business.name}</h1>
          <div className="text-sm text-gray-500">{business.category} • {business.location}</div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <Star className="w-5 h-5 text-yellow-400" />
            <div className="font-semibold">{business.avgRating || '—'}</div>
          </div>
          <div className="text-sm text-gray-400">{business.ratingsCount || 0} reviews</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-md">
          <h3 className="font-semibold mb-3">Reviews</h3>
          {reviewsState.length === 0 ? (
            <div className="text-gray-500">No reviews yet.</div>
          ) : (
            <ul className="space-y-3">
              {reviewsState.map(r => (
                <li key={r._id} className="border rounded-lg p-3">
                  <div className="text-sm text-gray-700">{r.comment}</div>
                  <div className="text-xs text-gray-400 mt-2">By {r.user?.email || r.authorEmail} • {new Date(r.createdAt).toLocaleString()}</div>
                  <div className="mt-2 text-sm text-gray-600">Scores — Quality: {r.rating.quality}, Service: {r.rating.service}, Value: {r.rating.value}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="bg-white p-4 rounded-xl shadow-md">
          <h4 className="font-semibold">About</h4>
          <div className="text-sm text-gray-600 mt-2">
            <div><strong>Category:</strong> {business.category}</div>
            <div className="mt-1"><strong>Location:</strong> {business.location}</div>
          </div>
        </aside>
      </div>
    </div>
  )
}

