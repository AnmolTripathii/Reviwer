import React, { useState } from 'react'
import useBusinessStore from '../stores/businessStore'
import { Search, Star, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function BusinessList() {
  const businesses = useBusinessStore(state => state.businesses)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const navigate = useNavigate()
  const fetchBusinesses = useBusinessStore(state => state.fetchBusinesses)

  React.useEffect(() => {
    fetchBusinesses()
  }, [])

  const cats = Array.from(new Set(businesses.map(b => b.category)))

  const filtered = businesses.filter(b => {
    if (category && b.category !== category) return false
    if (query && !b.name.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <div className="bg-white p-4 rounded-xl shadow-md animate-fadeInUp">
      <h3 className="font-semibold mb-4 text-lg">Explore businesses</h3>
      <div className="flex gap-3 mb-4 items-center">
        <div className="flex items-center gap-2 flex-1 bg-gray-100 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input placeholder="Search businesses" value={query} onChange={e => setQuery(e.target.value)} className="bg-transparent flex-1 outline-none text-sm" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">All</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(b => (
          <div
            key={b.id}
            onClick={() => navigate(`/businesses/${b.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/businesses/${b.id}`) }}
            className="cursor-pointer p-4 bg-white rounded-xl border hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-400 flex items-center justify-center text-white font-bold shadow-sm">
                {b.name.split(' ').slice(0,2).map(s => s[0]).join('')}
              </div>
              <div>
                <div className="font-medium text-sm">{b.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2"><MapPin className="w-3 h-3" />{b.category} • {b.location}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-sm font-semibold"><Star className="w-4 h-4 text-yellow-400" /> {b.avgRating || '—'}</div>
              <div className="text-xs text-gray-400">{b.ratingsCount || 0} reviews</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

