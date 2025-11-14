import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Award, Search, Filter, Download, ArrowLeft, TrendingUp, Globe, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { Query } from 'appwrite'

const AllMarks = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const studentType = queryParams.get('type') // 'general' or null (all/college)

  const [attempts, setAttempts] = useState([])
  const [students, setStudents] = useState({})
  const [tests, setTests] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [attemptsRes, studentsRes, testsRes] = await Promise.all([
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.attempts),
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.students),
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.tests)
      ])

      setAttempts(attemptsRes.documents)

      const studentsMap = {}
      studentsRes.documents.forEach(s => studentsMap[s.$id] = s)
      setStudents(studentsMap)

      const testsMap = {}
      testsRes.documents.forEach(t => testsMap[t.$id] = t)
      setTests(testsMap)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load marks')
    } finally {
      setLoading(false)
    }
  }

  const filteredAttempts = attempts.filter(attempt => {
    const student = students[attempt.studentId]
    
    // Filter by student type
    if (studentType === 'general') {
      if (student?.collegeId && student?.collegeId !== '') return false
    } else if (studentType === 'college') {
      if (!student?.collegeId || student?.collegeId === '') return false
    }

    // Search filter
    const matchesSearch = student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student?.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Status filter
    const matchesFilter = filterStatus === 'all' || attempt.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const exportToCSV = () => {
    const csv = [
      ['Student Name', 'Email', 'Type', 'Test', 'Score', 'Percentage', 'Status', 'Date'],
      ...filteredAttempts.map(a => {
        const student = students[a.studentId]
        return [
          student?.name || 'Unknown',
          student?.email || 'Unknown',
          (!student?.collegeId || student?.collegeId === '') ? 'General' : 'College',
          tests[a.testId]?.testName || 'Unknown',
          a.score,
          `${Math.round(a.percentage)}%`,
          a.status,
          new Date(a.$createdAt).toLocaleDateString()
        ]
      })
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `student-marks-${studentType || 'all'}.csv`
    a.click()
    toast.success('Exported successfully!')
  }

  const pageTitle = studentType === 'general' ? 'General Students Marks' : 'All Student Marks'
  const pageIcon = studentType === 'general' ? <Globe size={32} /> : <Award size={32} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-sm text-gray-500">
                {studentType === 'general' ? 'Performance of general students' : 'View and analyze all student performance'}
              </p>
            </div>
          </div>
          <button onClick={exportToCSV} className="btn-primary flex items-center gap-2">
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/admin/marks')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !studentType ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Building2 size={16} className="inline mr-2" />
              All Students
            </button>
            <button
              onClick={() => navigate('/admin/marks?type=general')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                studentType === 'general' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Globe size={16} className="inline mr-2" />
              General Students
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <p className="text-gray-500 text-sm">Total Attempts</p>
            <p className="text-3xl font-bold text-gray-900">{filteredAttempts.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <p className="text-gray-500 text-sm">Avg Score</p>
            <p className="text-3xl font-bold text-green-600">
              {filteredAttempts.length > 0 
                ? Math.round(filteredAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / filteredAttempts.length)
                : 0}%
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <p className="text-gray-500 text-sm">Pass Rate</p>
            <p className="text-3xl font-bold text-blue-600">
              {filteredAttempts.length > 0
                ? Math.round((filteredAttempts.filter(a => a.percentage >= 60).length / filteredAttempts.length) * 100)
                : 0}%
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <p className="text-gray-500 text-sm">Highest Score</p>
            <p className="text-3xl font-bold text-yellow-600">
              {filteredAttempts.length > 0 ? Math.max(...filteredAttempts.map(a => a.percentage || 0)).toFixed(0) : 0}%
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by student name or email..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Marks Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            {pageIcon}
            <p className="text-gray-500 text-lg mt-4">No marks found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold">Student Name</th>
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold">Email</th>
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold">Type</th>
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold">Test</th>
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold">Score</th>
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold">Percentage</th>
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttempts.map((attempt) => {
                    const student = students[attempt.studentId]
                    const isGeneral = !student?.collegeId || student?.collegeId === ''
                    
                    return (
                      <tr key={attempt.$id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-900">
                          {student?.name || 'Unknown'}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {student?.email || 'Unknown'}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isGeneral ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isGeneral ? 'General' : 'College'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {tests[attempt.testId]?.testName?.substring(0, 30) || 'Unknown'}...
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-900">
                          {attempt.score || 0}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`font-bold ${
                            (attempt.percentage || 0) >= 60 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {Math.round(attempt.percentage || 0)}%
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            attempt.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {attempt.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(attempt.$createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllMarks
