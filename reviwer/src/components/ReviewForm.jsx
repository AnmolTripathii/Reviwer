import React, { useState } from 'react'
import useBusinessStore from '../stores/businessStore'
import useReviewStore from '../stores/reviewStore'
import useAuthStore from '../stores/authStore'
import CloudinaryUpload from './CloudinaryUpload'
import toast from 'react-hot-toast'
import { Star, Image } from 'lucide-react'

export default function ReviewForm() {
  const businesses = useBusinessStore(state => state.businesses)
  const submitReview = useReviewStore(state => state.submitReview)
  const user = useAuthStore(state => state.user)

  const [businessId, setBusinessId] = useState(businesses[0]?.id || '')
  const [quality, setQuality] = useState(5)
  const [service, setService] = useState(5)
  const [value, setValue] = useState(5)
  const [comment, setComment] = useState('')
  const [photos, setPhotos] = useState([])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!businessId) return toast.error('Select a business')
    const r = {
      businessId,
      authorEmail: user.email,
      rating: { quality: +quality, service: +service, value: +value },
      comment,
      photos,
    }
    submitReview(r)
    toast.success('Review submitted (pending approval)')
    setComment('')
    setPhotos([])
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md animate-fadeInUp">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" /> Submit a review</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Business</label>
          <select value={businessId} onChange={e => setBusinessId(e.target.value)} className="mt-1 block w-full border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <option value="">Select a business</option>
            {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Quality</label>
            <input type="range" min="1" max="5" value={quality} onChange={e => setQuality(e.target.value)} className="w-full" />
            <div className="text-xs text-gray-500 text-right mt-1">Score: {quality}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Service</label>
            <input type="range" min="1" max="5" value={service} onChange={e => setService(e.target.value)} className="w-full" />
            <div className="text-xs text-gray-500 text-right mt-1">Score: {service}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Value</label>
            <input type="range" min="1" max="5" value={value} onChange={e => setValue(e.target.value)} className="w-full" />
            <div className="text-xs text-gray-500 text-right mt-1">Score: {value}</div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Comment</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} className="mt-1 block w-full border border-gray-200 rounded-lg px-3 py-2" rows="4" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2 flex items-center gap-2"><Image className="w-4 h-4" /> Photos</label>
          <CloudinaryUpload onChange={(files) => setPhotos(files.map(f => ({ name: f.name }))) } />
        </div>

        <div className="pt-2">
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded-lg shadow">Submit review</button>
        </div>
      </form>
    </div>
  )
}

