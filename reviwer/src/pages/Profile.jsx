import React from 'react'
import useAuthStore from '../stores/authStore'
import { User, LogOut } from 'lucide-react'

export default function Profile() {
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl animate-fadeInUp">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{user?.email}</h3>
          <div className="text-sm text-gray-500">Role: <span className="font-medium">{user?.role}</span></div>
        </div>
      </div>

      <div className="mt-6">
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  )
}

