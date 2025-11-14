import { Link } from 'react-router-dom'
import { FileText, ArrowLeft } from 'lucide-react'

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <FileText size={32} className="text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 mb-6">
            <strong>Last Updated:</strong> November 14, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Datatech Test Platform ("the Platform"), you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Registration</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Students must register with valid credentials (name, email, phone number)</li>
              <li>College students must provide a valid college ID</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must be at least 16 years old to use this Platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Test Taking Rules</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Tests must be taken individually without external assistance</li>
              <li>Camera proctoring may be enabled during tests</li>
              <li>Each test can only be attempted once unless explicitly allowed</li>
              <li>Test submissions are final and cannot be modified</li>
              <li>Any form of cheating will result in immediate disqualification</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Course fees are non-refundable except as specified in our Refund Policy</li>
              <li>Payment must be completed via Razorpay payment gateway</li>
              <li>All prices are in Indian Rupees (INR)</li>
              <li>Payment grants lifetime access to course materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Scholarship Eligibility</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Scholarship eligibility is determined based on test performance. The scholarship percentage cutoff is set by the admin and may vary by college or student category.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Scholarship status is determined immediately after test completion</li>
              <li>Scholarship decisions are final and cannot be appealed</li>
              <li>Scholarship does not include a monetary reward, only waiver of course fees</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on the Platform, including tests, questions, course materials, and design, is the intellectual property of Datatech. Unauthorized reproduction, distribution, or copying is strictly prohibited.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Datatech is not liable for any direct, indirect, incidental, or consequential damages arising from the use of this Platform. We do not guarantee specific outcomes from test taking or course completion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the Platform constitutes acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> arpitanand2611@gmail.com<br />
                <strong>Phone:</strong> +91 9927460199
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsConditions
