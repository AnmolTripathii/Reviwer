import React, { useState } from 'react'
import { UploadCloud, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

// Uploads files to backend /api/upload and returns uploaded URLs via onChange
export default function CloudinaryUpload({ onChange }) {
  const [files, setFiles] = useState([]) // { file, preview, status, url?, error?, progress? }

  const handle = async (e) => {
    const selected = Array.from(e.target.files || [])
    const next = selected.map(f => ({ file: f, preview: URL.createObjectURL(f), status: 'pending', url: null, error: null, progress: 0 }))
    setFiles(prev => [...prev, ...next])

    // Upload sequentially with progress
    const results = []
    for (let i = 0; i < next.length; i++) {
      const idx = files.length + i
      const item = next[i]
      setFiles(prev => {
        const copy = [...prev]
        copy[copy.length - next.length + i] = { ...item, status: 'uploading', progress: 0 }
        return copy
      })
      try {
        const fd = new FormData()
        fd.append('file', item.file)
        const res = await api.post('/api/upload', fd, {
          onUploadProgress: (evt) => {
            const p = Math.round((evt.loaded * 100) / evt.total)
            setFiles(prev => {
              const copy = [...prev]
              copy[copy.length - next.length + i] = { ...copy[copy.length - next.length + i], progress: p }
              return copy
            })
          }
        })
        const url = res.data?.url || null
        setFiles(prev => {
          const copy = [...prev]
          copy[copy.length - next.length + i] = { ...copy[copy.length - next.length + i], status: url ? 'done' : 'failed', url, error: url ? null : 'No URL returned' }
          return copy
        })
        results.push(url)
      } catch (err) {
        console.error('Upload failed', err)
        setFiles(prev => {
          const copy = [...prev]
          copy[copy.length - next.length + i] = { ...copy[copy.length - next.length + i], status: 'failed', error: err.response?.data?.message || err.message || 'Upload error' }
          return copy
        })
        results.push(null)
        toast.error('One or more uploads failed')
      }
    }

    const successful = results.filter(Boolean)
    if (onChange) onChange(successful)
  }

  const removeIndex = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
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
          <div key={i} className="w-28 rounded-lg overflow-hidden shadow-sm relative border p-1">
            <img src={f.preview} alt="preview" className="w-28 h-20 object-cover rounded" />
            <div className="text-xs mt-1">{f.status === 'uploading' ? `${f.progress}%` : f.status}</div>
            {f.error && <div className="text-xs text-red-500">{f.error}</div>}
            <button onClick={() => removeIndex(i)} className="absolute top-1 right-1 text-red-500"><XCircle className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2">Photos are uploaded and previewed. Failed uploads show an error.</div>
    </div>
  )
}

