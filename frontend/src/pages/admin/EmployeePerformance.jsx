import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Users, Building2, DollarSign, ArrowLeft, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

const EmployeePerformance = () => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const employeesRes = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.employees
      )

      const mappingsRes = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.employeeColleges
      )

      const employeesWithColleges = employeesRes.documents.map(emp => {
        const empColleges = mappingsRes.documents.filter(m => m.employeeId === emp.employeeId)
        return {
          ...emp,
          colleges: empColleges,
          collegeCount: empColleges.length
        }
      })

      setEmployees(employeesWithColleges)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load employee data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const totalColleges = employees.reduce((sum, emp) => sum + emp.collegeCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="container mx-auto">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Performance</h1>
          <p className="text-gray-600">Track sales team achievements</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
              </div>
              <Users className="text-purple-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Colleges Onboarded</p>
                <p className="text-3xl font-bold text-gray-900">{totalColleges}</p>
              </div>
              <Building2 className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Avg per Employee</p>
                <p className="text-3xl font-bold text-gray-900">
                  {employees.length > 0 ? (totalColleges / employees.length).toFixed(1) : 0}
                </p>
              </div>
              <TrendingUp className="text-green-500" size={40} />
            </div>
          </div>
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {employees.map((employee) => (
            <div key={employee.employeeId} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="text-purple-600" size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-xl">{employee.firstName}</h3>
                  <p className="text-sm text-gray-500">{employee.email}</p>
                  <p className="text-xs text-gray-400">ID: {employee.employeeId}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  employee.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-700 font-medium">Colleges Brought</p>
                  <p className="text-3xl font-bold text-blue-600">{employee.collegeCount}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">College List:</p>
                {employee.colleges.length === 0 ? (
                  <p className="text-gray-400 italic text-sm">No colleges onboarded yet</p>
                ) : (
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {employee.colleges.map((college) => (
                      <li key={college.$id} className="flex items-center gap-2 text-sm">
                        <Building2 size={14} className="text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-gray-900 truncate">{college.collegeName}</span>
                        <span className="text-xs text-gray-500">({college.collegeId})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmployeePerformance
