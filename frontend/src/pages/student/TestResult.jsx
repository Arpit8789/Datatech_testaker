import { useNavigate } from 'react-router-dom'
import { CheckCircle, Mail, Home, Clock } from 'lucide-react'

const TestResult = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="text-green-600" size={56} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test Submitted Successfully! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for completing the test
          </p>
        </div>

        {/* Main Message Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-10 mb-6">
          <div className="text-center space-y-6">
            {/* Email Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
              <Mail className="text-blue-600" size={32} />
            </div>

            {/* Main Message */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your Test is Under Evaluation
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our team is carefully reviewing your submission. You will receive your detailed results via email within <span className="font-bold text-primary-600">24-48 hours</span>.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-primary-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-start gap-3 text-left">
                <Clock className="text-blue-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-gray-900 mb-2">What happens next?</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>✅ Your answers have been saved securely</li>
                    <li>📧 Results will be sent to your registered email</li>
                    <li>📊 You'll receive a detailed performance report</li>
                    <li>🎓 Check back on your dashboard for updates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 btn-primary py-4 text-lg"
          >
            <Home size={20} />
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/student/tests')}
            className="flex-1 flex items-center justify-center gap-2 btn-secondary py-4 text-lg"
          >
            View All Tests
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Submitted on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          <p className="mt-2">
            Questions? Email us at{' '}
            <a href="mailto:support@datatechalpha.com" className="text-primary-600 hover:underline font-medium">
              support@datatechalpha.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TestResult
