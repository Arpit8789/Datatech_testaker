import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases, storage } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { useAuth } from '../../context/AuthContext'
import { ID, Query } from 'appwrite'

const TakeTest = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { studentData } = useAuth()
  
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTestData()
  }, [id])

  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && test && questions.length > 0) {
      handleSubmit()
    }
  }, [timeLeft, questions])

  const fetchTestData = async () => {
    try {
      // Fetch test details
      const testDoc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.tests,
        id
      )
      setTest(testDoc)
      setTimeLeft(testDoc.duration * 60) // Convert to seconds

      // Fetch questions from storage - use download instead of view
      try {
        const fileDownload = await storage.getFileDownload(
          APPWRITE_CONFIG.bucketId,
          testDoc.questionsFileId
        )
        
        // Parse the downloaded file
        const response = await fetch(fileDownload)
        const data = await response.json()
        
        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions)
        } else {
          throw new Error('Invalid test format')
        }
      } catch (storageError) {
        console.error('Storage error:', storageError)
        toast.error('Failed to load questions. Please check storage permissions.')
        navigate('/student/dashboard')
        return
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching test:', error)
      toast.error('Failed to load test')
      navigate('/student/dashboard')
    }
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    })
  }

  const handleSubmit = async () => {
    if (submitting || questions.length === 0) return
    setSubmitting(true)

    try {
      // Calculate score
      let correct = 0
      let incorrect = 0
      let unattempted = 0

      questions.forEach((q) => {
        const userAnswer = answers[q.id]
        if (userAnswer === undefined) {
          unattempted++
        } else if (userAnswer === q.correctAnswer) {
          correct++
        } else {
          incorrect++
        }
      })

      const score = correct * (questions[0]?.marks || 1)
      const percentage = (correct / questions.length) * 100

      // Save attempt to database
      const attempt = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.attempts,
        ID.unique(),
        {
          studentId: studentData.$id,
          testId: id,
          collegeId: studentData.collegeId,
          status: 'completed',
          answers: JSON.stringify(answers),
          score: score,
          percentage: percentage,
          correctCount: correct,
          incorrectCount: incorrect,
          unattemptedCount: unattempted,
          paymentStatus: 'pending',
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        }
      )

      toast.success('Test submitted successfully!')
      navigate(`/student/result/${attempt.$id}`)
    } catch (error) {
      console.error('Error submitting test:', error)
      toast.error('Failed to submit test')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    )
  }

  // ✅ Add safety check
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
          <p className="text-gray-600 text-lg mb-4">No questions available</p>
          <button onClick={() => navigate('/student/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="container-custom flex justify-between items-center py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{test?.testName}</h1>
            <p className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            <Clock size={20} />
            <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Question */}
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold">
                    Q{currentQuestion + 1}
                  </span>
                  <div className="flex-1">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mb-2">
                      {question?.section || 'General'}
                    </span>
                    <p className="text-lg text-gray-900 leading-relaxed">
                      {question?.question}
                    </p>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {question?.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(question.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[question.id] === index
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[question.id] === index
                          ? 'border-primary-600 bg-primary-600'
                          : 'border-gray-300'
                      }`}>
                        {answers[question.id] === index && (
                          <CheckCircle className="text-white" size={16} />
                        )}
                      </div>
                      <span className="font-medium text-gray-700">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-gray-900">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>

                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary"
                  >
                    {submitting ? 'Submitting...' : 'Submit Test'}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    className="btn-primary"
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Palette */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Question Palette</h3>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      index === currentQuestion
                        ? 'bg-primary-600 text-white ring-2 ring-primary-300'
                        : answers[q.id] !== undefined
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded"></div>
                  <span className="text-gray-600">Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary-600 rounded"></div>
                  <span className="text-gray-600">Current</span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-bold text-green-600">
                    {Object.keys(answers).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Not Answered:</span>
                  <span className="font-bold text-gray-600">
                    {questions.length - Object.keys(answers).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TakeTest
