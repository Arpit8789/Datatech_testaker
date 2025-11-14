import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Phone, GraduationCap, Building2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { studentSignup } from '../../services/authService'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query } from 'appwrite'

const StudentSignup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    collegeId: ''
  })
  const [loading, setLoading] = useState(false)
  const [invalidAttempts, setInvalidAttempts] = useState(0)
  const [showGeneralOption, setShowGeneralOption] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate college ID if provided
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

      // Determine student type
      const studentType = formData.collegeId && formData.collegeId.trim() !== '' ? 'college' : 'general'

      // Create account
      const result = await studentSignup({
        ...formData,
        collegeId: formData.collegeId.trim() || null,
        studentType: studentType
      })

      if (result.success) {
        toast.success('✅ Account created successfully!')
        navigate('/student/login')
      } else {
        toast.error(result.error || 'Signup failed!')
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const registerAsGeneral = () => {
    setFormData({ ...formData, collegeId: '' })
    setInvalidAttempts(0)
    setShowGeneralOption(false)
    toast.success('✅ Switched to General Student registration')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
          <p className="text-gray-600">Create your account to access tests</p>
        </div>

        {/* General Student Option Banner */}
        {showGeneralOption && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900 mb-2">
                  Didn't receive a college code?
                </p>
                <p className="text-xs text-yellow-700 mb-3">
                  No worries! You can register as a general student and access all tests immediately.
                </p>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College Code (Optional)
              </label>
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
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ Invalid college code. {3 - invalidAttempts} attempt(s) remaining.
                </p>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <p className="text-xs text-blue-900 flex items-start gap-2">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>
                    💡 <strong>Don't have a college code?</strong> No problem! Leave this field blank to register as a <strong>General Student</strong> and access all tests immediately without any restrictions.
                  </span>
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/student/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentSignup
