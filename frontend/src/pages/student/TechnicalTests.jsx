import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Lock, CheckCircle, ArrowLeft, Bell, BookOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query } from 'appwrite'

const TechnicalTests = () => {
  const navigate = useNavigate()
  const { studentData } = useAuth()
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [accessReason, setAccessReason] = useState('')

  const isGeneralStudent = !studentData?.collegeId || studentData?.studentType === 'general'

  useEffect(() => {
    checkAccess()
  }, [studentData])

  const checkAccess = async () => {
    try {
      // Fetch student's attempts
      const attemptsRes = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.attempts,
        [Query.equal('studentId', studentData.$id)]
      )

      const attempts = attemptsRes.documents

      if (attempts.length === 0) {
        setHasAccess(false)
        setAccessReason('no_attempts')
        setLoading(false)
        return
      }

      // Get scholarship percentage
      let scholarshipPercentage = 60
      if (!isGeneralStudent) {
        const collegeRes = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.colleges,
          [Query.equal('collegeId', studentData.collegeId)]
        )
        scholarshipPercentage = collegeRes.documents[0]?.scholarshipPercentage || 60
      } else {
        const generalRes = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.generalSettings
        )
        scholarshipPercentage = generalRes.documents[0]?.scholarshipPercentage || 60
      }

      // Check if eligible (scholarship OR payment done)
      const hasEligibility = attempts.some(a => a.percentage >= scholarshipPercentage)
      const hasPaid = attempts.some(a => a.paymentStatus === 'paid')

      if (hasEligibility || hasPaid) {
        setHasAccess(true)
        setAccessReason('eligible')
      } else {
        setHasAccess(false)
        setAccessReason('not_eligible')
      }
    } catch (error) {
      console.error('Error checking access:', error)
      setHasAccess(false)
      setAccessReason('error')
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

  // ACCESS GRANTED - Show placeholder
  if (hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container-custom flex items-center gap-4 py-4">
            <button onClick={() => navigate('/student/dashboard')} className="btn-secondary">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Technical Tests</h1>
              <p className="text-sm text-gray-500">Advanced technical assessment tests</p>
            </div>
          </div>
        </div>

        <div className="container-custom py-12 flex items-center justify-center min-h-[70vh]">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-6 animate-pulse">
              <Bell className="text-white" size={48} />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technical Tests Coming Soon! 🚀
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              You will be notified via email when your technical internship tests are available.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What to Expect:</h3>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Advanced technical questions based on your domain</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Real-world problem-solving scenarios</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Industry-standard coding challenges</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Comprehensive performance feedback</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                📧 Check your email regularly for test availability notifications
              </p>
            </div>

            <button
              onClick={() => navigate('/student/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ACCESS DENIED - Show locked state
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex items-center gap-4 py-4">
          <button onClick={() => navigate('/student/dashboard')} className="btn-secondary">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Technical Tests</h1>
            <p className="text-sm text-gray-500">Advanced technical assessment tests</p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <Lock className="text-red-600" size={48} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Technical Tests Locked 🔒
          </h2>

          {accessReason === 'no_attempts' && (
            <>
              <p className="text-lg text-gray-600 mb-8">
                You need to complete at least one general test first!
              </p>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="btn-primary flex items-center justify-center gap-2 mx-auto"
              >
                <BookOpen size={20} />
                Go to General Tests
              </button>
            </>
          )}

          {accessReason === 'not_eligible' && (
            <>
              <p className="text-lg text-gray-600 mb-8">
                To unlock technical tests, you need to either:
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8 text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Unlock Options:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Score above scholarship cutoff</p>
                      <p className="text-sm text-gray-600">Get eligible for scholarship by scoring high</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Complete payment of ₹949</p>
                      <p className="text-sm text-gray-600">Get instant access to all technical tests</p>
                    </div>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="btn-primary"
              >
                Back to Dashboard
              </button>
            </>
          )}

          {accessReason === 'error' && (
            <>
              <p className="text-lg text-gray-600 mb-8">
                Something went wrong. Please try again later.
              </p>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="btn-secondary"
              >
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TechnicalTests
