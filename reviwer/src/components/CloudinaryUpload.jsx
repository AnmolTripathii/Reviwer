import React, { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import api from '../utils/api'

// Uploads files to backend /api/upload and returns uploaded URLs via onChange
export default function CloudinaryUpload({ onChange }) {
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)

  const handle = async (e) => {
    const selected = Array.from(e.target.files || [])
    const newPreviews = selected.map(f => ({ file: f, preview: URL.createObjectURL(f) }))
    setPreviews(prev => [...prev, ...newPreviews])

    // Upload each file
    setUploading(true)
    try {
      const uploads = []
      for (const file of selected) {
        try {
          const fd = new FormData()
          fd.append('file', file)
          // DO NOT set Content-Type header manually; let the browser set the boundary
          const res = await api.post('/api/upload', fd)
          uploads.push(res.data.url)
        } catch (innerErr) {
          console.error('Single upload failed', innerErr)
          uploads.push(null)
        }
      }
      const successful = uploads.filter(Boolean)
      if (onChange) onChange(successful)
      if (successful.length === 0) {
        throw new Error('All uploads failed')
      }
    } catch (err) {
      console.error('Upload failed', err)
      // show user-friendly feedback
      alert('Image upload failed. Check server logs or Cloudinary configuration.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-300">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <UploadCloud className="w-5 h-5" />
          <span className="text-sm">{uploading ? 'Uploading...' : 'Click to select photos or drag them here'}</span>
        </div>
        <input className="hidden" type="file" accept="image/*" multiple onChange={handle} />
      </label>

      <div className="mt-3 flex gap-3 flex-wrap">
        {previews.map((f, i) => (
          <div key={i} className="w-24 h-24 rounded-lg overflow-hidden shadow-sm">
            <img src={f.preview} alt="preview" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2">Photos are uploaded and previewed. You can add more.</div>
    </div>
  )
}

