import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Datatech Test Platform. All rights reserved.</p>
          </div>

          {/* Made with love */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Made with</span>
            <Heart size={16} className="text-red-500 fill-current" />
            <span>by Arpit Anand</span>
          </div>

          {/* Links */}
          <div className="flex space-x-6 text-sm">
            <Link
              to="/privacy"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/refund"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Refund Policy
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
