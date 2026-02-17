import React, { useState } from 'react'
import useAuthStore from '../stores/authStore'
import toast from 'react-hot-toast'

export default function Signup() {
  const register = useAuthStore(state => state.register)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const ok = await register(name.trim(), email.trim(), password)
    setLoading(false)
    if (!ok) return
    toast.success('Welcome!')
  }

  return (
    <div className="max-w-md mx-auto bg-white/80 glass p-6 rounded shadow">
      <h2 className="text-lg font-medium mb-4">Create account</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        </div>
      </form>
    </div>
  )
}

