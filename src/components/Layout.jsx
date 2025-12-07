import React from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, LayoutDashboard } from 'lucide-react'

export default function Layout() {
  const { isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  // Check if we are in admin dashboard area
  const isDashboard = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      {isDashboard && isAdmin && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
              <LayoutDashboard className="w-6 h-6 text-[#ff6b35]" />
              <span className="bg-gradient-to-r from-[#ff6b35] to-[#ff9f43] bg-clip-text text-transparent">
                LinkAdmin
              </span>
            </Link>
            <button onClick={handleLogout} className="btn btn-outline flex gap-2 items-center text-sm">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>
      )}
      
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Affiliate Link Preview Generator</p>
      </footer>
    </div>
  )
}
