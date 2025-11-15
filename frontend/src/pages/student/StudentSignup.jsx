import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Phone, GraduationCap, Building2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases, account } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query, ID } from 'appwrite'
import { studentSignup } from '../../services/authService'

const StudentSignup = () => {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('FORM') // FORM | OTP | SUCCESS
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    collegeId: ''
  })
  const [otp, setOtp] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [invalidAttempts, setInvalidAttempts] = useState(0)
  const [showGeneralOption, setShowGeneralOption] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    account.deleteSessions().catch(() => {});
  }, [])

  useEffect(() => {
    let interval
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(t => t - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const checkCollegeExists = async (collegeId) => {
    if (!collegeId || collegeId.trim() === '') return null
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.colleges,
        [Query.equal('collegeId', collegeId.toUpperCase())]
      )
      return response.documents.length > 0 ? response.documents[0] : null
    } catch (error) {
      console.error('Error checking college:', error)
      return null
    }
  }

  // Phase 1: Handle submission of email to get OTP.
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (formData.collegeId && formData.collegeId.trim() !== '') {
        const college = await checkCollegeExists(formData.collegeId)
        if (!college) {
          const newAttempts = invalidAttempts + 1
          setInvalidAttempts(newAttempts)
          if (newAttempts >= 3) {
            setShowGeneralOption(true)
            toast.error('❌ College code not found!')
          } else {
            toast.error(`❌ Invalid college code. ${3 - newAttempts} attempt(s) left.`)
          }
          setLoading(false)
          return
        }
      }
      await account.deleteSessions().catch(() => {}) // Clear any session before OTP request

      const response = await account.createEmailToken(ID.unique(), formData.email)
      setUserId(response.userId)
      setPhase('OTP')
      setResendTimer(40)
      toast.success('📧 OTP sent to your email! Check inbox/spam.')
    } catch (error) {
      console.error('OTP send error:', error)
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Phase 2: Handle OTP verification and user registration (database records only).
  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await account.deleteSessions().catch(() => {}) // Clear existing sessions before verify
      await account.createSession(userId, otp) // Verify OTP and log in user

      // The user is now logged in; create student document in DB (do NOT create auth user again)
      const studentType = formData.collegeId && formData.collegeId.trim() !== '' ? 'college' : 'general'
      const result = await studentSignup({
        ...formData,
        collegeId: formData.collegeId.trim() || null,
        studentType
      })

      if (result.success) {
        toast.success('✅ Account created successfully!')
        setPhase('SUCCESS')
        setTimeout(() => navigate('/student/login'), 2000)
      } else {
        toast.error(result.error || 'Signup failed!')
      }
    } catch (error) {
      toast.error('❌ Invalid or expired OTP. Please try again.')
      console.error('OTP verification error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP with cooldown and session cleanup
  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setLoading(true)
    try {
      await account.deleteSessions().catch(() => {})
      const response = await account.createEmailToken(ID.unique(), formData.email)
      setUserId(response.userId)
      setResendTimer(40)
      toast.success('📧 New OTP sent!')
    } catch (error) {
      toast.error('Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  // Switch to general registration if invalid college code attempts exhausted
  const registerAsGeneral = () => {
    setFormData({ ...formData, collegeId: '' })
    setInvalidAttempts(0)
    setShowGeneralOption(false)
    toast.success('✅ Switched to General Student registration')
  }

  // UI render
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
          <p className="text-gray-600">
            {phase === 'FORM' ? 'Create your account to access tests' :
              phase === 'OTP' ? 'Verify your email address' :
                'Account created successfully!'}
          </p>
        </div>
        {showGeneralOption && phase === 'FORM' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900 mb-2">Didn't receive a college code?</p>
                <p className="text-xs text-yellow-700 mb-3">No worries! You can register as a general student and access all tests immediately.</p>
                <button
                  onClick={registerAsGeneral}
                  className="btn-primary text-sm py-2 px-4"
                >
                  Register as General Student
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {phase === 'FORM' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    required
                    className="input-field pl-10"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    required
                    className="input-field pl-10"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    required
                    className="input-field pl-10"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="input-field pl-10"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College Code (Optional)</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder="e.g., VFLPDS"
                    value={formData.collegeId}
                    onChange={(e) => setFormData({ ...formData, collegeId: e.target.value.toUpperCase() })}
                  />
                </div>
                {invalidAttempts > 0 && invalidAttempts < 3 && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Invalid college code. {3 - invalidAttempts} attempt(s) remaining.</p>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <p className="text-xs text-blue-900 flex items-start gap-2">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>💡 <strong>Don't have a college code?</strong> No problem! Leave this field blank to register as a <strong>General Student</strong>.</span>
                  </p>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending OTP...' : 'Send OTP →'}
              </button>
            </form>
          )}

          {phase === 'OTP' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Mail className="text-green-600" size={32} />
                </div>
                <p className="text-sm text-gray-600">We've sent a 6-digit code to <strong>{formData.email}</strong></p>
                <p className="text-xs text-gray-500 mt-2">📬 Check your inbox or spam folder</p>
              </div>
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    className="input-field text-center text-2xl font-bold tracking-widest"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full">
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </button>
              </form>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || loading}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
              <button onClick={() => setPhase('FORM')} className="text-sm text-gray-600 hover:text-gray-900 w-full text-center">
                ← Change Email
              </button>
            </div>
          )}

          {phase === 'SUCCESS' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600">Redirecting to login...</p>
            </div>
          )}

          {phase === 'FORM' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/student/login" className="text-green-600 hover:text-green-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentSignup
