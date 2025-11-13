import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookOpen, Save, ArrowLeft, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases, storage } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { ID, Permission, Role } from 'appwrite'

const EditTest = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [formData, setFormData] = useState({
    testName: '',
    testNumber: '',
    duration: '',
    totalQuestions: ''
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTest()
  }, [id])

  const fetchTest = async () => {
    try {
      const testDoc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.tests,
        id
      )
      setTest(testDoc)
      setFormData({
        testName: testDoc.testName,
        testNumber: testDoc.testNumber.toString(),
        duration: testDoc.duration.toString(),
        totalQuestions: testDoc.totalQuestions.toString()
      })
    } catch (error) {
      console.error('Error fetching test:', error)
      toast.error('Failed to load test')
      navigate('/admin/tests')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      let fileId = test.questionsFileId

      // Upload new file if provided
      if (file) {
        const uploadedFile = await storage.createFile(
          APPWRITE_CONFIG.bucketId,
          ID.unique(),
          file,
          [Permission.read(Role.any())]
        )
        fileId = uploadedFile.$id

        // Delete old file (optional)
        try {
          await storage.deleteFile(APPWRITE_CONFIG.bucketId, test.questionsFileId)
        } catch (err) {
          console.warn('Could not delete old file:', err)
        }
      }

      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.tests,
        id,
        {
          testName: formData.testName,
          testNumber: parseInt(formData.testNumber),
          duration: parseInt(formData.duration),
          totalQuestions: parseInt(formData.totalQuestions),
          questionsFileId: fileId
        }
      )

      toast.success('Test updated successfully!')
      navigate('/admin/tests')
    } catch (error) {
      console.error('Error updating test:', error)
      toast.error(error.message || 'Failed to update test')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom flex items-center gap-4 py-4">
          <button onClick={() => navigate('/admin/tests')} className="btn-secondary">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Test</h1>
            <p className="text-sm text-gray-500">Modify test details and questions</p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BookOpen className="text-purple-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Test Information</h2>
                <p className="text-sm text-gray-500">Update test details below</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Name
                </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Number
                  </label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    value={formData.testNumber}
                    onChange={(e) => setFormData({ ...formData, testNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Questions
                  </label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    value={formData.totalQuestions}
                    onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Replace Questions File (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {file ? file.name : 'Click to upload new JSON file'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty to keep existing questions
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {saving ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/tests')}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditTest
