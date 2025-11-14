import { useNavigate } from 'react-router-dom'
import { CheckCircle, Home, FileText } from 'lucide-react'

const PaymentSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="text-green-600" size={48} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your test fee payment has been processed successfully.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                Payment confirmation sent to your email
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                Your test result is under evaluation
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                You can view your dashboard for updates
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/student/tests')}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              View All Tests
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Payment processed securely by Razorpay
        </p>
      </div>
    </div>
  )
}

export default PaymentSuccess
