import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Building2, Users, Award, CreditCard, ArrowLeft, CheckCircle, XCircle, Download, Edit, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query } from 'appwrite'

const CollegeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [college, setCollege] = useState(null)
  const [students, setStudents] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterPayment, setFilterPayment] = useState('all')

  useEffect(() => {
    fetchCollegeData()
  }, [id])

  const fetchCollegeData = async () => {
    try {
      const collegeDoc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.colleges,
        id
      )
      setCollege(collegeDoc)

      const [studentsRes, attemptsRes] = await Promise.all([
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.students,
          [Query.equal('collegeId', collegeDoc.collegeId)]
        ),
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.attempts,
          [Query.equal('collegeId', collegeDoc.collegeId)]
        )
      ])

      setStudents(studentsRes.documents)
      setAttempts(attemptsRes.documents)
    } catch (error) {
      console.error('Error fetching college data:', error)
      toast.error('Failed to load college details')
    } finally {
      setLoading(false)
    }
  }

  const getStudentName = (studentId) => {
    const student = students.find(s => s.$id === studentId)
    return student?.name || 'Unknown'
  }

  const getStudentEmail = (studentId) => {
    const student = students.find(s => s.$id === studentId)
    return student?.email || 'Unknown'
  }

  const getStudentPhone = (studentId) => {
    const student = students.find(s => s.$id === studentId)
    return student?.phone || 'N/A'
  }

  const isEligibleForScholarship = (attempt) => {
    return attempt.percentage >= (college?.scholarshipPercentage || 60)
  }

  const filteredAttempts = attempts.filter(attempt => {
    if (filterPayment === 'all') return true
    if (filterPayment === 'paid') return attempt.paymentStatus === 'paid'
    if (filterPayment === 'pending') return attempt.paymentStatus === 'pending'
    if (filterPayment === 'eligible') return isEligibleForScholarship(attempt)
    if (filterPayment === 'mustpay') return !isEligibleForScholarship(attempt) && attempt.paymentStatus === 'pending'
    return true
  })

  const exportToCSV = () => {
    const csv = [
      ['Student Name', 'Email', 'Phone', 'Score', 'Percentage', 'Scholarship Eligible', 'Payment Status', 'Payment ID', 'Date'],
      ...filteredAttempts.map(a => [
        getStudentName(a.studentId),
        getStudentEmail(a.studentId),
        getStudentPhone(a.studentId),
        a.score,
        `${Math.round(a.percentage)}%`,
        isEligibleForScholarship(a) ? 'Yes' : 'No',
        a.paymentStatus,
        a.paymentId || 'N/A',
        new Date(a.$createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${college.collegeName}-students.csv`
    a.click()
    toast.success('Exported successfully!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const paidCount = attempts.filter(a => a.paymentStatus === 'paid').length
  const pendingCount = attempts.filter(a => a.paymentStatus === 'pending').length
  const eligibleCount = attempts.filter(a => isEligibleForScholarship(a)).length
  const mustPayCount = attempts.filter(a => !isEligibleForScholarship(a) && a.paymentStatus === 'pending').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{college?.collegeName}</h1>
              <p className="text-sm text-gray-500">College ID: {college?.collegeId}</p>
            </div>
          </div>
          <button onClick={exportToCSV} className="btn-primary flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* College Info Card with Edit Button */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">College Information</h2>
            <button
              onClick={() => navigate('/admin/scholarship')}
              className="btn-secondary flex items-center gap-2"
            >
              <Edit size={18} />
              Manage Scholarship & Payment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">College Name</h3>
              <p className="text-xl font-bold text-gray-900">{college?.collegeName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">College Code</h3>
              <p className="text-xl font-bold text-primary-600">{college?.collegeId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-lg text-gray-900">{college?.email}</p>
            </div>
          </div>

          {/* Scholarship & Payment Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Scholarship Cutoff</h3>
                  <p className="text-4xl font-bold text-yellow-600">{college?.scholarshipPercentage || 60}%</p>
                  <p className="text-xs text-gray-500 mt-2">Students above this get scholarship</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Award className="text-yellow-600" size={32} />
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-6 border ${
              college?.payNowEnabled 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Payment Option</h3>
                  <p className={`text-4xl font-bold ${college?.payNowEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {college?.payNowEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {college?.payNowEnabled 
                      ? '✅ Students can see Pay Now button'
                      : '❌ Pay Now button is hidden'}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${college?.payNowEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
                  {college?.payNowEnabled ? (
                    <ToggleRight className="text-green-600" size={32} />
                  ) : (
                    <ToggleLeft className="text-red-400" size={32} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Edit Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">💡 Want to change scholarship or payment settings?</p>
              <p className="text-blue-700">
                Click the <strong>"Manage Scholarship & Payment"</strong> button above to edit cutoff percentage and enable/disable payments.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Paid Students</p>
                <p className="text-3xl font-bold text-green-600">{paidCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Payment</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <XCircle className="text-yellow-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Scholarship Eligible</p>
                <p className="text-3xl font-bold text-blue-600">{eligibleCount}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Award className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Must Pay</p>
                <p className="text-3xl font-bold text-red-600">{mustPayCount}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <CreditCard className="text-red-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterPayment('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterPayment === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({attempts.length})
            </button>
            <button
              onClick={() => setFilterPayment('paid')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterPayment === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paid ({paidCount})
            </button>
            <button
              onClick={() => setFilterPayment('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterPayment === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterPayment('eligible')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterPayment === 'eligible' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Scholarship Eligible ({eligibleCount})
            </button>
            <button
              onClick={() => setFilterPayment('mustpay')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterPayment === 'mustpay' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Must Pay ({mustPayCount})
            </button>
          </div>
        </div>

        {/* Students Payment Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Student Payment Details</h2>
          </div>

          {filteredAttempts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500">No students found with selected filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Student Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Phone</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Score</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Percentage</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Scholarship</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Payment</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttempts.map((attempt) => {
                    const isScholarshipEligible = isEligibleForScholarship(attempt)
                    
                    return (
                      <tr key={attempt.$id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-900">
                          {getStudentName(attempt.studentId)}
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">
                          {getStudentEmail(attempt.studentId)}
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">
                          {getStudentPhone(attempt.studentId)}
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-900">
                          {attempt.score}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`font-bold ${
                            attempt.percentage >= 60 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {Math.round(attempt.percentage)}%
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {isScholarshipEligible ? (
                            <span className="flex items-center gap-2 text-blue-600 font-medium">
                              <Award size={16} />
                              Yes
                            </span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {attempt.paymentStatus === 'paid' ? (
                            <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 w-fit">
                              <CheckCircle size={14} />
                              Paid
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 w-fit">
                              <XCircle size={14} />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm font-mono">
                          {attempt.paymentId ? (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {attempt.paymentId.substring(0, 12)}...
                            </span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollegeDetails
