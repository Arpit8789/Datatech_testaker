import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, GraduationCap } from 'lucide-react'
import toast from 'react-hot-toast'
import { studentLogin } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

const StudentLogin = () => {
  const navigate = useNavigate()
  const { checkUser, setStudentData } = useAuth() // ✅ Added setStudentData
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await studentLogin(formData.email, formData.password)
    
    if (result.success) {
      await checkUser()
      setStudentData(result.student) // ✅ Store student data in context
      toast.success('Login successful!')
      navigate('/student/dashboard', { replace: true })
    } else {
      toast.error(result.error || 'Login failed!')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Login</h1>
          <p className="text-gray-600">Sign in to take tests</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  className="input-field pl-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/student/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up here
              </Link>
            </p>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 block">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentLogin
