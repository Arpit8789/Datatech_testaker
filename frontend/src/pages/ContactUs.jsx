import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Clock, ArrowLeft } from 'lucide-react'

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Mail size={32} className="text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <p className="text-gray-700 mb-8">
              Have questions about our platform? We're here to help! Reach out to us through any of the following channels.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Mail className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a href="mailto:arpitanand2611@gmail.com" className="text-primary-600 hover:underline">
                    arpitanand2611@gmail.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Response time: 24-48 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Phone className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <a href="tel:+919927460199" className="text-primary-600 hover:underline text-lg">
                    +91 9927460199
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Available: Mon-Sat, 10 AM - 6 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <MapPin className="text-yellow-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-700">
                    Sahibzada Ajit Singh Nagar<br />
                    Punjab, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Clock className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Support Hours</h3>
                  <p className="text-gray-700">
                    Monday - Saturday: 10:00 AM - 6:00 PM IST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I register for tests?</h3>
                <p className="text-gray-700 text-sm">
                  Students can register by clicking "Student Signup" and providing necessary details. College students need a valid college ID.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-700 text-sm">
                  We accept all major payment methods via Razorpay including Credit/Debit cards, UPI, Net Banking, and Wallets.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How is scholarship eligibility determined?</h3>
                <p className="text-gray-700 text-sm">
                  Scholarship is awarded based on test performance. The cutoff percentage is set by the admin and varies by college or student category.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I retake a test?</h3>
                <p className="text-gray-700 text-sm">
                  Generally, each test can only be attempted once. For retake requests, contact admin support with your reason.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">When will I receive my test results?</h3>
                <p className="text-gray-700 text-sm">
                  College students receive results via email within 24-48 hours. General students see results immediately after test completion.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I access technical tests?</h3>
                <p className="text-gray-700 text-sm">
                  Technical tests are unlocked after achieving scholarship eligibility or completing payment for general tests.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-primary-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Still have questions?</strong> Feel free to reach out via email or phone, and we'll get back to you as soon as possible!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
