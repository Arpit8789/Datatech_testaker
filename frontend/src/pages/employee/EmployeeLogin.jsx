import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Lock, Mail, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query } from 'appwrite'

const EmployeeLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Fetch employee by email
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.employees,
        [Query.equal('email', formData.email)]
      )

      if (response.documents.length === 0) {
        toast.error('Invalid email or password')
        setLoading(false)
        return
      }

      const employee = response.documents[0]

      // Plain text password comparison
      if (formData.password !== employee.password) {
        toast.error('Invalid email or password')
        setLoading(false)
        return
      }

      if (!employee.isActive) {
        toast.error('Your account has been deactivated. Contact admin.')
        setLoading(false)
        return
      }

      // Store employee data
      localStorage.setItem('employeeData', JSON.stringify({
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        email: employee.email,
        role: 'employee'
      }))

      toast.success(`Welcome, ${employee.firstName}!`)
      navigate('/employee/dashboard')
    } catch (error) {
      console.error('Employee login error:', error)
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-purple-100 p-4 rounded-full">
              <Briefcase className="text-purple-600" size={40} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Employee Portal
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Sales Team Login
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  className="input-field pl-12"
                  placeholder="your-email@example.com"
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
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  className="input-field pl-12"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Need access? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmployeeLogin
