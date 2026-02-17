import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, List, PlusCircle, ShieldCheck, User } from 'lucide-react'
import useAuthStore from '../stores/authStore'

const Link = ({ to, children, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `nav-link flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${isActive ? 'nav-active' : 'text-gray-700 hover:text-indigo-600'}`
    }
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span>{children}</span>
    <span className="nav-underline" />
  </NavLink>
)

export default function NavBar() {
  const user = useAuthStore(state => state.user)

  return (
    <header className="sticky top-0 z-20">
      <div className="backdrop-blur-sm bg-white/60 border-b border-white/30">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="logo-badge flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md logo-bounce">
                R
              </div>
              <div>
                <div className="text-lg font-extrabold tracking-tight">Reviwer</div>
                <div className="text-xs text-gray-500">Discover local businesses</div>
              </div>
            </div>

            <nav className="flex items-center gap-2">
              <Link to="/" icon={Home}>Home</Link>
              <Link to="/businesses" icon={List}>Businesses</Link>
              <Link to="/submit" icon={PlusCircle}>Submit</Link>
              {user?.role === 'admin' && <Link to="/admin" icon={ShieldCheck}>Admin</Link>}
            </nav>
          </div>

          <div>
            <NavLink to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:text-indigo-600 transition">
              <User className="w-4 h-4" /> <span className="hidden sm:inline">{user?.email}</span>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}

