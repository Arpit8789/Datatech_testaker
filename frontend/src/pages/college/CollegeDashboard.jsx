import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Copy, LogOut, Users, BookOpen, TrendingUp, Award } from 'lucide-react'
import toast from 'react-hot-toast'
import { logout } from '../../services/authService'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query } from 'appwrite'

const CollegeDashboard = () => {
  const navigate = useNavigate()
  const { collegeData, setUser, setCollegeData } = useAuth()
  const [copying, setCopying] = useState(false)
  const [students, setStudents] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (collegeData?.collegeId) {
      fetchStudentsAndAttempts()
    }
  }, [collegeData])

  const fetchStudentsAndAttempts = async () => {
    try {
      // Fetch students with this college ID
      const studentsResponse = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.students,
        [Query.equal('collegeId', collegeData.collegeId)]
      )
      setStudents(studentsResponse.documents)

      // Fetch test attempts for this college
      const attemptsResponse = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.attempts,
        [Query.equal('collegeId', collegeData.collegeId)]
      )
      setAttempts(attemptsResponse.documents)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

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
      {/* Header */}
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
          <div className="card hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <BookOpen className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Tests Taken</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : attempts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Award className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : attempts.length > 0 
                    ? Math.round(attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / attempts.length) + '%'
                    : '0%'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Students & Attempts Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Test Attempts</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading data...</p>
            </div>
          ) : attempts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No test attempts yet</p>
              <p className="text-gray-400 text-sm mt-2">Students will appear here after taking tests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Student ID</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Test ID</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Score</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Percentage</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <tr key={attempt.$id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {attempt.studentId.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {attempt.testId.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {attempt.score || 0}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          (attempt.percentage || 0) >= 60 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.round(attempt.percentage || 0)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          attempt.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {attempt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(attempt.$createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Registered Students Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Students</h2>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No students registered yet</p>
              <p className="text-gray-400 text-sm mt-2">Students will appear here after signing up with your college code</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <div key={student.$id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <p className="font-semibold text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <p className="text-xs text-gray-500 mt-2">Phone: {student.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollegeDashboard
