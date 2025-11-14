import { Link } from 'react-router-dom'
import { GraduationCap, Building2, Shield, ChevronDown, CheckCircle2, TrendingUp, CreditCard } from 'lucide-react'
import { useState } from 'react'

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-primary-50">
      {/* Modern Header */}
      <header className="w-full py-4 px-6 bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="rounded-xl bg-gradient-to-br from-primary-600 to-blue-600 w-12 h-12 flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:shadow-xl transition-all">
              D
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 tracking-tight block">Datatech</span>
              <span className="text-xs text-gray-500 -mt-1 block">Test Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
              >
                Login / Signup
                <ChevronDown size={18} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                  <Link
                    to="/admin/login"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Shield className="text-red-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Admin</p>
                      <p className="text-xs text-gray-500">Manage platform</p>
                    </div>
                  </Link>

                  <div className="my-2 border-t border-gray-100"></div>

                  <Link
                    to="/college/login"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Building2 className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">College Login</p>
                      <p className="text-xs text-gray-500">Manage students</p>
                    </div>
                  </Link>

                  <Link
                    to="/college/signup"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Building2 className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">College Signup</p>
                      <p className="text-xs text-gray-500">Register your college</p>
                    </div>
                  </Link>

                  <div className="my-2 border-t border-gray-100"></div>

                  <Link
                    to="/student/login"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="bg-green-100 p-2 rounded-lg">
                      <GraduationCap className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Student Login</p>
                      <p className="text-xs text-gray-500">Take tests</p>
                    </div>
                  </Link>

                  <Link
                    to="/student/signup"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="bg-green-100 p-2 rounded-lg">
                      <GraduationCap className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Student Signup</p>
                      <p className="text-xs text-gray-500">Create account</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronDown size={24} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Mobile Dropdown */}
        {showDropdown && (
          <div className="md:hidden mt-4 space-y-2">
            <Link to="/admin/login" className="block px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span className="font-medium">Admin Login</span>
            </Link>
            <Link to="/college/login" className="block px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span className="font-medium">College Login</span>
            </Link>
            <Link to="/college/signup" className="block px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span className="font-medium">College Signup</span>
            </Link>
            <Link to="/student/login" className="block px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span className="font-medium">Student Login</span>
            </Link>
            <Link to="/student/signup" className="block px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span className="font-medium">Student Signup</span>
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Excel With
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent"> Smart Assessments</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              A modern, secure, and mobile-ready test platform for institutions and candidates. Advanced proctoring, in-depth analytics, instant results, and seamless payment with full scholarship support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/student/signup"
                className="btn-primary text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
              </Link>
              <Link
                to="/college/signup"
                className="btn-secondary text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-all"
              >
                Register College
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Proctoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Camera-enabled, privacy-friendly proctoring that deters cheating while respecting candidate privacy and maintaining test integrity.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Deep Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive analytics for admins and colleges. Track scores, payments, scholarship eligibility, and performance trends in real-time.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Payments</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamlessly integrated with Razorpay for secure transactions, with automatic fee waivers for scholarship achievers and merit-based incentives.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl p-12 text-white text-center shadow-2xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <p className="text-5xl font-bold mb-2">100%</p>
                <p className="text-primary-100">Secure Platform</p>
              </div>
              <div>
                <p className="text-5xl font-bold mb-2">24/7</p>
                <p className="text-primary-100">Support Available</p>
              </div>
              <div>
                <p className="text-5xl font-bold mb-2">Fast</p>
                <p className="text-primary-100">Result Processing</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      {/* Modern Footer */}
<footer className="bg-gray-900 text-gray-300 py-8">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-primary-600 to-blue-600 w-10 h-10 flex items-center justify-center text-white font-bold text-xl">
          D
        </div>
        <div>
          <p className="font-semibold text-white">Datatech Test Platform</p>
          <p className="text-sm text-gray-400">© 2025 All rights reserved</p>
        </div>
      </div>

      <div className="flex gap-6">
        <Link
          to="/privacy"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Terms
        </Link>
        <Link
          to="/refund"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Refund Policy
        </Link>
        <Link
          to="/contact"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Contact
        </Link>
      </div>
    </div>
  </div>
</footer>

    </div>
  )
}

export default HomePage
