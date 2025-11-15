import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, DollarSign, LogOut, Plus, Search, Users, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases } from '../../config/appwrite'
import { ID } from 'appwrite' // FIXED: Import from appwrite SDK
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query } from 'appwrite'

const EmployeeDashboard = () => {
  const navigate = useNavigate()
  const [employeeData, setEmployeeData] = useState(null)
  const [trackedColleges, setTrackedColleges] = useState([])
  const [collegeId, setCollegeId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedData = localStorage.getItem('employeeData')
    if (!storedData) {
      navigate('/employee/login')
      return
    }
    const data = JSON.parse(storedData)
    setEmployeeData(data)
    fetchTrackedColleges(data.employeeId)
  }, [navigate])

  const fetchTrackedColleges = async (employeeId) => {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.employeeColleges,
        [Query.equal('employeeId', employeeId)]
      )

      const collegesWithCount = await Promise.all(
        response.documents.map(async (doc) => {
          const attemptsResponse = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.attempts,
            [
              Query.equal('collegeId', doc.collegeId),
              Query.equal('paymentStatus', 'paid')
            ]
          )

          return {
            ...doc,
            paidStudentsCount: attemptsResponse.total
          }
        })
      )

      setTrackedColleges(collegesWithCount)
    } catch (error) {
      console.error('Error fetching tracked colleges:', error)
    }
  }

  const handleAddCollege = async () => {
    if (!collegeId.trim()) {
      toast.error('Please enter a College ID')
      return
    }

    setLoading(true)
    try {
      const collegeResponse = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.colleges,
        [Query.equal('collegeId', collegeId.trim().toUpperCase())]
      )

      if (collegeResponse.documents.length === 0) {
        toast.error('College not found with this ID')
        setLoading(false)
        return
      }

      const college = collegeResponse.documents[0]

      const existingResponse = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.employeeColleges,
        [
          Query.equal('employeeId', employeeData.employeeId),
          Query.equal('collegeId', college.collegeId)
        ]
      )

      if (existingResponse.documents.length > 0) {
        toast.error('You are already tracking this college')
        setLoading(false)
        return
      }

      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.employeeColleges,
        ID.unique(),
        {
          employeeId: employeeData.employeeId,
          collegeId: college.collegeId,
          collegeName: college.collegeName,
          addedAt: new Date().toISOString()
        }
      )

      toast.success(`${college.collegeName} added successfully!`)
      setCollegeId('')
      fetchTrackedColleges(employeeData.employeeId)
    } catch (error) {
      console.error('Error adding college:', error)
      toast.error('Failed to add college')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('employeeData')
    toast.success('Logged out successfully')
    navigate('/employee/login')
  }

  const totalPaidStudents = trackedColleges.reduce((sum, c) => sum + c.paidStudentsCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {employeeData?.firstName}! 👋
            </h1>
            <p className="text-sm text-gray-600">{employeeData?.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Add College Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Search size={24} className="text-purple-600" />
            Track New College
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Ask the college for their unique College ID and enter it below
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="Enter College ID (e.g., DTI001)"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCollege()}
            />
            <button
              onClick={handleAddCollege}
              disabled={loading}
              className="btn-primary flex items-center gap-2 px-6"
            >
              <Plus size={20} />
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Total Colleges</p>
                <p className="text-4xl font-bold">{trackedColleges.length}</p>
              </div>
              <Building2 size={48} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Paid Students</p>
                <p className="text-4xl font-bold">{totalPaidStudents}</p>
              </div>
              <Users size={48} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Revenue (₹)</p>
                <p className="text-4xl font-bold">{(totalPaidStudents * 949).toLocaleString()}</p>
              </div>
              <TrendingUp size={48} className="opacity-80" />
            </div>
          </div>
        </div>

        {/* Tracked Colleges Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Colleges</h2>

        {trackedColleges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Building2 className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg mb-2">No colleges tracked yet</p>
            <p className="text-gray-400 text-sm">Add your first college using the form above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trackedColleges.map((college) => (
              <div
                key={college.$id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Building2 className="text-purple-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                      {college.collegeName}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {college.collegeId}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Students Paid</p>
                      <p className="text-3xl font-bold text-green-600">
                        {college.paidStudentsCount}
                      </p>
                    </div>
                    <DollarSign className="text-green-500" size={40} />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-bold text-gray-900">
                      ₹{(college.paidStudentsCount * 949).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-gray-500">Added:</span>
                    <span className="text-gray-600">
                      {new Date(college.addedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeDashboard
