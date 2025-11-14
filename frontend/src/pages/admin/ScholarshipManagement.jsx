import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Building2, ArrowLeft, Save, Users, ToggleLeft, ToggleRight, CheckCircle, Edit2, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query } from 'appwrite'

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
    if (!newPercentage || parseInt(newPercentage) < 0 || parseInt(newPercentage) > 100) {
      toast.error('Please enter a valid percentage (0-100)')
      return
    }

    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.colleges,
        collegeId,
        { scholarshipPercentage: parseInt(newPercentage) }
      )
      toast.success('Scholarship percentage updated successfully!')
      setEditingCollege(null)
      setNewPercentage('')
      fetchData()
    } catch (error) {
      console.error('Error updating scholarship:', error)
      toast.error('Failed to update scholarship percentage')
    }
  }

  const handleTogglePayment = async (college) => {
    try {
      const newStatus = !college.payNowEnabled
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.colleges,
        college.$id,
        { payNowEnabled: newStatus }
      )
      toast.success(`Payment ${newStatus ? 'enabled' : 'disabled'} for ${college.collegeName}`)
      fetchData()
    } catch (error) {
      console.error('Error toggling payment:', error)
      toast.error('Failed to update payment status')
    }
  }

  // Get stats for each percentage threshold (for preview)
  const getStatsForThreshold = (collegeId, threshold) => {
    const collegeAttempts = attempts.filter(a => a.collegeId === collegeId)
    const eligible = collegeAttempts.filter(a => a.percentage >= threshold).length
    const mustPay = collegeAttempts.filter(a => a.percentage < threshold).length
    return { eligible, mustPay, total: collegeAttempts.length }
  }

  const getEligibleStudents = (collegeId, threshold) => {
    const collegeAttempts = attempts.filter(a => a.collegeId === collegeId)
    return collegeAttempts.filter(a => a.percentage >= threshold).length
  }

  const getMustPayStudents = (collegeId, threshold) => {
    const collegeAttempts = attempts.filter(a => a.collegeId === collegeId)
    return collegeAttempts.filter(a => a.percentage < threshold && a.paymentStatus === 'pending').length
  }

  const getPaidStudents = (collegeId) => {
    const collegeAttempts = attempts.filter(a => a.collegeId === collegeId)
    return collegeAttempts.filter(a => a.paymentStatus === 'paid').length
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
              <h1 className="text-3xl font-bold text-gray-900">Scholarship & Payment Management</h1>
              <p className="text-sm text-gray-500">Set scholarship cutoffs and enable/disable payments</p>
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
              <h2 className="text-2xl font-bold">How It Works</h2>
              <ul className="text-yellow-100 text-sm mt-2 space-y-1">
                <li>• Set scholarship cutoff percentage for each college</li>
                <li>• Students scoring ≥ cutoff get scholarship (no payment required)</li>
                <li>• Students scoring &lt; cutoff must pay (if payment enabled)</li>
                <li>• Toggle payment option to enable/disable for entire college</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Colleges Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : colleges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Building2 className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500">No colleges registered yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {colleges.map((college) => {
              const isEditing = editingCollege === college.$id
              const currentThreshold = college.scholarshipPercentage || 60
              const eligible = getEligibleStudents(college.collegeId, currentThreshold)
              const mustPay = getMustPayStudents(college.collegeId, currentThreshold)
              const paid = getPaidStudents(college.collegeId)
              const totalAttempts = attempts.filter(a => a.collegeId === college.collegeId).length

              return (
                <div key={college.$id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
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

                  {/* Scholarship Threshold Editor */}
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 mb-4 border border-yellow-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Scholarship Cutoff</p>
                        <p className="text-xs text-gray-600">Students scoring above this get scholarship</p>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingCollege(college.$id)
                            setNewPercentage(currentThreshold.toString())
                          }}
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <>
                        <div className="mb-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="input-field text-center text-2xl font-bold"
                            value={newPercentage}
                            onChange={(e) => setNewPercentage(e.target.value)}
                            placeholder="e.g., 60"
                          />
                        </div>

                        {/* Preview Stats */}
                        {newPercentage && (
                          <div className="bg-white rounded-lg p-3 mb-3">
                            <p className="text-xs text-gray-600 mb-2 font-medium">Preview at {newPercentage}%:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-green-600" />
                                <span className="text-gray-700">
                                  Eligible: <strong className="text-green-600">
                                    {getEligibleStudents(college.collegeId, parseInt(newPercentage))}
                                  </strong>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Award size={14} className="text-yellow-600" />
                                <span className="text-gray-700">
                                  Must Pay: <strong className="text-yellow-600">
                                    {getMustPayStudents(college.collegeId, parseInt(newPercentage))}
                                  </strong>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateScholarship(college.$id)}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                          >
                            <Save size={16} />
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setEditingCollege(null)
                              setNewPercentage('')
                            }}
                            className="btn-secondary flex-1"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <p className="text-5xl font-bold text-yellow-600 mb-1">{currentThreshold}%</p>
                        <p className="text-xs text-gray-600">Current cutoff percentage</p>
                      </div>
                    )}
                  </div>

                  {/* Payment Toggle */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mb-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          <TrendingUp size={18} className="text-blue-600" />
                          Payment Option
                        </p>
                        <p className="text-xs text-gray-600">
                          {college.payNowEnabled 
                            ? '✅ Students can see and use Pay Now button' 
                            : '❌ Pay Now button hidden from students'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleTogglePayment(college)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all shadow-md ${
                          college.payNowEnabled
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                      >
                        {college.payNowEnabled ? (
                          <>
                            <ToggleRight size={24} />
                            ON
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={24} />
                            OFF
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-xs text-gray-600 font-medium">Scholarship Eligible</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{eligible}</p>
                      <p className="text-xs text-gray-500 mt-1">≥ {currentThreshold}% score</p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Award size={16} className="text-yellow-600" />
                        <span className="text-xs text-gray-600 font-medium">Must Pay</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">{mustPay}</p>
                      <p className="text-xs text-gray-500 mt-1">&lt; {currentThreshold}% score</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle size={16} className="text-blue-600" />
                        <span className="text-xs text-gray-600 font-medium">Already Paid</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{paid}</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Users size={16} className="text-purple-600" />
                        <span className="text-xs text-gray-600 font-medium">Total Attempts</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{totalAttempts}</p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => navigate(`/admin/colleges/${college.$id}`)}
                    className="btn-secondary w-full"
                  >
                    View Full College Details →
                  </button>
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
