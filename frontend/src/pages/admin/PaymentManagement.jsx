import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Search, Filter, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'

const PaymentManagement = () => {
  const navigate = useNavigate()
  const [attempts, setAttempts] = useState([])
  const [students, setStudents] = useState({})
  const [loading, setLoading] = useState(true)
  const [filterPayment, setFilterPayment] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPaymentData()
  }, [])

  const fetchPaymentData = async () => {
    try {
      const [attemptsRes, studentsRes] = await Promise.all([
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.attempts),
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.students)
      ])

      setAttempts(attemptsRes.documents)

      const studentsMap = {}
      studentsRes.documents.forEach(s => studentsMap[s.$id] = s)
      setStudents(studentsMap)
    } catch (error) {
      console.error('Error fetching payment data:', error)
      toast.error('Failed to load payment data')
    } finally {
      setLoading(false)
    }
  }

  const filteredAttempts = attempts.filter(attempt => {
    const student = students[attempt.studentId]
    const matchesSearch = student?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterPayment === 'all' || attempt.paymentStatus === filterPayment
    return matchesSearch && matchesFilter
  })

  const paidCount = attempts.filter(a => a.paymentStatus === 'paid').length
  const pendingCount = attempts.filter(a => a.paymentStatus === 'pending').length
  const totalRevenue = paidCount * 100 // Assuming ₹100 per test

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-sm text-gray-500">Track all test payments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Paid</p>
            <p className="text-3xl font-bold text-green-600">{paidCount}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600">₹{totalRevenue}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <p className="text-gray-500 text-sm">Total Attempts</p>
            <p className="text-3xl font-bold text-purple-600">{attempts.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by student name..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="input-field"
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Payment Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Student</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Score</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Payment Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttempts.map((attempt) => (
                    <tr key={attempt.$id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {students[attempt.studentId]?.name || 'Unknown'}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {students[attempt.studentId]?.email || 'Unknown'}
                      </td>
                      <td className="py-4 px-6 font-bold">{attempt.score}</td>
                      <td className="py-4 px-6">
                        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit ${
                          attempt.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {attempt.paymentStatus === 'paid' ? (
                            <CheckCircle size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {attempt.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(attempt.$createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentManagement
