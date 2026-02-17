import React, { useState } from 'react'
import useAuthStore from '../stores/authStore'

export default function Login() {
  const login = useAuthStore(state => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    await login(email.trim(), password)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow animate-fadeInUp">
      <h2 className="text-lg font-medium mb-4">Sign in</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded">Sign in</button>
        </div>
      </form>
      <div className="mt-4 text-sm text-gray-600">
        Test accounts: <br />
        admin@test.com / AdminPass123 <br />
        user@test.com / UserPass123
      </div>
    </div>
  )
}

