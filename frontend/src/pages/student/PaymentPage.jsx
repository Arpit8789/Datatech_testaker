import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CreditCard, CheckCircle, AlertCircle, Home } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { useAuth } from '../../context/AuthContext'

const PaymentPage = () => {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const { studentData } = useAuth()
  const [attempt, setAttempt] = useState(null)
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadRazorpayScript()
    fetchAttemptDetails()
  }, [attemptId])

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const fetchAttemptDetails = async () => {
    try {
      const attemptDoc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.attempts,
        attemptId
      )
      setAttempt(attemptDoc)

      // Fetch college details
      const collegeRes = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.colleges,
        [Query.equal('collegeId', studentData.collegeId)]
      )
      setCollege(collegeRes.documents[0])
    } catch (error) {
      console.error('Error fetching details:', error)
      toast.error('Failed to load payment details')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!window.Razorpay) {
      toast.error('Payment gateway not loaded. Please refresh.')
      return
    }

    setProcessing(true)

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY', // Replace with your key
      amount: 10000, // ₹100 in paise (100 * 100)
      currency: 'INR',
      name: 'Datatech Test Platform',
      description: 'Test Fee Payment',
      image: '/logo.png',
      handler: async function (response) {
        try {
          // Update payment status in database
          await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.attempts,
            attemptId,
            {
              paymentStatus: 'paid',
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id || 'N/A',
              paidAt: new Date().toISOString()
            }
          )

          toast.success('Payment successful!')
          navigate('/student/payment-success')
        } catch (error) {
          console.error('Payment update failed:', error)
          toast.error('Payment recorded but update failed. Contact support.')
        }
      },
      prefill: {
        name: studentData?.name || '',
        email: studentData?.email || '',
        contact: studentData?.phone || ''
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: function() {
          setProcessing(false)
          toast.error('Payment cancelled')
        }
      }
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
    setProcessing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Already paid
  if (attempt?.paymentStatus === 'paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Paid</h1>
          <p className="text-gray-600 mb-6">This test fee has already been paid.</p>
          <button onClick={() => navigate('/student/dashboard')} className="btn-primary w-full">
            <Home size={18} className="inline mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Check if eligible for scholarship
  const isEligible = attempt?.percentage >= (college?.scholarshipPercentage || 60)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <CreditCard className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Required</h1>
            <p className="text-gray-600">Complete your test fee payment</p>
          </div>

          {/* Test Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Your Score:</span>
                <span className="font-bold text-gray-900">{attempt?.score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Percentage:</span>
                <span className={`font-bold ${attempt?.percentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.round(attempt?.percentage)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scholarship Cutoff:</span>
                <span className="font-bold text-gray-900">{college?.scholarshipPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-bold ${isEligible ? 'text-green-600' : 'text-red-600'}`}>
                  {isEligible ? 'Eligible (Free)' : 'Not Eligible'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment or Scholarship Message */}
          {!isEligible ? (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 mb-6 text-center">
                <p className="text-sm mb-2 opacity-90">Test Fee</p>
                <p className="text-5xl font-bold">₹100</p>
                <p className="text-xs mt-2 opacity-75">One-time payment</p>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                {processing ? (
                  'Processing...'
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay Now with Razorpay
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secure payment powered by Razorpay
              </p>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <CheckCircle className="mx-auto text-green-600 mb-3" size={48} />
              <h3 className="text-xl font-bold text-green-900 mb-2">Congratulations! 🎉</h3>
              <p className="text-green-700 mb-4">
                You scored above {college?.scholarshipPercentage}% and are eligible for scholarship. No payment required!
              </p>
              <button onClick={() => navigate('/student/dashboard')} className="btn-primary w-full">
                Back to Dashboard
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Need help? Contact support@datatechalpha.com
        </p>
      </div>
    </div>
  )
}

export default PaymentPage
