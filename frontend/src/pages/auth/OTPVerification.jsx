import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { verifyOTP } from '../../services/authService'

const OTPVerification = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  // Normally you'd get userId from route or location state
  const userId = location.state?.userId || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await verifyOTP(userId, otp)
    if (result.success) {
      toast.success('Email verified successfully!')
      navigate('/student/login')
    } else {
      toast.error(result.error || 'OTP verification failed!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 px-4">
      <div className="max-w-md w-full card">
        <h1 className="text-2xl font-semibold text-primary-700 mb-4 text-center">Verify OTP</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
              <input type="text" inputMode="numeric" required maxLength={6} minLength={6} className="input-field pl-10" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)}/>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Verifying...' : 'Verify OTP'}</button>
        </form>
      </div>
    </div>
  )
}
export default OTPVerification
