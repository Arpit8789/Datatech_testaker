import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Copy } from 'lucide-react'

const CollegeDashboard = () => {
  const { user } = useAuth()
  // Find collegeId - ideally, your auth context or college API fetch should provide the college document.
  // This example assumes user.labels include the college doc or fetch it from API as needed.
  const collegeId = user?.labels?.find((label) => label.startsWith('collegeId:'))?.replace('collegeId:', '') // fallback approach
  // If not, pass it via props or context from login fetch.

  const handleCopy = async () => {
    if (collegeId) {
      await navigator.clipboard.writeText(collegeId)
      alert('College code copied!')
    }
  }

  return (
    <div className="container-custom">
      {/* College code section */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-gradient-to-r from-primary-100 to-green-100 border border-primary-200 rounded-xl flex items-center gap-4 px-6 py-4 shadow-md max-w-xs w-full justify-between">
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs uppercase text-primary-700 font-medium tracking-wider">College Code</span>
            <span className="text-2xl font-bold tracking-widest text-primary-800">{collegeId || <span className="italic text-gray-400">Not found</span>}</span>
          </div>
          <button
            className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-full w-9 h-9 transition-colors"
            onClick={handleCopy}
            aria-label="Copy College Code"
            disabled={!collegeId}
          >
            <Copy size={20} />
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 max-w-xs text-center">
          Use this code to add students or for support. Save or copy for future reference.
        </p>
      </div>

      {/* Standard dashboard cards */}
      <h1 className="text-2xl font-bold mb-6">College Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <span className="inline-block text-xs bg-blue-100 text-blue-600 px-2 rounded mb-2">Registration</span>
          Student Registration
          <div className="text-xs text-gray-500 mt-2">Use StudentRegistrationForm to add more.</div>
        </div>
        <div className="card">
          <span className="inline-block text-xs bg-green-100 text-green-600 px-2 rounded mb-2">Stats</span>
          Stats
          <div className="text-xs text-gray-500 mt-2">Insightful data from CollegeDashboardStats.</div>
        </div>
        <div className="card col-span-1 md:col-span-2">
          <span className="inline-block text-xs bg-yellow-100 text-yellow-600 px-2 rounded mb-2">Students</span>
          All Registered Students
        </div>
      </div>
    </div>
  )
}

export default CollegeDashboard
