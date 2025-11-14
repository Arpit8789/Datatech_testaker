import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, BookOpen, Clock, TrendingUp, Award, CreditCard, Lock, Calendar } from 'lucide-react'
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
  const [generalSettings, setGeneralSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  const isGeneralStudent = !studentData?.collegeId || studentData?.studentType === 'general'

  useEffect(() => {
    if (studentData?.$id) {
      fetchData()
    }
  }, [studentData])

  const fetchData = async () => {
    try {
      const [testsRes, attemptsRes] = await Promise.all([
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.tests),
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.attempts,
          [Query.equal('studentId', studentData.$id)]
        )
      ])

      setTests(testsRes.documents)
      setAttempts(attemptsRes.documents)

      // Fetch college data if college student
      if (!isGeneralStudent) {
        const collegeRes = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.colleges,
          [Query.equal('collegeId', studentData.collegeId)]
        )
        setCollege(collegeRes.documents[0] || null)
      } else {
        // Fetch general settings for scholarship percentage
        const generalRes = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.generalSettings
        )
        setGeneralSettings(generalRes.documents[0] || { scholarshipPercentage: 60 })
      }
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

  // Check test availability based on timing (ONLY for college students)
  const getTestAvailability = (test) => {
    // General students: Always available
    if (isGeneralStudent) {
      return { available: true, message: null }
    }

    // College students: Check timing
    if (!college || !college.testStartTime) {
      return { available: true, message: null }
    }

    const now = new Date()
    const start = new Date(college.testStartTime)
    const end = new Date(college.testEndTime)

    // Before start time
    if (now < start) {
      return {
        available: false,
        locked: true,
        message: `🔒 Test starts on ${start.toLocaleString('en-IN', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        })}`
      }
    }

    // After end time (still available)
    if (now > end) {
      return {
        available: true,
        message: `✅ Test available (window ended)`
      }
    }

    // During window
    return {
      available: true,
      message: `✅ Test ends on ${end.toLocaleString('en-IN', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      })}`
    }
  }

  const handleTakeTest = (testId) => {
    navigate(`/student/test/${testId}`)
  }

  const getScholarshipPercentage = () => {
    if (isGeneralStudent) {
      return generalSettings?.scholarshipPercentage || 60
    }
    return college?.scholarshipPercentage || 60
  }

  const shouldShowPayButton = (attempt) => {
    const scholarshipCutoff = getScholarshipPercentage()
    
    // General students: Always show pay button if not eligible and not paid
    if (isGeneralStudent) {
      return attempt.percentage < scholarshipCutoff && attempt.paymentStatus !== 'paid'
    }

    // College students: Check if payment is enabled by admin
    if (!college?.payNowEnabled) return false
    
    return attempt.percentage < scholarshipCutoff && attempt.paymentStatus !== 'paid'
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
            <p className="text-sm text-gray-500">
              {isGeneralStudent ? (
                <span className="inline-flex items-center gap-1">
                  <Award size={14} className="text-green-600" />
                  General Student
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <BookOpen size={14} className="text-blue-600" />
                  {college?.collegeName || 'College Student'}
                </span>
              )}
            </p>
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
                <p className="text-gray-500 text-sm">Scholarship Cutoff</p>
                <p className="text-3xl font-bold text-gray-900">
                  {getScholarshipPercentage()}%
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

        {/* Test Timing Info for College Students */}
        {!isGeneralStudent && college?.testStartTime && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 mb-8 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <Calendar size={24} />
              <h3 className="text-xl font-bold">Test Availability Window</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-blue-100 text-sm">Starts At</p>
                <p className="text-lg font-semibold">
                  {new Date(college.testStartTime).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Ends At</p>
                <p className="text-lg font-semibold">
                  {new Date(college.testEndTime).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

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
                const availability = getTestAvailability(test)
                const isLocked = !availability.available && availability.locked

                return (
                  <div
                    key={test.$id}
                    className={`border rounded-xl p-6 transition-all ${
                      isLocked ? 'border-gray-300 bg-gray-50' : 'border-gray-200 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${
                        isLocked ? 'bg-gray-200' : 'bg-primary-100'
                      }`}>
                        {isLocked ? (
                          <Lock className="text-gray-500" size={24} />
                        ) : (
                          <BookOpen className="text-primary-600" size={24} />
                        )}
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        hasAttempted 
                          ? 'bg-gray-100 text-gray-700' 
                          : isLocked
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {hasAttempted ? 'Completed' : isLocked ? 'Locked' : 'Available'}
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
                      {availability.message && (
                        <div className={`flex items-center text-xs ${
                          isLocked ? 'text-red-600' : 'text-green-600'
                        } font-medium mt-2`}>
                          {availability.message}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleTakeTest(test.$id)}
                      disabled={hasAttempted || isLocked}
                      className={`w-full ${
                        hasAttempted || isLocked
                          ? 'btn-secondary opacity-50 cursor-not-allowed' 
                          : 'btn-primary'
                      }`}
                    >
                      {hasAttempted ? 'Already Taken' : isLocked ? 'Locked' : 'Start Test'}
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
                const scholarshipCutoff = getScholarshipPercentage()
                const isEligible = attempt.percentage >= scholarshipCutoff

                return (
                  <div key={attempt.$id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{test?.testName || 'Unknown Test'}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {isGeneralStudent ? (
                            <>
                              <div>
                                <span className="text-gray-500">Score:</span>
                                <span className="ml-2 font-bold text-gray-900">{attempt.score}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Percentage:</span>
                                <span className={`ml-2 font-bold ${
                                  isEligible ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {Math.round(attempt.percentage)}%
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="col-span-2">
                              <span className="text-gray-500">Status:</span>
                              <span className="ml-2 font-medium text-blue-600">
                                ✅ Test Submitted Successfully
                              </span>
                            </div>
                          )}
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

                      {/* Payment Button */}
                      {showPayButton && (
                        <button
                          onClick={() => navigate(`/student/payment/${attempt.$id}`)}
                          className="btn-primary flex items-center gap-2 whitespace-nowrap"
                        >
                          <CreditCard size={18} />
                          Pay ₹949
                        </button>
                      )}

                      {/* Scholarship Eligible Badge */}
                      {isGeneralStudent && isEligible && attempt.paymentStatus !== 'paid' && (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-4 py-2 rounded-lg">
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
