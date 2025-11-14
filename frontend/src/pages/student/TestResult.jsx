import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, Mail, Home, Award, CreditCard, BookOpen, TrendingUp } from 'lucide-react'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { useAuth } from '../../context/AuthContext'

const TestResult = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { studentData } = useAuth()
  const [attempt, setAttempt] = useState(null)
  const [test, setTest] = useState(null)
  const [college, setCollege] = useState(null)
  const [generalSettings, setGeneralSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  const isGeneralStudent = !studentData?.collegeId || studentData?.studentType === 'general'

  useEffect(() => {
    fetchResults()
  }, [id])

  const fetchResults = async () => {
    try {
      const attemptDoc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.attempts,
        id
      )
      setAttempt(attemptDoc)

      const testDoc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.tests,
        attemptDoc.testId
      )
      setTest(testDoc)

      // Fetch college or general settings based on student type
      if (!isGeneralStudent) {
        const collegeRes = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.colleges,
          [Query.equal('collegeId', studentData.collegeId)]
        )
        setCollege(collegeRes.documents[0])
      } else {
        const generalRes = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.generalSettings
        )
        setGeneralSettings(generalRes.documents[0] || { scholarshipPercentage: 60 })
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  // Get test domain from test name
  const getTestDomain = () => {
    const testName = test?.testName || ''
    if (testName.toLowerCase().includes('web')) return 'Web Development'
    if (testName.toLowerCase().includes('data')) return 'Data Science'
    return 'DSA & Problem Solving'
  }

  const scholarshipPercentage = isGeneralStudent 
    ? (generalSettings?.scholarshipPercentage || 60)
    : (college?.scholarshipPercentage || 60)

  const isEligible = attempt?.percentage >= scholarshipPercentage
  const domain = getTestDomain()

  // COLLEGE STUDENT VIEW (NO SCORES)
  if (!isGeneralStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
              <CheckCircle className="text-green-600" size={48} />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Test Submitted Successfully! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for completing {test?.testName}
            </p>

            {/* Evaluation Notice */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white mb-6">
              <Mail className="mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-3">
                📧 Results Under Evaluation
              </h3>
              <p className="text-blue-100 text-lg mb-2">
                Our team is carefully reviewing your test submission.
              </p>
              <p className="text-blue-100 mb-4">
                You will receive a detailed performance report via email within <span className="font-bold">24-48 hours</span>.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/student/dashboard')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Home size={20} />
                Back to Dashboard
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Test submitted on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // GENERAL STUDENT VIEW (SHOW SCORES + COURSE OFFER)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <CheckCircle className="text-blue-600" size={48} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Test Completed! 🎉
            </h1>
            <p className="text-gray-600">{test?.testName}</p>
          </div>

          {/* Score Display */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 mb-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-gray-600 text-sm mb-2">Your Score</p>
                <p className="text-4xl font-bold text-gray-900">{attempt?.score}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Percentage</p>
                <p className={`text-4xl font-bold ${isEligible ? 'text-green-600' : 'text-orange-600'}`}>
                  {Math.round(attempt?.percentage)}%
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Scholarship Cutoff: <span className="font-bold text-gray-900">{scholarshipPercentage}%</span>
              </p>
            </div>
          </div>

          {/* ELIGIBLE - Show Technical Test Access */}
          {isEligible ? (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 text-center mb-6">
              <Award className="mx-auto mb-4" size={56} />
              <h2 className="text-3xl font-bold mb-4">
                🎉 Congratulations!
              </h2>
              <p className="text-lg text-green-100 mb-6">
                You've scored above {scholarshipPercentage}% and are now <strong>eligible for scholarship!</strong>
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-3">✅ You've Unlocked:</h3>
                <ul className="text-left space-y-2 text-green-50">
                  <li>• Access to Technical {domain} Tests</li>
                  <li>• Advanced interview questions</li>
                  <li>• Industry-level project scenarios</li>
                  <li>• Mock technical interviews</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="bg-white text-green-600 font-bold py-3 px-8 rounded-xl hover:bg-green-50 transition-all"
              >
                Proceed to Technical Tests →
              </button>
            </div>
          ) : (
            /* NOT ELIGIBLE - Course Sales Pitch */
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-8 mb-6">
              <div className="text-center mb-6">
                <TrendingUp className="mx-auto mb-4" size={56} />
                <h2 className="text-3xl font-bold mb-3">
                  💪 Keep Going!
                </h2>
                <p className="text-lg text-orange-100 mb-2">
                  You scored {Math.round(attempt?.percentage)}% in {domain}
                </p>
                <p className="text-orange-100 text-sm">
                  Just {scholarshipPercentage - Math.round(attempt?.percentage)}% more to unlock scholarship!
                </p>
              </div>

              {/* Course Offer */}
              <div className="bg-white text-gray-900 rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  🚀 Want to Ace Technical Interviews?
                </h3>
                <p className="text-gray-700 mb-6 text-center">
                  Join our <strong>20-Day {domain} Crash Course</strong> designed to help you master technical concepts and crack interviews!
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                  <h4 className="font-bold text-lg mb-3 text-gray-900">✨ What You'll Get:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                      <span><strong>Full Access</strong> to Technical {domain} Tests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                      <span><strong>20 Days</strong> of Structured Learning with Daily Tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                      <span><strong>Industry-Ready Projects</strong> for your portfolio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                      <span><strong>Mock Interviews</strong> with real-time feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                      <span><strong>Placement Assistance</strong> & Resume Building</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                      <span><strong>Lifetime Access</strong> to all course materials</span>
                    </li>
                  </ul>
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 text-center mb-4">
                  <p className="text-sm mb-2">Limited Time Offer</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl line-through opacity-70">₹2,999</span>
                    <span className="text-5xl font-bold">₹949</span>
                  </div>
                  <p className="text-green-100 text-sm mt-2">🎯 Save 68% Today!</p>
                </div>

                <button
                  onClick={() => navigate(`/student/payment/${attempt.$id}`)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <CreditCard size={20} />
                  Enroll Now & Unlock Technical Tests
                </button>

                <p className="text-center text-xs text-gray-500 mt-3">
                  🔒 100% Secure Payment • Instant Access
                </p>
              </div>

              <p className="text-center text-white text-sm opacity-90">
                ⚡ Join <strong>500+ students</strong> who've already enrolled and improved their skills!
              </p>
            </div>
          )}

          {/* Back to Dashboard */}
          <button
            onClick={() => navigate('/student/dashboard')}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestResult
