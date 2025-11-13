import { Link } from 'react-router-dom'

const HomePage = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-blue-100">
    <header className="w-full py-5 px-6 shadow bg-white flex justify-between items-center z-10">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary-600 w-10 h-10 flex items-center justify-center text-white font-bold text-2xl shadow">D</div>
        <span className="text-xl font-bold text-primary-800 tracking-wide">Datatech Test Platform</span>
      </div>
      <div className="flex gap-3">
        <Link to="/admin/login" className="btn-secondary">Admin Login</Link>
        <Link to="/college/login" className="btn-secondary">College Login</Link>
        <Link to="/college/signup" className="btn-primary">Sign Up</Link>
        <Link to="/student/login" className="btn-primary">Student Login</Link>
      </div>
    </header>
    <main className="flex-grow flex flex-col justify-center items-center text-center px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animated-fadeIn">Excel With Smart Assessments</h1>
      <p className="text-lg max-w-2xl text-gray-700 mb-8">
        A modern, secure, and mobile-ready test platform for institutions and candidates. Advanced proctoring, in-depth analytics, instant results, seamless payment and full support for scholarship-based tests.
      </p>
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl mb-10">
        <div className="card hover:shadow-lg transition-all border-primary-100 border-t-4">
          <div className="mb-2 px-4">
            <span className="inline-block bg-primary-600 text-white rounded-full px-3 py-1 text-sm font-medium">Proctored</span>
          </div>
          <h3 className="text-lg font-bold text-primary-700 mb-1">AI-based Proctoring</h3>
          <p className="text-gray-600 text-sm">Camera-enabled, privacy-friendly proctoring deters cheating while respecting candidate privacy.</p>
        </div>
        <div className="card hover:shadow-lg transition-all border-green-100 border-t-4">
          <div className="mb-2 px-4">
            <span className="inline-block bg-green-600 text-white rounded-full px-3 py-1 text-sm font-medium">Analytics</span>
          </div>
          <h3 className="text-lg font-bold text-green-700 mb-1">Result Analytics</h3>
          <p className="text-gray-600 text-sm">In-depth analytics for admins and colleges. Track scores, payments, eligibility and more.</p>
        </div>
        <div className="card hover:shadow-lg transition-all border-blue-100 border-t-4">
          <div className="mb-2 px-4">
            <span className="inline-block bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-medium">Payments</span>
          </div>
          <h3 className="text-lg font-bold text-blue-700 mb-1">Smart Payment</h3>
          <p className="text-gray-600 text-sm">Integrated with Razorpay, with automatic fee waivers for scholarship achievers.</p>
        </div>
      </div>
      <Link to="/student/login" className="btn-primary text-lg px-8 py-3 mt-2">Get Started</Link>
    </main>
    <footer className="py-5 flex flex-col md:flex-row items-center justify-center md:justify-between border-t bg-white/80 text-sm px-3">
      <div className="mb-2 md:mb-0">Made with <span className="text-red-600 text-lg">♥</span> by Arpit Anand</div>
      <div className="flex gap-4">
        <a href="https://github.com/Arpit8789/Datatech_testaker" target="_blank" rel="noopener noreferrer" className="text-primary-700 underline hover:text-primary-900">GitHub</a>
      </div>
    </footer>
  </div>
)

export default HomePage
