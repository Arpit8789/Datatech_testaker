import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Copy, LogOut, Users, BarChart3, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { logout } from '../../services/authService'

const CollegeDashboard = () => {
  const navigate = useNavigate()
  const { collegeData, setUser, setCollegeData } = useAuth()
  const [copying, setCopying] = useState(false)

  const handleCopy = async () => {
    if (collegeData?.collegeId) {
      setCopying(true)
      await navigator.clipboard.writeText(collegeData.collegeId)
      toast.success('College code copied!')
      setTimeout(() => setCopying(false), 1000)
    }
  }

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      setUser(null)
      setCollegeData(null)
      toast.success('Logged out successfully!')
      navigate('/', { replace: true })
    } else {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-primary-50">
      {/* Header with College Info and Logout */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{collegeData?.collegeName || 'College'} Dashboard</h1>
            <p className="text-sm text-gray-500">{collegeData?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 btn-danger"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* College Code Card */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1 uppercase tracking-wide">Your College Code</p>
              <p className="text-4xl font-bold tracking-widest mb-2">{collegeData?.collegeId || 'Loading...'}</p>
              <p className="text-primary-100 text-sm">Share this code with students for registration</p>
            </div>
            <button
              onClick={handleCopy}
              disabled={copying}
              className="flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-medium hover:bg-primary-50 transition-all shadow-md"
            >
              <Copy size={20} />
              {copying ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Tests Taken</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <UserPlus className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card hover:shadow-xl transition-all cursor-pointer border-l-4 border-blue-600">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Register Students</h3>
            <p className="text-gray-600 text-sm mb-4">Add new students to your college database</p>
            <button className="btn-primary">Add Student</button>
          </div>

          <div className="card hover:shadow-xl transition-all cursor-pointer border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View All Students</h3>
            <p className="text-gray-600 text-sm mb-4">See all registered students and their details</p>
            <button className="btn-secondary">View Students</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollegeDashboard
