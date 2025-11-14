import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CreditCard, CheckCircle, AlertCircle, Home } from 'lucide-react'
import toast from 'react-hot-toast'
import { databases } from '../../config/appwrite'
import { APPWRITE_CONFIG } from '../../config/constants'
import { useAuth } from '../../context/AuthContext'
import { Query } from 'appwrite'

const PaymentPage = () => {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const { studentData } = useAuth()
  const [attempt, setAttempt] = useState(null)
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const isGeneralStudent = !studentData?.collegeId || studentData?.studentType === 'general'

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

      const testDoc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.tests,
        attemptDoc.testId
      )
      setTest(testDoc)
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
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
      amount: 94900, // ✅ ₹949 in paise (949 × 100)
      currency: 'INR',
      name: 'Datatech Test Platform',
      description: `${test?.testName} - Course Fee`,
      image: '/logo.png',
      handler: async function (response) {
        try {
          await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.attempts,
            attemptId,
            {
              paymentStatus: 'paid',
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id || 'N/A',
              paidAt: new Date().toISOString(),
              testName: test?.testName // ✅ Store test name
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

  if (attempt?.paymentStatus === 'paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Paid</h1>
          <p className="text-gray-600 mb-6">This course fee has already been paid.</p>
          <button onClick={() => navigate('/student/dashboard')} className="btn-primary w-full">
            <Home size={18} className="inline mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <CreditCard className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
            <p className="text-gray-600">{test?.testName}</p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 mb-6 text-center">
            <p className="text-sm mb-2 opacity-90">Course Fee</p>
            <p className="text-5xl font-bold mb-2">₹949</p>
            <p className="text-xs opacity-75">One-time payment • Lifetime access</p>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
          >
            {processing ? 'Processing...' : (
              <>
                <CreditCard size={20} />
                Pay Now with Razorpay
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 100% Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
