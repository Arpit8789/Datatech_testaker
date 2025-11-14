import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Building2, ArrowLeft, Save, Users, ToggleLeft, ToggleRight, CheckCircle, Edit2, TrendingUp, Calendar, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query } from 'appwrite'

const ScholarshipManagement = () => {
  const navigate = useNavigate()
  const [colleges, setColleges] = useState([])
  const [attempts, setAttempts] = useState([])
  const [generalSettings, setGeneralSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingCollege, setEditingCollege] = useState(null)
  const [newPercentage, setNewPercentage] = useState('')
  const [editingGeneral, setEditingGeneral] = useState(false)
  const [generalPercentage, setGeneralPercentage] = useState('')
  const [editingTiming, setEditingTiming] = useState(null)
  const [timingData, setTimingData] = useState({ start: '', end: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [collegesRes, attemptsRes, generalRes] = await Promise.all([
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.colleges),
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.attempts),
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.generalSettings)
      ])
      
      setColleges(collegesRes.documents)
      setAttempts(attemptsRes.documents)
      setGeneralSettings(generalRes.documents[0] || null)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Update General Scholarship
  const handleUpdateGeneralScholarship = async () => {
    if (!generalPercentage || parseInt(generalPercentage) < 0 || parseInt(generalPercentage) > 100) {
      toast.error('Please enter a valid percentage (0-100)')
      return
    }

    try {
      if (generalSettings) {
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.generalSettings,
          generalSettings.$id,
          { scholarshipPercentage: parseInt(generalPercentage) }
        )
      } else {
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.generalSettings,
          'settings',
          { 
            scholarshipPercentage: parseInt(generalPercentage),
            paymentAmount: 949
          }
        )
      }
      toast.success('General scholarship updated!')
      setEditingGeneral(false)
      fetchData()
    } catch (error) {
      console.error('Error updating general scholarship:', error)
      toast.error('Failed to update')
    }
  }

  // Update College Scholarship
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
      toast.success('Scholarship percentage updated!')
      setEditingCollege(null)
      setNewPercentage('')
      fetchData()
    } catch (error) {
      console.error('Error updating scholarship:', error)
      toast.error('Failed to update scholarship percentage')
    }
  }

  // Update Test Timing
  const handleUpdateTiming = async (collegeId) => {
    if (!timingData.start || !timingData.end) {
      toast.error('Please select both start and end times')
      return
    }

    if (new Date(timingData.end) <= new Date(timingData.start)) {
      toast.error('End time must be after start time')
      return
    }

    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.colleges,
        collegeId,
        {
          testStartTime: timingData.start,
          testEndTime: timingData.end
        }
      )
      toast.success('Test timing updated!')
      setEditingTiming(null)
      setTimingData({ start: '', end: '' })
      fetchData()
    } catch (error) {
      console.error('Error updating timing:', error)
      toast.error('Failed to update timing')
    }
  }

  // Toggle Payment
  const handleTogglePayment = async (college) => {
    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.colleges,
        college.$id,
        { payNowEnabled: !college.payNowEnabled }
      )
      toast.success(`Payment ${!college.payNowEnabled ? 'enabled' : 'disabled'}`)
      fetchData()
    } catch (error) {
      console.error('Error toggling payment:', error)
      toast.error('Failed to update payment status')
    }
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
    return attempts.filter(a => a.collegeId === collegeId && a.paymentStatus === 'paid').length
  }

  // General students stats
  const generalAttempts = attempts.filter(a => !a.collegeId || a.collegeId === 'null' || a.collegeId === '')
  const generalEligible = generalAttempts.filter(a => a.percentage >= (generalSettings?.scholarshipPercentage || 60)).length
  const generalMustPay = generalAttempts.filter(a => 
    a.percentage < (generalSettings?.scholarshipPercentage || 60) && a.paymentStatus === 'pending'
  ).length

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
              <p className="text-sm text-gray-500">Manage scholarship cutoffs, payments, and test timings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* General Students Settings Card */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Globe size={32} />
            <div>
              <h2 className="text-2xl font-bold">General Students Settings</h2>
              <p className="text-purple-100 text-sm">Global settings for students without college affiliation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scholarship Percentage */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold">Scholarship Cutoff</p>
                {!editingGeneral && (
                  <button
                    onClick={() => {
                      setEditingGeneral(true)
                      setGeneralPercentage((generalSettings?.scholarshipPercentage || 60).toString())
                    }}
                    className="text-white hover:bg-white/20 px-3 py-1 rounded-lg transition-all flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                )}
              </div>

              {editingGeneral ? (
                <div className="space-y-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="input-field text-center text-2xl font-bold text-gray-900"
                    value={generalPercentage}
                    onChange={(e) => setGeneralPercentage(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleUpdateGeneralScholarship} className="btn-primary flex-1">
                      <Save size={16} className="inline mr-2" />
                      Save
                    </button>
                    <button onClick={() => setEditingGeneral(false)} className="btn-secondary flex-1">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-6xl font-bold">{generalSettings?.scholarshipPercentage || 60}%</p>
              )}
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-purple-100 text-sm">Total General Students</p>
                <p className="text-3xl font-bold">{generalAttempts.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-purple-100 text-sm">Scholarship Eligible</p>
                <p className="text-3xl font-bold text-green-300">{generalEligible}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-purple-100 text-sm">Payment Pending</p>
                <p className="text-3xl font-bold text-yellow-300">{generalMustPay}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Colleges Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">College-Wise Management</h2>

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
              const isEditingScholarship = editingCollege === college.$id
              const isEditingTime = editingTiming === college.$id
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

                  {/* Test Timing Section */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-blue-600" />
                        <p className="font-semibold text-gray-900">Test Availability Window</p>
                      </div>
                      {!isEditingTime && (
                        <button
                          onClick={() => {
                            setEditingTiming(college.$id)
                            setTimingData({
                              start: college.testStartTime || '',
                              end: college.testEndTime || ''
                            })
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Edit2 size={14} className="inline mr-1" />
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditingTime ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">Start Time</label>
                          <input
                            type="datetime-local"
                            className="input-field text-sm"
                            value={timingData.start}
                            onChange={(e) => setTimingData({ ...timingData, start: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">End Time</label>
                          <input
                            type="datetime-local"
                            className="input-field text-sm"
                            value={timingData.end}
                            onChange={(e) => setTimingData({ ...timingData, end: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateTiming(college.$id)}
                            className="btn-primary flex-1 text-sm py-2"
                          >
                            Save Timing
                          </button>
                          <button
                            onClick={() => setEditingTiming(null)}
                            className="btn-secondary flex-1 text-sm py-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {college.testStartTime ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Starts:</span>
                              <span className="font-medium text-gray-900">
                                {new Date(college.testStartTime).toLocaleString('en-IN', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short'
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ends:</span>
                              <span className="font-medium text-gray-900">
                                {new Date(college.testEndTime).toLocaleString('en-IN', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short'
                                })}
                              </span>
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-500 text-center py-2">No timing set - Always available</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Scholarship Section */}
                  <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-gray-900">Scholarship Cutoff</p>
                      {!isEditingScholarship && (
                        <button
                          onClick={() => {
                            setEditingCollege(college.$id)
                            setNewPercentage(currentThreshold.toString())
                          }}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          <Edit2 size={14} className="inline mr-1" />
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditingScholarship ? (
                      <div className="space-y-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="input-field text-center text-xl font-bold"
                          value={newPercentage}
                          onChange={(e) => setNewPercentage(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateScholarship(college.$id)} className="btn-primary flex-1">
                            Save
                          </button>
                          <button onClick={() => setEditingCollege(null)} className="btn-secondary flex-1">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-4xl font-bold text-yellow-600 text-center">{currentThreshold}%</p>
                    )}
                  </div>

                  {/* Payment Toggle */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">Payment Option</p>
                        <p className="text-xs text-gray-600">
                          {college.payNowEnabled ? '✅ Enabled for students' : '❌ Disabled'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleTogglePayment(college)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          college.payNowEnabled
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        {college.payNowEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 rounded p-3 text-center border border-green-200">
                      <p className="text-xs text-gray-600">Eligible</p>
                      <p className="text-xl font-bold text-green-600">{eligible}</p>
                    </div>
                    <div className="bg-yellow-50 rounded p-3 text-center border border-yellow-200">
                      <p className="text-xs text-gray-600">Must Pay</p>
                      <p className="text-xl font-bold text-yellow-600">{mustPay}</p>
                    </div>
                    <div className="bg-blue-50 rounded p-3 text-center border border-blue-200">
                      <p className="text-xs text-gray-600">Paid</p>
                      <p className="text-xl font-bold text-blue-600">{paid}</p>
                    </div>
                    <div className="bg-purple-50 rounded p-3 text-center border border-purple-200">
                      <p className="text-xs text-gray-600">Total</p>
                      <p className="text-xl font-bold text-purple-600">{totalAttempts}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/admin/colleges/${college.$id}`)}
                    className="btn-secondary w-full mt-4"
                  >
                    View Full Details →
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
