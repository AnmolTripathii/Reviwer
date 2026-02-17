import React from 'react'

export default function Loader({ size = 6 }) {
  return (
    <div className="flex items-center justify-center">
      <div className={`w-${size} h-${size} border-4 border-t-transparent border-indigo-600 rounded-full animate-spin`} />
    </div>
  )
}

