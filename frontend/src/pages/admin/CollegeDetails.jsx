import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Building2, Users, Award, CreditCard, ArrowLeft, Edit } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query } from 'appwrite'

const CollegeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [college, setCollege] = useState(null)
  const [students, setStudents] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollegeData()
  }, [id])

  const fetchCollegeData = async () => {
    try {
      const collegeDoc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.colleges,
        id
      )
      setCollege(collegeDoc)

      const [studentsRes, attemptsRes] = await Promise.all([
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.students,
          [Query.equal('collegeId', collegeDoc.collegeId)]
        ),
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.attempts,
          [Query.equal('collegeId', collegeDoc.collegeId)]
        )
      ])

      setStudents(studentsRes.documents)
      setAttempts(attemptsRes.documents)
    } catch (error) {
      console.error('Error fetching college data:', error)
      toast.error('Failed to load college details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{college?.collegeName}</h1>
              <p className="text-sm text-gray-500">College ID: {college?.collegeId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* College Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">College Name</h3>
              <p className="text-xl font-bold text-gray-900">{college?.collegeName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">College Code</h3>
              <p className="text-xl font-bold text-primary-600">{college?.collegeId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-lg text-gray-900">{college?.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
              <p className="text-lg text-gray-900">{college?.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
              <p className="text-lg text-gray-900">{college?.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Scholarship Percentage</h3>
              <p className="text-xl font-bold text-green-600">{college?.scholarshipPercentage}%</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{students.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Test Attempts</p>
                <p className="text-3xl font-bold text-gray-900">{attempts.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Award className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {attempts.length > 0
                    ? Math.round(attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / attempts.length)
                    : 0}%
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CreditCard className="text-yellow-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Students</h2>
          {students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500">No students registered</p>
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
                  {students.map((student) => (
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
            </div>
          )}
        </div>

        {/* Test Attempts Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Attempts</h2>
          {attempts.length === 0 ? (
            <div className="text-center py-12">
              <Award className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500">No test attempts yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Percentage</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <tr key={attempt.$id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-mono text-xs">
                        {attempt.studentId.substring(0, 12)}...
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{attempt.score}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${
                          attempt.percentage >= 60 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.round(attempt.percentage)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
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
      </div>
    </div>
  )
}

export default CollegeDetails
