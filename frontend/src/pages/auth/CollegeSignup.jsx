import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Building2, Mail, Lock, Phone, MapPin, Hash } from 'lucide-react'
import toast from 'react-hot-toast'
import { account } from '../../config/appwrite'
import { collegeSignup } from '../../services/authService'
import { generateUniqueCollegeId } from '../../services/collegeService'
import { validateEmail, validatePhone, validatePassword } from '../../utils/validators'
import { ID } from 'appwrite'

const CollegeSignup = () => {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('FORM')
  const [formData, setFormData] = useState({
    collegeName: '',
    collegeId: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  })
  const [otp, setOtp] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatingId, setGeneratingId] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // On mount, clear all possible sessions
  useEffect(() => {
    account.deleteSessions().catch(() => {});
  }, []);

  useEffect(() => {
    let interval
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleGenerateCollegeId = async () => {
    setGeneratingId(true)
    try {
      const collegeId = await generateUniqueCollegeId()
      setFormData({ ...formData, collegeId })
      toast.success('College ID generated!')
    } catch (error) {
      toast.error('Failed to generate College ID')
    }
    setGeneratingId(false)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!validateEmail(formData.email)) {
      toast.error('Invalid email address')
      return
    }
    if (!validatePhone(formData.phone)) {
      toast.error('Invalid phone number')
      return
    }
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (!formData.collegeId) {
      toast.error('Please generate a College ID')
      return
    }

    setLoading(true)

    try {
      // Always delete all prior sessions before starting new OTP flow!
      await account.deleteSessions().catch(() => {})

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

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // THIS IS THE MAIN FIX—delete all sessions before OTP session
      await account.deleteSessions().catch(() => {});

      // Create session with OTP
      const session = await account.createSession(userId, otp);

      // Update user profile name
      await account.updateName(formData.collegeName);

      // Save college data in backend
      await collegeSignup({
        userId,
        ...formData,
      });

      toast.success('Account created successfully!');
      setPhase('SUCCESS');
      setTimeout(() => navigate('/college/login'), 1500);

    } catch (error) {
      toast.error('❌ Invalid or expired OTP');
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setLoading(true)
    try {
      await account.deleteSessions().catch(() => {});
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Building2 className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">College Registration</h1>
          <p className="text-gray-600">
            {phase === 'FORM' ? 'Create your college account' :
              phase === 'OTP' ? 'Verify your email address' :
                'Registration successful!'}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* FORM PHASE */}
          {phase === 'FORM' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      required
                      className="input-field pl-10"
                      placeholder="Enter college name"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College ID
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        required
                        readOnly
                        className="input-field pl-10 bg-gray-50"
                        placeholder="Click generate"
                        value={formData.collegeId}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateCollegeId}
                      disabled={generatingId}
                      className="btn-secondary whitespace-nowrap"
                    >
                      {generatingId ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      required
                      className="input-field pl-10"
                      placeholder="college@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                    <textarea
                      required
                      rows={3}
                      className="input-field pl-10"
                      placeholder="Enter college address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      required
                      className="input-field pl-10"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      required
                      className="input-field pl-10"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Sending OTP...' : 'Send OTP →'}
              </button>
            </form>
          )}

          {/* OTP PHASE */}
          {phase === 'OTP' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Mail className="text-blue-600" size={32} />
                </div>
                <p className="text-sm text-gray-600">
                  We've sent a 6-digit code to <strong>{formData.email}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  📬 Check your inbox or spam folder
                </p>
              </div>
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
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
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="btn-primary w-full"
                >
                  {loading ? 'Verifying...' : 'Verify & Register'}
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
              <button
                onClick={() => setPhase('FORM')}
                className="text-sm text-gray-600 hover:text-gray-900 w-full text-center"
              >
                ← Change Email
              </button>
            </div>
          )}

          {/* SUCCESS PHASE */}
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
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/college/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default CollegeSignup
