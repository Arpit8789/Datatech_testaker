import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Building2, Mail, Lock, Phone, MapPin, Hash } from 'lucide-react'
import toast from 'react-hot-toast'
import { collegeSignup } from '../../services/authService'
import { generateUniqueCollegeId } from '../../services/collegeService'
import { validateEmail, validatePhone, validatePassword } from '../../utils/validators'

const CollegeSignup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    collegeName: '',
    collegeId: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [generatingId, setGeneratingId] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
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

    const result = await collegeSignup(formData)

    if (result.success) {
      toast.success('Registration successful! Please verify your email.')
      navigate('/college/login')
    } else {
      toast.error(result.error || 'Registration failed')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Building2 className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">College Registration</h1>
          <p className="text-gray-600">Create your college account</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* College Name */}
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

              {/* College ID */}
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

              {/* Email */}
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

              {/* Phone */}
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

              {/* Address */}
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

              {/* Password */}
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

              {/* Confirm Password */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/college/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollegeSignup