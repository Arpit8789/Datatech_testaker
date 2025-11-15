import { useState } from 'react'
import { databases } from '../../config/appwrite'
import { ID } from 'appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import toast from 'react-hot-toast'
import { User, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CreateEmployee = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.employees,
        ID.unique(),
        {
          employeeId: `EMP${Date.now()}`,
          firstName: formData.firstName,
          email: formData.email,
          password: formData.password,
          isActive: true
        }
      )

      toast.success('Employee created successfully!')
      
      // Show credentials in a custom toast with longer duration
      toast.success(`Credentials: ${formData.email} / ${formData.password}`, {
        duration: 6000,
        icon: '🔑'
      })

      setFormData({ firstName: '', email: '', password: '' })
      
      // Redirect to employee performance page after 2 seconds
      setTimeout(() => {
        navigate('/admin/employee-performance')
      }, 2000)

    } catch (error) {
      console.error('Error creating employee:', error)
      if (error.message.includes('unique')) {
        toast.error('Email already exists')
      } else {
        toast.error('Failed to create employee')
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="container mx-auto max-w-2xl">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-lg">
              <UserPlus className="text-purple-600" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Register Employee</h2>
              <p className="text-sm text-gray-600">Add new sales team member</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  className="input-field pl-12"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  className="input-field pl-12"
                  placeholder="employee@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  minLength={4}
                  className="input-field pl-12"
                  placeholder="Min 4 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Password will be stored as plain text</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg"
            >
              {loading ? 'Creating...' : 'Create Employee Account'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              ℹ️ Share these credentials with the employee. They can login at <strong>/employee/login</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateEmployee
