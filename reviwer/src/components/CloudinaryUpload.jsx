import React, { useState } from 'react'
import { UploadCloud } from 'lucide-react'

// Simple client-side scaffold for image selection + preview.
// TODO: Wire uploadToCloudinary with an unsigned preset or server-signed endpoint.
export default function CloudinaryUpload({ onChange }) {
  const [files, setFiles] = useState([])

  const handle = (e) => {
    const selected = Array.from(e.target.files || [])
    const withPreviews = selected.map(f => ({ file: f, preview: URL.createObjectURL(f) }))
    setFiles(prev => [...prev, ...withPreviews])
    if (onChange) onChange(withPreviews.map(p => p.file))
  }

  return (
    <div>
      <label className="block border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-300">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <UploadCloud className="w-5 h-5" />
          <span className="text-sm">Click to select photos or drag them here</span>
        </div>
        <input className="hidden" type="file" accept="image/*" multiple onChange={handle} />
      </label>

      <div className="mt-3 flex gap-3 flex-wrap">
        {files.map((f, i) => (
          <div key={i} className="w-24 h-24 rounded-lg overflow-hidden shadow-sm">
            <img src={f.preview} alt="preview" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2">Photos are previewed locally. Upload to Cloudinary when configured.</div>
    </div>
  )
}

