import { useNavigate } from 'react-router-dom'
import { Users, ArrowLeft, AlertCircle } from 'lucide-react'

const GroupsManagement = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex items-center gap-4 py-4">
          <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Groups Management</h1>
            <p className="text-sm text-gray-500">Organize students into test groups</p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="text-blue-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Groups Feature Coming Soon</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            This feature will allow you to create and manage student groups for organized test assignments.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-900 mb-1">Planned Features:</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Create custom student groups</li>
                  <li>• Assign specific tests to groups</li>
                  <li>• Track group performance</li>
                  <li>• Bulk student management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupsManagement
