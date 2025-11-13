import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Building2, ArrowLeft, Save, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'

const ScholarshipManagement = () => {
  const navigate = useNavigate()
  const [colleges, setColleges] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCollege, setEditingCollege] = useState(null)
  const [newPercentage, setNewPercentage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [collegesRes, attemptsRes] = await Promise.all([
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.colleges),
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.attempts)
      ])
      setColleges(collegesRes.documents)
      setAttempts(attemptsRes.documents)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateScholarship = async (collegeId) => {
    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.colleges,
        collegeId,
        { scholarshipPercentage: parseInt(newPercentage) }
      )
      toast.success('Scholarship percentage updated!')
      setEditingCollege(null)
      setNewPercentage('')
      fetchData()
    } catch (error) {
      console.error('Error updating scholarship:', error)
      toast.error('Failed to update scholarship')
    }
  }

  const getEligibleStudents = (collegeId) => {
    const collegeAttempts = attempts.filter(a => a.collegeId === collegeId)
    const college = colleges.find(c => c.$id === collegeId)
    const threshold = college?.scholarshipPercentage || 60
    return collegeAttempts.filter(a => a.percentage >= threshold).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scholarship Management</h1>
              <p className="text-sm text-gray-500">Set scholarship thresholds for colleges</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Info Card */}
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl p-8 mb-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Award size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Scholarship Program</h2>
              <p className="text-yellow-100">
                Students scoring above the threshold percentage are eligible for scholarship benefits
              </p>
            </div>
          </div>
        </div>

        {/* Colleges List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : colleges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Building2 className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500">No colleges found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colleges.map((college) => {
              const eligible = getEligibleStudents(college.$id)
              const isEditing = editingCollege === college.$id

              return (
                <div key={college.$id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Building2 className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{college.collegeName}</h3>
                        <p className="text-sm text-gray-500">Code: {college.collegeId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Scholarship Threshold</span>
                        {!isEditing && (
                          <button
                            onClick={() => {
                              setEditingCollege(college.$id)
                              setNewPercentage(college.scholarshipPercentage.toString())
                            }}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            Edit
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="input-field"
                            value={newPercentage}
                            onChange={(e) => setNewPercentage(e.target.value)}
                          />
                          <button
                            onClick={() => handleUpdateScholarship(college.$id)}
                            className="btn-primary whitespace-nowrap"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingCollege(null)
                              setNewPercentage('')
                            }}
                            className="btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-3xl font-bold text-primary-600">
                          {college.scholarshipPercentage}%
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Users size={16} className="text-green-600" />
                          <span className="text-xs text-gray-600">Eligible Students</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{eligible}</p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Award size={16} className="text-blue-600" />
                          <span className="text-xs text-gray-600">Total Attempts</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          {attempts.filter(a => a.collegeId === college.collegeId).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ScholarshipManagement
