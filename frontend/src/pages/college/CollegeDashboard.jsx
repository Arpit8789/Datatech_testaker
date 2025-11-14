import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, Users, BookOpen, Award, TrendingUp, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { logout } from '../../services/authService'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query } from 'appwrite'

const CollegeDashboard = () => {
  const navigate = useNavigate()
  const { collegeData, setUser, setCollegeData } = useAuth()
  const [students, setStudents] = useState([])
  const [attempts, setAttempts] = useState([])
  const [tests, setTests] = useState([])
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (collegeData?.$id) {
      fetchData()
    }
  }, [collegeData])

  const fetchData = async () => {
    try {
      // Fetch full college document
      const collegeDoc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.colleges,
        collegeData.$id
      )
      setCollege(collegeDoc)

      const [studentsRes, attemptsRes, testsRes] = await Promise.all([
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.students,
          [Query.equal('collegeId', collegeDoc.collegeId)]
        ),
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.attempts,
          [Query.equal('collegeId', collegeDoc.collegeId)]
        ),
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.tests)
      ])

      setStudents(studentsRes.documents)
      setAttempts(attemptsRes.documents)
      setTests(testsRes.documents)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      setUser(null)
      setCollegeData(null)
      toast.success('Logged out successfully!')
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {college?.collegeName || 'College Dashboard'}
            </h1>
            <p className="text-sm text-gray-500">College ID: {college?.collegeId}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 btn-danger">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : students.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Test Attempts</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : attempts.length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BookOpen className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Available Tests</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : tests.length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Award className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          {/* ✅ UPDATED: Total Students Placed (instead of Average Score) */}
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Students Placed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : college?.totalStudentPlaced || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Contact admin to update</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate('/college/students')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-8 hover:shadow-2xl transition-all group text-left"
          >
            <Users className="mb-4 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-2xl font-bold mb-2">View All Students</h3>
            <p className="text-blue-100">See registered students and their performance</p>
          </button>

          {/* ✅ NEW: Create Your Own Test Card */}
          <div className="relative group">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-8 hover:shadow-2xl transition-all cursor-pointer">
              <BookOpen className="mb-4 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-2xl font-bold mb-2">Create Your Own Test</h3>
              <p className="text-purple-100">Custom tests for your college students</p>
              <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                Premium
              </span>
            </div>

            {/* ✅ Hover Tooltip */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl p-8 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center text-center">
              <Award className="mb-4" size={48} />
              <h4 className="text-xl font-bold mb-3">Want Custom Tests?</h4>
              <p className="text-purple-100 mb-4">
                Create personalized tests tailored for your college students!
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">📞 Contact Admin:</p>
                <div className="flex items-center justify-center gap-2 text-lg font-bold">
                  <Phone size={20} />
                  <a href="tel:9927460199" className="hover:underline">
                    9927460199
                  </a>
                </div>
              </div>
              <p className="text-xs text-purple-200">
                🎓 Premium Feature - Subscription Required
              </p>
            </div>
          </div>
        </div>

        {/* Recent Students Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Registered Students</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No students registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 10).map((student) => (
                    <tr key={student.$id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{student.name}</td>
                      <td className="py-3 px-4 text-gray-600">{student.email}</td>
                      <td className="py-3 px-4 text-gray-600">{student.phone}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(student.$createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length > 10 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => navigate('/college/students')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All {students.length} Students →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollegeDashboard
