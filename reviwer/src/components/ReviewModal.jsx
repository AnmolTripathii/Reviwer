import React from 'react'

export default function ReviewModal({ review, onClose }) {
  if (!review) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full z-10 p-6 overflow-auto pointer-events-auto">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Review detail</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-700 mb-2">{review.comment}</div>
          <div className="text-xs text-gray-500 mb-2">By {review.user?.email || review.authorEmail} • {new Date(review.createdAt).toLocaleString()}</div>
          <div className="mt-2 text-sm text-gray-600">Scores — Quality: {review.rating?.quality}, Service: {review.rating?.service}, Value: {review.rating?.value}</div>
          {review.photos && review.photos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {review.photos.map((p, i) => (
                <img key={i} src={p.url || p} alt={`photo-${i}`} className="w-full h-48 object-cover rounded" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

