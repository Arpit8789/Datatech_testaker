import { Link } from 'react-router-dom'
import { DollarSign, ArrowLeft } from 'lucide-react'

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <DollarSign size={32} className="text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Cancellation & Refund Policy</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 mb-6">
            <strong>Last Updated:</strong> November 14, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. General Refund Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Datatech Test Platform, we strive to provide high-quality test and course experiences. Due to the digital nature of our services, all payments are generally <strong>non-refundable</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed">
              However, we understand exceptional circumstances may arise. Please review our specific refund conditions below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligible Refund Situations</h2>
            <p className="text-gray-700 mb-4">Refunds may be granted in the following cases:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>
                <strong>Duplicate Payment:</strong> If you are charged multiple times for the same test/course
              </li>
              <li>
                <strong>Technical Failure:</strong> If you cannot access the test or course due to a platform error (within 48 hours of payment)
              </li>
              <li>
                <strong>Payment Error:</strong> If payment was deducted but test access was not granted
              </li>
              <li>
                <strong>Unauthorized Transaction:</strong> If your account was accessed without authorization (must be reported within 24 hours with proof)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Non-Refundable Situations</h2>
            <p className="text-gray-700 mb-4">Refunds will <strong>NOT</strong> be issued in the following cases:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>After you have accessed the test or course materials</li>
              <li>If you fail to achieve the scholarship cutoff percentage</li>
              <li>If you change your mind after purchasing</li>
              <li>If you are disqualified for violating test rules</li>
              <li>After 7 days from the date of purchase</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Refund Request Process</h2>
            <p className="text-gray-700 mb-4">To request a refund:</p>
            <ol className="list-decimal list-inside text-gray-700 space-y-3">
              <li>Send an email to <strong>arpitanand2611@gmail.com</strong></li>
              <li>Include your:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Full name and registered email</li>
                  <li>Payment ID / Transaction ID</li>
                  <li>Reason for refund request with supporting evidence</li>
                </ul>
              </li>
              <li>Our team will review your request within <strong>5-7 business days</strong></li>
              <li>If approved, refund will be processed within <strong>7-10 business days</strong></li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Refund Method</h2>
            <p className="text-gray-700 leading-relaxed">
              Approved refunds will be credited back to the <strong>original payment method</strong> used during purchase (bank account, UPI, card, etc.). Processing time may vary based on your bank/payment provider.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cancellation Policy</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>You may cancel your test registration <strong>before taking the test</strong></li>
              <li>Once a test is started, it cannot be cancelled</li>
              <li>Test cancellation does not guarantee a refund</li>
              <li>Contact us immediately at <strong>+91 9927460199</strong> for urgent cancellations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Scholarship Waiver Clarification</h2>
            <p className="text-gray-700 leading-relaxed">
              If you qualify for a scholarship <strong>before making payment</strong>, you are NOT required to pay. If you have already paid and later qualify for scholarship, the payment is <strong>non-refundable</strong> as access to course materials has been granted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact for Refunds</h2>
            <p className="text-gray-700 mb-4">
              For refund-related queries:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> arpitanand2611@gmail.com<br />
                <strong>Phone:</strong> +91 9927460199<br />
                <strong>Support Hours:</strong> Monday - Saturday, 10 AM - 6 PM IST
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default RefundPolicy
