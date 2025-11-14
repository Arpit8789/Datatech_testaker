import { Link } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Shield size={32} className="text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 mb-6">
            <strong>Last Updated:</strong> November 14, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Name, email address, phone number</li>
              <li>College ID (for college students)</li>
              <li>Test performance data and scores</li>
              <li>Payment transaction details</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>IP address and browser information</li>
              <li>Login timestamps and activity logs</li>
              <li>Camera feed during proctored tests (not stored)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>To provide access to tests and course materials</li>
              <li>To process payments and manage scholarships</li>
              <li>To communicate test results and updates</li>
              <li>To improve our services and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Encrypted data transmission (HTTPS/SSL)</li>
              <li>Secure authentication via Appwrite</li>
              <li>Payment processing through Razorpay (PCI DSS compliant)</li>
              <li>Regular security audits and updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do NOT sell your personal information. We may share data with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Your College:</strong> Test scores and performance data (college students only)</li>
              <li><strong>Payment Processor:</strong> Razorpay for transaction processing</li>
              <li><strong>Legal Authorities:</strong> When required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies to maintain your session and improve user experience. You can disable cookies in your browser, but this may affect Platform functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent (where applicable)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, contact us at: <strong>arpitanand2611@gmail.com</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide services. Test scores and payment records are retained for 7 years for compliance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For privacy-related questions or concerns:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> arpitanand2611@gmail.com<br />
                <strong>Phone:</strong> +91 9927460199<br />
                <strong>Website:</strong> https://data-tech-alpha.netlify.app
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
