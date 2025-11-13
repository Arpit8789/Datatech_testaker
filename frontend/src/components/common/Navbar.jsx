import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, userRole, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      toast.success('Logged out successfully')
      navigate('/admin/login')
    } else {
      toast.error('Logout failed')
    }
  }

  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard'
      case 'college':
        return '/college/dashboard'
      case 'student':
        return '/student/dashboard'
      default:
        return '/'
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Datatech</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100">
                <User size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user.name || user.email}
                </span>
                <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                  {userRole}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          {user && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && user && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100">
              <User size={18} className="text-gray-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {user.name || user.email}
                </p>
                <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                  {userRole}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar