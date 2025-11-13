import React, { useState } from 'react'
import { validateEmail, validatePhone, validateName } from '../../utils/validators'

const StudentRegistrationForm = ({ onSubmit, loading = false }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateName(form.name)) return alert('Invalid name')
    if (!validateEmail(form.email)) return alert('Invalid email')
    if (!validatePhone(form.phone)) return alert('Invalid phone number')
    if (!form.password || form.password.length < 6) return alert('Password required (min 6 chars)')
    onSubmit && onSubmit(form)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" className="input-field" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" className="input-field" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Phone</label>
        <input type="tel" name="phone" className="input-field" value={form.phone} onChange={handleChange} required />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input type="password" name="password" className="input-field" value={form.password} onChange={handleChange} required />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Registering...' : 'Register Student'}
      </button>
    </form>
  )
}

export default StudentRegistrationForm
