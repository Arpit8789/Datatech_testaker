import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, BookOpen, Clock, TrendingUp, Award, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { logout } from '../../services/authService'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query } from 'appwrite'

const StudentDashboard = () => {
  const navigate = useNavigate()
  const { studentData, setUser, setStudentData } = useAuth()
  const [tests, setTests] = useState([])
  const [attempts, setAttempts] = useState([])
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (studentData?.$id) {
      fetchData()
    }
  }, [studentData])

  const fetchData = async () => {
    try {
      const [testsRes, attemptsRes, collegeRes] = await Promise.all([
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.tests),
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.attempts,
          [Query.equal('studentId', studentData.$id)]
        ),
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.colleges,
          [Query.equal('collegeId', studentData.collegeId)]
        )
      ])

      setTests(testsRes.documents)
      setAttempts(attemptsRes.documents)
      setCollege(collegeRes.documents[0] || null)
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
      setStudentData(null)
      toast.success('Logged out successfully!')
      navigate('/', { replace: true })
    }
  }

  const handleTakeTest = (testId) => {
    navigate(`/student/test/${testId}`)
  }

  // ✅ Check if payment is required for an attempt
  const shouldShowPayButton = (attempt) => {
    if (!college) return false
    
    // Admin must enable payment for college
    if (!college.payNowEnabled) return false
    
    // Student must score below scholarship cutoff
    if (attempt.percentage >= college.scholarshipPercentage) return false
    
    // Payment not already done
    if (attempt.paymentStatus === 'paid') return false
    
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {studentData?.name || 'Student'}!
            </h1>
            <p className="text-sm text-gray-500">{studentData?.email}</p>
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
                <p className="text-gray-500 text-sm">Available Tests</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : tests.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : attempts.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Award className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
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
                <TrendingUp className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Payment</p>
                <p className="text-3xl font-bold text-gray-900">
                  {attempts.filter(a => shouldShowPayButton(a)).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <CreditCard className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Available Tests */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Tests</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : tests.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No tests available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => {
                const hasAttempted = attempts.some(a => a.testId === test.$id)
                
                return (
                  <div
                    key={test.$id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <BookOpen className="text-primary-600" size={24} />
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        hasAttempted ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {hasAttempted ? 'Completed' : 'Available'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{test.testName}</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2" />
                        Duration: {test.duration} minutes
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen size={16} className="mr-2" />
                        Questions: {test.totalQuestions}
                      </div>
                    </div>

                    <button
                      onClick={() => handleTakeTest(test.$id)}
                      disabled={hasAttempted}
                      className={`w-full ${hasAttempted ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}
                    >
                      {hasAttempted ? 'Already Taken' : 'Start Test'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Test History with Payment */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Test History</h2>

          {attempts.length === 0 ? (
            <div className="text-center py-12">
              <Award className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No test history</p>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt) => {
                const test = tests.find(t => t.$id === attempt.testId)
                const showPayButton = shouldShowPayButton(attempt)

                return (
                  <div key={attempt.$id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{test?.testName || 'Unknown Test'}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Score:</span>
                            <span className="ml-2 font-bold text-gray-900">{attempt.score}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Percentage:</span>
                            <span className={`ml-2 font-bold ${
                              attempt.percentage >= 60 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {Math.round(attempt.percentage)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Status:</span>
                            <span className="ml-2 font-medium capitalize">{attempt.status}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Payment:</span>
                            <span className={`ml-2 font-medium ${
                              attempt.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {attempt.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ✅ Show Pay Now Button based on logic */}
                      {showPayButton && (
                        <button
                          onClick={() => navigate(`/student/payment/${attempt.$id}`)}
                          className="btn-primary flex items-center gap-2 whitespace-nowrap"
                        >
                          <CreditCard size={18} />
                          Pay Now
                        </button>
                      )}

                      {/* Show message if payment not enabled */}
                      {!college?.payNowEnabled && attempt.paymentStatus === 'pending' && (
                        <div className="text-sm text-gray-500 italic">
                          Payment option not enabled yet
                        </div>
                      )}

                      {/* Show scholarship eligible message */}
                      {attempt.percentage >= (college?.scholarshipPercentage || 60) && attempt.paymentStatus === 'pending' && (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <Award size={18} />
                          Scholarship Eligible
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
