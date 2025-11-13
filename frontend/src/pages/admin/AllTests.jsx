import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Plus, Edit, Trash2, Clock, FileText, Search, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases, storage } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { ID, Permission, Role } from 'appwrite'

const AllTests = () => {
  const navigate = useNavigate()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    testName: '',
    testNumber: '',
    duration: '',
    totalQuestions: ''
  })
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.tests
      )
      setTests(response.documents)
    } catch (error) {
      console.error('Error fetching tests:', error)
      toast.error('Failed to load tests')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTest = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      let fileId = ''
      if (file) {
        const uploadedFile = await storage.createFile(
          APPWRITE_CONFIG.bucketId,
          ID.unique(),
          file,
          [Permission.read(Role.any())]
        )
        fileId = uploadedFile.$id
      } else {
        toast.error('Please select a JSON file')
        setUploading(false)
        return
      }

      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.tests,
        ID.unique(),
        {
          testName: formData.testName,
          testNumber: parseInt(formData.testNumber),
          duration: parseInt(formData.duration),
          totalQuestions: parseInt(formData.totalQuestions),
          questionsFileId: fileId
        }
      )

      toast.success('Test created successfully!')
      setFormData({ testName: '', testNumber: '', duration: '', totalQuestions: '' })
      setFile(null)
      setShowAddForm(false)
      fetchTests()
    } catch (error) {
      console.error('Error creating test:', error)
      toast.error(error.message || 'Failed to create test')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteTest = async (testId) => {
    if (!confirm('Are you sure you want to delete this test?')) return

    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.tests,
        testId
      )
      toast.success('Test deleted successfully!')
      fetchTests()
    } catch (error) {
      console.error('Error deleting test:', error)
      toast.error('Failed to delete test')
    }
  }

  const filteredTests = tests.filter(test =>
    test.testName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Tests</h1>
              <p className="text-sm text-gray-500">Manage all test papers</p>
            </div>
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Add New Test
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Add Test Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Test</h2>
            <form onSubmit={handleAddTest} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g., Test 1: Data Science"
                  value={formData.testName}
                  onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Number</label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    placeholder="1"
                    value={formData.testNumber}
                    onChange={(e) => setFormData({ ...formData, testNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    placeholder="60"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Questions</label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    placeholder="50"
                    value={formData.totalQuestions}
                    onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload JSON File</label>
                <input
                  type="file"
                  accept=".json"
                  required
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={uploading} className="btn-primary flex-1">
                  {uploading ? 'Creating Test...' : 'Create Test'}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tests..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tests Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg">No tests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div key={test.$id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BookOpen className="text-purple-600" size={24} />
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                    Active
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">{test.testName}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2" />
                    Duration: {test.duration} minutes
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText size={16} className="mr-2" />
                    Questions: {test.totalQuestions}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/tests/${test.$id}/edit`)}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTest(test.$id)}
                    className="btn-danger flex-1 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllTests
