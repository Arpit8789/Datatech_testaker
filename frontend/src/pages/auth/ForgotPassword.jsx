import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { sendPasswordRecovery } from '../../services/authService'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await sendPasswordRecovery(email)
    if (result.success) {
      toast.success('Password recovery email sent!')
      navigate('/')
    } else {
      toast.error(result.error || 'Failed to send recovery email!')
    }
    setLoading(false)
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 px-4">
      <div className="max-w-md w-full card">
        <h1 className="text-2xl font-semibold text-primary-700 mb-4 text-center">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
              <input type="email" required className="input-field pl-10" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send Reset Link'}</button>
        </form>
      </div>
    </div>
  )
}
export default ForgotPassword
