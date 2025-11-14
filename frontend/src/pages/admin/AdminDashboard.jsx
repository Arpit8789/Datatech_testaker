import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users, BookOpen, CreditCard, LogOut, TrendingUp, Award } from 'lucide-react'
import toast from 'react-hot-toast'
import { logout } from '../../services/authService'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { useAuth } from '../../context/AuthContext'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [stats, setStats] = useState({
    colleges: 0,
    students: 0,
    tests: 0,
    attempts: 0,
    totalRevenue: 0
  })
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [collegesRes, studentsRes, testsRes, attemptsRes] = await Promise.all([
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.colleges),
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.students),
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.tests),
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.attempts)
      ])

      setColleges(collegesRes.documents)
      setStats({
        colleges: collegesRes.total,
        students: studentsRes.total,
        tests: testsRes.total,
        attempts: attemptsRes.total,
        totalRevenue: 0 // Calculate from payments later
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      setUser(null)
      toast.success('Logged out successfully!')
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex justify-between items-center py-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Datatech Test Platform Management</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 btn-danger">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Colleges</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : stats.colleges}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Building2 className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : stats.students}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Tests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : stats.tests}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BookOpen className="text-purple-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Test Attempts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : stats.attempts}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrendingUp className="text-yellow-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/admin/tests')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-2xl transition-all group"
          >
            <BookOpen className="mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-bold mb-2">Manage Tests</h3>
            <p className="text-blue-100 text-sm">Create, edit, and delete tests</p>
          </button>

          <button
            onClick={() => navigate('/admin/marks')}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 hover:shadow-2xl transition-all group"
          >
            <Award className="mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-bold mb-2">View All Marks</h3>
            <p className="text-green-100 text-sm">Student performance analytics</p>
          </button>


          <button
    onClick={() => navigate('/admin/scholarship')}
    className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-xl p-6 hover:shadow-2xl transition-all group"
  >
    <Award className="mb-3 group-hover:scale-110 transition-transform" size={32} />
    <h3 className="text-xl font-bold mb-2">Scholarship Management</h3>
    <p className="text-yellow-100 text-sm">Set cutoffs & enable payments</p>
  </button>
          <button
            onClick={() => navigate('/admin/payments')}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-2xl transition-all group"
          >
            <CreditCard className="mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-bold mb-2">Payment Management</h3>
            <p className="text-purple-100 text-sm">Track payments and revenue</p>
          </button>
        </div>

        {/* Colleges List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Registered Colleges</h2>
            <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg font-medium">
              {colleges.length} Colleges
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500">No colleges registered yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college) => (
                <div
                  key={college.$id}
                  onClick={() => navigate(`/admin/colleges/${college.$id}`)}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition-colors">
                      <Building2 className="text-blue-600 group-hover:text-white" size={24} />
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{college.collegeName}</h3>
                  <p className="text-sm text-gray-600 mb-1">Code: {college.collegeId}</p>
                  <p className="text-sm text-gray-600 mb-3">{college.email}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Scholarship: {college.scholarshipPercentage}%</span>
                    <span className="text-primary-600 font-medium">View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
