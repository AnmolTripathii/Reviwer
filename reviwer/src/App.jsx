import React from 'react'
import './App.css'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './stores/authStore'
import Login from './components/Login'
import NavBar from './components/NavBar'
import Dashboard from './components/Dashboard'
import BusinessList from './components/BusinessList'
import BusinessDetail from './pages/BusinessDetail'
import ReviewForm from './components/ReviewForm'
import AdminPending from './components/AdminPending'
import Profile from './pages/Profile'
import Signup from './components/Signup'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  const user = useAuthStore(state => state.user)
  React.useEffect(() => {
    // initialize auth store (sets api header from persisted token and loads profile)
    useAuthStore.getState().initialize()
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 flex items-center justify-center">
        <Toaster />
        <div className="w-full max-w-md mx-auto px-6">
          <Login />
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
        <Toaster />
        <NavBar />
        <main className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/businesses" element={<BusinessList />} />
            <Route path="/businesses/:id" element={<BusinessDetail />} />
            <Route path="/submit" element={<ReviewForm />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={user.role === 'admin' ? <AdminPending /> : <Navigate to="/" replace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
